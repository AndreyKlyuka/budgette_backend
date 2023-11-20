import { Injectable } from '@nestjs/common';
import { CreateOrUpdateUserDto } from './dto';
import { UserRepository } from './repository/user.repository';
import { genSaltSync, hashSync } from 'bcrypt';
import { BusinessException, ErrorCode } from '@exceptions';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    public async create(dto: CreateOrUpdateUserDto): Promise<User> {
        const user: User = await this.findOneByEmail(dto.email);

        if (user) {
            throw new BusinessException(ErrorCode.USER_EMAIL_ALREADY_EXIST);
        }

        const hashedPassword: string = this.hashPassword(dto.password);
        return this.userRepository.create({ ...dto, password: hashedPassword });
    }
    public async findOneByEmail(email: string): Promise<User> {
        return this.userRepository.findByEmail(email);
    }
    public async findOneById(id: string): Promise<User> {
        return this.userRepository.findById(id);
    }
    public async findAll(): Promise<User[]> {
        return this.userRepository.findAll();
    }
    private hashPassword(password: string): string {
        return hashSync(password, genSaltSync(10));
    }
}
