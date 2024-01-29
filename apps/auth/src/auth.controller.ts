import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  HttpCode,
  Res,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './services/jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(200)
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const res = await this.authService.login(req.user);
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + 24 * 60 * 60 * 1000); // 24 hour in milliseconds
    response.cookie('jwt', res.access_token, {
      httpOnly: true,
      expires: expiryDate,
    });
    return { jwt: res.access_token };
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
