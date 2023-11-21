import { PrismaService } from '@database/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateOrUpdateTokenDto } from '../dto';
import { Token } from '@prisma/client';

@Injectable()
export class TokenRepository {
    constructor(private readonly prismaService: PrismaService) {}

    public async create(dto: CreateOrUpdateTokenDto): Promise<Token> {
        return this.prismaService.token.create({
            data: { token: dto.token, exp: dto.expiresIn, userId: dto.userId, userAgent: dto.userAgent },
        });
    }

    public async update(dto: CreateOrUpdateTokenDto, token: string): Promise<Token> {
        return this.prismaService.token.update({
            where: { token: token },
            data: { token: dto.token, exp: dto.expiresIn },
        });
    }
    public async findByToken(token: string): Promise<Token> {
        return this.prismaService.token.findUnique({
            where: { token: token },
        });
    }
    public async findByUserIdAndUserAgent(userId: string, userAgent: string) {
        return this.prismaService.token.findFirst({
            where: {
                userId: userId,
                userAgent: userAgent,
            },
        });
    }
    public async deleteByToken(token: string): Promise<Token> {
        return this.prismaService.token.delete({
            where: { token: token },
        });
    }
}
