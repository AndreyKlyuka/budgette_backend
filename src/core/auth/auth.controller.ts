import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { AuthTokens } from './interfaces/tokens.interface';
import { BusinessException, ErrorCode } from '@exceptions';
import { Response } from 'express';
import { Cookie, UserAgent } from '@decorators';
import { AuthConstant } from '@core/auth/constants/auth.constant';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() dto: RegisterDto): Promise<User> {
        const user: User = await this.authService.register(dto);

        if (!user) {
            throw new BusinessException(ErrorCode.BAD_REQUEST_TO_REGISTER_USER);
        }

        return user;
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Res() res: Response, @UserAgent() userAgent: string): Promise<void> {
        const tokens: AuthTokens = await this.authService.login(dto, userAgent);

        if (!tokens) {
            throw new BusinessException(ErrorCode.BAD_REQUEST_TO_LOGIN_USER);
        }

        this.authService.setRefreshTokenToCookies(tokens, res);
    }

    @Get('refresh-tokens')
    async refreshTokens(
        @Cookie(AuthConstant.REFRESH_TOKEN_COOKIES_NAME) refreshToken: string,
        @Res() res: Response,
        @UserAgent() userAgent: string,
    ) {
        if (!refreshToken) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }

        const tokens: AuthTokens = await this.authService.refreshTokens(refreshToken, userAgent);

        if (!tokens) {
            throw new BusinessException(ErrorCode.REFRESH_TOKENS_UNABLE);
        }

        this.authService.setRefreshTokenToCookies(tokens, res);
    }
}
