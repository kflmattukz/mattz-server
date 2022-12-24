import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() data: AuthDto) {
    return this.authService.signup(data);
  }

  @Post('signin')
  signin(@Body() data: AuthDto) {
    return this.authService.signin(data);
  }
}
