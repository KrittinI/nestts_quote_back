import { Controller, Post, Request, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Response({ passthrough: true }) res) {
    const { accessToken } = await this.authService.login(req.user);
    // return this.authService.create(createAuthDto);
    // save to cookie
    res.cookie('access_token', accessToken, { httpOnly: true });
    // return { accessToken };
    return {
      message: 'Login Successful',
    };
  }
}
