import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { AddUserDto } from '@user/dto/add-user.dto';
import { FindUserDto } from '@user/dto/find-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public create(dto: AddUserDto) {
    return this.prismaService.user.create({ data: { ...dto, roles: ['USER'] } });
  }
  public findOne(dto: FindUserDto) {
    return this.prismaService.user.findFirst({
      where: { id: dto.id },
    });
  }
  public findAll() {
    return this.prismaService.user.findMany();
  }
}
