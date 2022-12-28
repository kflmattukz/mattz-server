import {
  Body,
  Controller,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { JwtGuard } from './guard';
import { GetUser } from './decorator';

interface AccessToken {
  access_token: string;
}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() data: AuthDto): Promise<AccessToken> {
    return this.authService.signup(data);
  }

  @Post('signin')
  signin(@Body() data: AuthDto): Promise<AccessToken> {
    return this.authService.signin(data);
  }

  @UseGuards(JwtGuard)
  @Patch('password')
  updatePassword(
    @GetUser('id', ParseIntPipe) id: number,
    @Body('currPass') currPass: string,
    @Body('newPass') newPass: string,
  ): Promise<AccessToken> {
    return this.authService.updatePassword(id, currPass, newPass);
  }
}
