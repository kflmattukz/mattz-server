import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
// import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get()
  getUser(@GetUser('email') email: string) {
    return email;
  }

  @Post(':id')
  updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body('firstname') firstname: string,
    @Body('lastname') lastname: string,
  ) {
    return this.userService.updateProfile(id, firstname, lastname);
  }

  @Post('pass/:id')
  updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body('currPass') currPass: string,
    @Body('newPass') newPass: string,
  ) {
    return this.userService.updatePassword(id, currPass, newPass);
  }
}
