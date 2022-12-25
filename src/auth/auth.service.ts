import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(data: AuthDto): Promise<{ access_token: string }> {
    const hash = await argon.hash(data.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          hash,
        },
      });
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new ForbiddenException('Credentials Taken');
    }
  }

  async signin(data: AuthDto): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) throw new ForbiddenException('Credetials Incorrect');

    const isMatch = await argon.verify(user.hash, data.password);

    if (!isMatch) throw new ForbiddenException('Credetials Incorrect');

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }
}
