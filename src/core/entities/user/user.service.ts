import { Injectable } from '@nestjs/common';
import { UserDto } from './dto';
import { UserRepository } from './repository/user.repository';
import { BusinessException, ErrorCode } from '@exceptions';
import { Role, User } from '@prisma/client';
import { hashPassword } from '@utils/hash-password.helper';
import { JwtPayload } from '@interfaces';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async create(dto: UserDto): Promise<User> {
    const user: User = await this.findByEmail(dto.email);
    if (user) {
      throw new BusinessException(ErrorCode.BAD_REQUEST_TO_REGISTER_USER);
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
    const isUserAdmin: boolean = currentUser.roles.includes(Role.ADMIN);
    const isUserCurrent: boolean = id === currentUser.id;
    if (!isUserAdmin || isUserCurrent) {
      throw new BusinessException(ErrorCode.FORBIDDEN_TO_DELETE_USER);
    }
    return this.userRepository.delete(id);
  }
}
