import { ConflictException, Injectable } from '@nestjs/common';
import { CreateOrUpdateUserDto } from './dto';
import { UserRepository } from './repository/user.repository';
import { genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    public create(dto: CreateOrUpdateUserDto) {
        const existingUser = this.findByEmail(dto.email);
        if (existingUser) {
            throw new ConflictException('User with this email already exist');
        }
        const hashedPassword = this.hashPassword(dto.password);
        return this.userRepository.create({ ...dto, password: hashedPassword });
    }

    public getOne(id: string) {
        return this.userRepository.find(id);
    }
    public getAll() {
        return this.userRepository.findAll();
    }

    private hashPassword(password: string) {
        return hashSync(password, genSaltSync(10));
    }

    private findByEmail(email: string) {
        return this.userRepository.findByEmail(email);
    }
}
