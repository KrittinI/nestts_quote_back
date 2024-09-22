import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('quotes')
export class QuotesController {
  constructor(
    private readonly quotesService: QuotesService,
    private userService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createQuoteDto: CreateQuoteDto, @Request() req) {
    createQuoteDto.creator = req.user.id;
    return this.quotesService.create(createQuoteDto);
  }

  @Get()
  findAll() {
    return this.quotesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotesService.findOneBy(+id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.quotesService.findOne(+id);
  // }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuoteDto: UpdateQuoteDto,
    @Request() req,
  ) {
    const quote = await this.quotesService.findOneBy(+id);

    if (quote.creator !== req.user.id) {
      throw new Error('No permission on this quote');
    }

    if (quote.voted !== 0) {
      throw new Error('Cannot edit');
    }

    return this.quotesService.update(+id, updateQuoteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/voted')
  async voted(@Param('id') id: string, @Request() req) {
    const user = await this.userService.findUserByID(req.user.id);
    console.log(user.isVoted);
    if (user.isVoted) {
      throw new Error('User already voted');
    }
    const result = await this.quotesService.voted(+id);
    if (!result) {
      throw new Error('cannot update');
    }
    this.userService.userVoted(req.user.id);
    return result;
  }

  // @UseGuards(JwtAuthGuard)
  // @Patch(':id/unvoted')
  // async unvoted(@Param('id') id: string, @Request() req) {
  //   const result = await this.quotesService.unvoted(+id);
  //   console.log(result);
  //   if (!result) {
  //     throw new Error('cannot update');
  //   }
  //   console.log(req.user.id);
  //   this.userService.userUnvoted(req.user.id);
  //   return result;
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quotesService.remove(+id);
  }
}
