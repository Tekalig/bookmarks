import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Payload } from './payload';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @Post('signup')
  signup(@Body() payload: Payload) {
    return this.authservice.signup(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() payload: Payload) {
    return this.authservice.signin(payload);
  }
}
