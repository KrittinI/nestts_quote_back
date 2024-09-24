import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { QuotesService } from './quotes/quotes.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UsersService,
    private readonly quotesService: QuotesService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async vote(@Body() body: string, @Request() req) {
    const { voteId, deleteId } = req.body;
    console.log(req.body, 'in app');
    const user = await this.userService.findUserByID(req.user.id);
    console.log(user.isVoted);
    if (user.isVoted) {
      throw new Error('User already voted');
    }
    const result = await this.quotesService.voted(+voteId);
    if (!result) {
      throw new Error('cannot update');
    }
    const updateUser = this.userService.userVoted(req.user.id);
    console.log(updateUser);
    return result;
  }
}
