import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

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

  async login(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOneBy({
      username: createUserDto.username,
    });
    if (!user) {
      throw new Error('username or password not correct');
    }

    const isMatch = await bcrypt.compare(createUserDto.password, user.password);

    if (!isMatch) {
      throw new Error('username or password not correct');
    }

    const payload = { id: user.id, username: user.username };

    return {
      accesstoken: await jwt.sign(payload, process.env.JWT_SECRET),
    };
    return createUserDto;
  }

  async findByUserName(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  findOne(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
