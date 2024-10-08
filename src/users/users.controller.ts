import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/register.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Request() req) {
    const user = await this.usersService.findUserByID(req.user.id);
    console.log(user);
    delete user.password;
    // this.usersService.findByUserName({ username });
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/voted')
  userVoted(@Request() req) {
    this.usersService.userVoted(req.user.id);
    return {
      message: `Voted`,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/unvoted')
  userUnvoted(@Request() req) {
    this.usersService.userUnvoted(req.user.id);
    return {
      message: `Unvoted`,
    };
  }
}
