import { Injectable } from '@nestjs/common';
import { TokenRepository } from './repository/token.repository';
import { CreateOrUpdateTokenDto } from '../token/dto';
import { Token } from '@prisma/client';
import { BusinessException, ErrorCode } from '@exceptions';

@Injectable()
export class TokenService {
    constructor(private readonly tokenRepository: TokenRepository) {}

    public async upsert(dto: CreateOrUpdateTokenDto, token: string): Promise<Token> {
        if (!token) {
            return this.createTokenOrThrowExceptionIfFailed(this.tokenRepository.create(dto));
        }
        return this.createTokenOrThrowExceptionIfFailed(this.tokenRepository.update(dto, token));
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
    public async findByUserIdAndUserAgent(userId: string, uerAgent: string): Promise<Token> {
        return this.tokenRepository.findByUserIdAndUserAgent(userId, uerAgent);
    }

    private async createTokenOrThrowExceptionIfFailed(createTokenCallback: Promise<Token>): Promise<Token> {
        const refreshToken: Token = await createTokenCallback;

        if (!refreshToken) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_NOT_CREATED);
        }

        return refreshToken;
    }
}
