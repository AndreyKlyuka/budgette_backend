import { Body, ClassSerializerInterceptor, Controller, Get, Post, Res, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { BusinessException, ErrorCode } from '@exceptions';
import { Cookie, Public, UserAgent } from '@decorators';
import { AuthConstant } from '@constants';
import { UserResponse } from '@entities/user/responses';

@Public()
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Post('register')
    async register(@Body() dto: RegisterDto): Promise<User> {
        const user: User = await this.authService.register(dto);
        return new UserResponse(user);
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Res() res: Response, @UserAgent() userAgent: string): Promise<void> {
        await this.authService.login(dto, res, userAgent);
    }

    @Get('logout')
    async logout(
        @Cookie(AuthConstant.REFRESH_TOKEN_COOKIES_NAME) refreshToken: string,
        @Res() res: Response,
    ): Promise<void> {
        if (!refreshToken) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }

        await this.authService.logout(refreshToken, res);
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
        await this.authService.refreshAuthTokens(refreshToken, res, userAgent);
    }
}
