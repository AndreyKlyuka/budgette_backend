import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { AddUserDto } from '@user/dto/add-user.dto';
import { FindUserDto } from '@user/dto/find-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(dto: AddUserDto) {
    return this.prismaService.user.create({ data: { ...dto, roles: ['USER'] } });
  }
  findOne(dto: FindUserDto) {
    return this.prismaService.user.findFirst({
      where: { id: dto.id },
    });
  }
  findAll() {
    return this.prismaService.user.findMany();
  }
}
