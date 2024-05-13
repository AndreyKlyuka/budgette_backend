import { Injectable } from '@nestjs/common';
import { UserDto } from '../dto';
import { PrismaService } from '@database/prisma.service';
import { Role, User } from '@prisma/client';

const defaultUserRole: Role[] = ['USER'];
@Injectable()
export class UserRepository {
    constructor(private readonly prismaService: PrismaService) {}

    public async create(dto: UserDto): Promise<User> {
        return this.prismaService.user.create({ data: { ...dto, roles: defaultUserRole } });
    }
    public async findByEmail(email: string): Promise<User> {
        return this.prismaService.user.findFirst({
            where: { email: email },
        });
    }
    public async findById(id: string) {
        return this.prismaService.user.findFirst({
            where: { id: id },
        });
    }
    public async findAll(): Promise<User[]> {
        return this.prismaService.user.findMany();
    }

    public async delete(id: string): Promise<Partial<User>> {
        return this.prismaService.user.delete({
            where: { id: id },
            select: { id: true },
        });
    }
    //Need for future user update logic
    // public async update(id: string, dto: CreateOrUpdateUserDto): Promise<User> {
    //     return this.prismaService.user.update({
    //         where: { id: id },
    //         data: { ...dto },
    //     });
    // }
}
