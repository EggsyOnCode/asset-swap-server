import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}
  async validateUser(username: string, pwd: string) {
    const user = await this.userService.validate(username, pwd);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
