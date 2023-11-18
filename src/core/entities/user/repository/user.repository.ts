import { Injectable } from '@nestjs/common';
import { CreateOrUpdateUserDto } from '../dto';
import { PrismaService } from '@database/prisma.service';

@Injectable()
export class UserRepository {
    constructor(private readonly prismaService: PrismaService) {}

    public async create(dto: CreateOrUpdateUserDto) {
        return this.prismaService.user.create({ data: { ...dto, roles: ['USER'] } });
    }
    public async find(id: string) {
        return this.prismaService.user.findFirst({
            where: { id: id },
        });
    }
    public async findAll() {
        return this.prismaService.user.findMany();
    }

    public async update(id: string, data: CreateOrUpdateUserDto) {
        return this.prismaService.user.update({
            where: { id: id },
            data: data,
        });
    }

    public async findByEmail(email: string) {
        return this.prismaService.user.findFirst({
            where: { email: email },
        });
    }
}
