import { Injectable } from '@nestjs/common';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { Quote } from './entities/quote.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quote)
    private quotesRepository: Repository<Quote>,
  ) {}
  create(createQuoteDto: CreateQuoteDto) {
    return this.quotesRepository.save(createQuoteDto);
  }

  findAll() {
    return this.quotesRepository.find();
  }

  findOneBy(id: number) {
    return this.quotesRepository.findOneBy({ id });
  }

  update(id: number, updateQuoteDto: UpdateQuoteDto) {
    return this.quotesRepository.update(id, updateQuoteDto);
  }

  async voted(id: number) {
    const quote = await this.quotesRepository.findOneBy({ id });

    this.quotesRepository.update(id, { voted: quote.voted + 1 });
    return { ...quote, voted: quote.voted + 1 };
  }

  // unvoted(id: number) {
  // return this.quotesRepository.update(id);
  // }

  remove(id: number) {
    return this.quotesRepository.delete(id);
  }
}
