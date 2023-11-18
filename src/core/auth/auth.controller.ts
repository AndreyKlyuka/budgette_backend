import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { AccessToken, AuthTokens } from './interfaces/tokens.interface';
import { BusinessException, ErrorCode } from '@exceptions';

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
    async login(@Body() dto: LoginDto): Promise<AccessToken> {
        const tokens: AuthTokens = await this.authService.login(dto);

        if (!tokens) {
            throw new BusinessException(ErrorCode.BAD_REQUEST_TO_LOGIN_USER);
        }

        return { accessToken: tokens.accessToken };
    }
}
