import { Injectable } from '@nestjs/common';
import { CreateOrUpdateUserDto } from '../dto';
import { PrismaService } from '@database/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
    constructor(private readonly prismaService: PrismaService) {}

    public async create(dto: CreateOrUpdateUserDto): Promise<User> {
        return this.prismaService.user.create({ data: { ...dto, roles: ['USER'] } });
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
    //Need for future user update logic
    // public async update(id: string, dto: CreateOrUpdateUserDto): Promise<User> {
    //     return this.prismaService.user.update({
    //         where: { id: id },
    //         data: { ...dto },
    //     });
    // }
}
