import { PrismaService } from '@database/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateTokenDto } from '../dto';
import { Token } from '@prisma/client';

@Injectable()
export class TokenRepository {
    constructor(private readonly prismaService: PrismaService) {}
    public async create(dto: CreateTokenDto): Promise<Token> {
        return this.prismaService.token.create({
            data: { token: dto.token, exp: dto.expiresIn, userId: dto.userId },
        });
    }
    public async deleteByToken(token: string): Promise<Token> {
        return this.prismaService.token.delete({
            where: { token: token },
        });
    }
}
