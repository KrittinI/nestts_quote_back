import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUserName(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const result = user;
      return {
        username: result.username,
        id: result.id,
        isVoted: result.isVoted,
      };
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      id: user.id,
      isVoted: user.isVoted,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
