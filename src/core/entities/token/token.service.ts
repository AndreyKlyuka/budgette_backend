import { Injectable } from '@nestjs/common';
import { TokenRepository } from './repository/token.repository';
import { CreateTokenDto } from '../token/dto';
import { Token } from '@prisma/client';
import { BusinessException, ErrorCode } from '@exceptions';

@Injectable()
export class TokenService {
    constructor(private readonly tokenRepository: TokenRepository) {}

    public async create(dto: CreateTokenDto): Promise<Token> {
        const refreshToken: Token = await this.tokenRepository.create(dto);
        if (!refreshToken) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_NOT_CREATED);
        }
        return refreshToken;
    }
}
