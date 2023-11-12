import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { AddUserDto, FindUserDto, DeleteUserDto } from '@user/dto';

@Injectable()
export class UserRepository {
    constructor(private readonly prismaService: PrismaService) {}

    public create(dto: AddUserDto) {
        return this.prismaService.user.create({ data: { ...dto, roles: ['USER'] } });
    }
    public get(dto: FindUserDto) {
        return this.prismaService.user.findFirst({
            where: { id: dto.id },
        });
    }
    public getAll() {
        return this.prismaService.user.findMany();
    }
}
