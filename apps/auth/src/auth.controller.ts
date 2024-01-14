import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './services/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(200)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('info')
  getInfo() {
    return 'hello world';
  }
}
