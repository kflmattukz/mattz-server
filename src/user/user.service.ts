import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(userId: number, firstname: string, lastname: string) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          firstname,
          lastname,
        },
      });
      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User not found, please try again later');
      }
    }
  }

  async updatePassword(userId: number, currPass: string, newPass: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      const isMatch = argon.verify(user.hash, currPass);
      if (!isMatch) throw new ForbiddenException('Credetials Incorrect');

      const hash = await argon.hash(newPass);
      return await this.prisma.user.update({
        where: { id: userId },
        data: { hash },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('User Not Found');
      }
    }
  }
}
