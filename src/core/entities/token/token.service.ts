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

    public async deleteByToken(token: string): Promise<Token> {
        const deletedToken: Token = await this.tokenRepository.deleteByToken(token);

        if (!deletedToken) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }

        return deletedToken;
    }

    public async findByToken(token: string): Promise<Token> {
        return this.tokenRepository.findByToken(token);
    }
}
