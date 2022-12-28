import {
  Body,
  Controller,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
// import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('')
  updateProfile(
    @GetUser('id', ParseIntPipe) id: number,
    @Body('firstname') firstname: string,
    @Body('lastname') lastname: string,
  ) {
    return this.userService.updateProfile(id, firstname, lastname);
  }

  @Patch('pass')
  updatePassword(
    @GetUser('id', ParseIntPipe) id: number,
    @Body('currPass') currPass: string,
    @Body('newPass') newPass: string,
  ) {
    return this.userService.updatePassword(id, currPass, newPass);
  }
}
