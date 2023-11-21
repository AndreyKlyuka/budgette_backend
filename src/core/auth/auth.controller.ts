import { Body, ClassSerializerInterceptor, Controller, Get, Post, Res, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { BusinessException, ErrorCode } from '@exceptions';
import { Cookie, Public, UserAgent } from '@decorators';
import { AuthConstant } from '@constants';
import { AuthTokens } from './interfaces';
import { UserResponse } from '@entities/user/responses';
``;

@Public()
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Post('register')
    async register(@Body() dto: RegisterDto): Promise<User> {
        const user: User = await this.authService.register(dto);

        if (!user) {
            throw new BusinessException(ErrorCode.BAD_REQUEST_TO_REGISTER_USER);
        }

        return new UserResponse(user);
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
    ): Promise<void> {
        if (!refreshToken) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }

        const tokens: AuthTokens = await this.authService.refreshAuthTokens(refreshToken, userAgent);

        if (!tokens) {
            throw new BusinessException(ErrorCode.REFRESH_TOKENS_UNABLE);
        }

        this.authService.setRefreshTokenToCookies(tokens, res);
    }
}
