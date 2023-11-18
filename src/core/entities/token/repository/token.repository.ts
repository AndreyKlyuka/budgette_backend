import { PrismaService } from '@database/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateTokenDto } from '../dto';
import { Token } from '@prisma/client';

@Injectable()
export class TokenRepository {
    constructor(private readonly prismaService: PrismaService) {}
    public create(dto: CreateTokenDto): Promise<Token> {
        return this.prismaService.token.create({
            data: { token: dto.tokenName, exp: dto.expiresIn, userId: dto.userId },
        });
    }
}
