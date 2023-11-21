import { PrismaService } from '@database/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateOrUpdateTokenDto } from '../dto';
import { Token } from '@prisma/client';

@Injectable()
export class TokenRepository {
    constructor(private readonly prismaService: PrismaService) {}

    public async create(dto: CreateOrUpdateTokenDto): Promise<Token> {
        return this.prismaService.token.create({
            data: { ...dto },
        });
    }

    public async update({ token, exp }: CreateOrUpdateTokenDto, existToken: string): Promise<Token> {
        return this.prismaService.token.update({
            where: { token: existToken },
            data: { token, exp },
        });
    }
    public async findByToken(token: string): Promise<Token> {
        return this.prismaService.token.findUnique({
            where: { token: token },
        });
    }
    public async findByUserIdAndUserAgent(userId: string, userAgent: string): Promise<Token> {
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
