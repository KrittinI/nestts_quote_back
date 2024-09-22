import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.confirmpassword) {
      throw new Error('password and confirmpassword is not match');
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    delete createUserDto.confirmpassword;

    return this.userRepository.save(createUserDto);
  }

  async findByUserName(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  findOne(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  findUserByID(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  userVoted(id: number) {
    return this.userRepository.update(id, { isVoted: true });
  }

  userUnvoted(id: number) {
    return this.userRepository.update(id, { isVoted: false });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
