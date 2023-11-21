import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenRepository } from '@entities/token/repository/token.repository';

@Module({
    providers: [TokenRepository, TokenService],
    exports: [TokenService],
})
export class TokenModule {}
