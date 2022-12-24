import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(data: AuthDto): Promise<User | undefined> {
    // generate a hash password
    const hash = await argon.hash(data.password);
    try {
      // create new user
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          hash,
        },
      });
      // delete hash before return
      delete user.hash;
      // return new user
      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      )
        throw new ForbiddenException('Credentials Taken');
    }
  }

  async signin(data: AuthDto): Promise<User | undefined> {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    // check if user exist, if not throw error
    if (!user) throw new ForbiddenException('Credetials Incorrect');

    const isMatch = await argon.verify(user.hash, data.password);
    // chech if password is correct, if not throw error
    if (!isMatch) throw new ForbiddenException('Credetials Incorrect');
    // delete hash before return
    delete user.hash;
    // return user;
    return user;
  }
}
