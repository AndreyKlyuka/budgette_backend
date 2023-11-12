import { Injectable } from '@nestjs/common';
import { AddUserDto } from '@user/dto/add-user.dto';
import { UserRepository } from '@user/user.repository';
import { genSaltSync, hashSync } from 'bcrypt';
import { FindUserDto } from '@user/dto/find-user.dto';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}
    public add(dto: AddUserDto) {
        const hashedPassword = this.hashPassword(dto.password);
        return this.userRepository.create({ ...dto, password: hashedPassword });
    }

    public findOne(dto: FindUserDto) {
        return this.userRepository.get(dto);
    }
    public findAll() {
        return this.userRepository.getAll();
    }

    private hashPassword(password: string) {
        return hashSync(password, genSaltSync(10));
    }
}
