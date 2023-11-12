import { Injectable } from '@nestjs/common';
import { AddUserDto } from '@user/dto/add-user.dto';
import { UserRepository } from '@user/user.repository';
import { genSaltSync, hashSync } from 'bcrypt';
import { FindUserDto } from '@user/dto/find-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  add(dto: AddUserDto) {
    const hashedPassword = this.hashPassword(dto.password);
    return this.userRepository.create({ ...dto, password: hashedPassword });
  }

  findOne(dto: FindUserDto) {
    return this.userRepository.findOne(dto);
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }
}
