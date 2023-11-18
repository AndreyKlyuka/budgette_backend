import { Injectable } from '@nestjs/common';
import { TokenRepository } from '@entities/token/repository/token.repository';
import { CreateTokenDto } from '@entities/token/dto';
import { Token } from '@prisma/client';

@Injectable()
export class TokenService {
    constructor(private readonly tokenRepository: TokenRepository) {}

    public create(dto: CreateTokenDto): Promise<Token> {
        return this.tokenRepository.create(dto);
    }
}
