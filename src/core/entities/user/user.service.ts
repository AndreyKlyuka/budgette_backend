import { Injectable } from '@nestjs/common';
import { CreateOrUpdateUserDto } from './dto';
import { UserRepository } from './repository/user.repository';
import { BusinessException, ErrorCode } from '@exceptions';
import { User } from '@prisma/client';
import { JwtPayload } from '@core/auth/interfaces';
import { RolesConstant } from '@constants/roles.constant';
import { hashPassword } from '@utils/hash-password.helper';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    public async create(dto: CreateOrUpdateUserDto): Promise<User> {
        const user: User = await this.findByEmail(dto.email);

        if (user) {
            throw new BusinessException(ErrorCode.USER_EMAIL_ALREADY_EXIST);
        }

        const hashedPassword: string = hashPassword(dto.password);
        return this.userRepository.create({ ...dto, password: hashedPassword });
    }

    public async findByEmail(email: string): Promise<User> {
        return this.userRepository.findByEmail(email);
    }
    public async findById(id: string): Promise<User> {
        return this.userRepository.findById(id);
    }
    public async findAll(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    public async delete(id: string, currentUser: JwtPayload): Promise<Partial<User>> {
        if (!currentUser.roles.includes(RolesConstant.ADMIN)) {
            throw new BusinessException(ErrorCode.FORBIDDEN_TO_DELETE_USER);
        }
        if (id === currentUser.id) {
            throw new BusinessException(ErrorCode.FORBIDDEN_TO_DELETE_USER);
        }
        return this.userRepository.delete(id);
    }
}
