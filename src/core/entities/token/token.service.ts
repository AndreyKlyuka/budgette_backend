import { Injectable } from '@nestjs/common';
import { TokenRepository } from './repository/token.repository';
import { TokenDto } from '../token/dto';
import { Token } from '@prisma/client';
import { BusinessException, ErrorCode } from '@exceptions';

@Injectable()
export class TokenService {
    constructor(private readonly tokenRepository: TokenRepository) {}

    public async upsert(dto: TokenDto, token: string): Promise<Token> {
        if (!token) {
            return this.validateTokenCreation(this.tokenRepository.create(dto));
        }
        return this.validateTokenCreation(this.tokenRepository.update(dto, token));
    }

    public async deleteByToken(token: string): Promise<Token> {
        const existToken: Token = await this.tokenRepository.findByToken(token);
        if (!existToken) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }
        return await this.tokenRepository.deleteByToken(token);
    }

    public async findByToken(token: string): Promise<Token> {
        return this.tokenRepository.findByToken(token);
    }
    public async findByUserIdAndUserAgent(userId: string, uerAgent: string): Promise<Token> {
        return this.tokenRepository.findByUserIdAndUserAgent(userId, uerAgent);
    }

    private async validateTokenCreation(createTokenCallback: Promise<Token>): Promise<Token> {
        const refreshToken: Token = await createTokenCallback;
        if (!refreshToken) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_NOT_CREATED);
        }
        return refreshToken;
    }
}
