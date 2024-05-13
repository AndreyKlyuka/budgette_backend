import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthConfig, Mode, ModeConfig } from '@constants';
import { AuthTokens } from '@interfaces';

@Injectable()
export class CookieService {
    constructor(private readonly configService: ConfigService) {}

    setRefreshToken({ refreshToken }: AuthTokens, res: Response) {
        res.cookie(AuthConfig.REFRESH_TOKEN_COOKIES_NAME, refreshToken.token, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(refreshToken.exp),
            secure: this.configService.get(ModeConfig.NODE_ENV, Mode.DEVELOPMENT) === Mode.PRODUCTION,
            path: '/',
        });
    }
    clearRefreshToken(res: Response) {
        res.cookie(AuthConfig.REFRESH_TOKEN_COOKIES_NAME, '', {
            httpOnly: true,
            secure: true,
            expires: new Date(),
        });
    }
}
