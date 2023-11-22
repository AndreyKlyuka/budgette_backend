import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { UserService } from '@entities/user/user.service';
import { Token, User } from '@prisma/client';
import { AuthTokens } from './interfaces';
import { compareSync } from 'bcrypt';
import { BusinessException, ErrorCode } from '@exceptions';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '@entities/token/token.service';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthConstant, ModeConstants } from '@constants';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}
    public async register(dto: RegisterDto): Promise<User> {
        const user: User = await this.userService.create(dto);

        if (!user) {
            throw new BusinessException(ErrorCode.BAD_REQUEST_TO_REGISTER_USER);
        }
        return user;
    }

    public async login(dto: LoginDto, res: Response, userAgent: string): Promise<void> {
        const user: User = await this.userService.findByEmail(dto.email);

        if (!user || !compareSync(dto.password, user.password)) {
            throw new BusinessException(ErrorCode.INCORRECT_PASSWORD_OR_EMAIL);
        }

        const authTokens: AuthTokens = await this.generateAuthTokens(user, userAgent);
        this.setRefreshTokenToCookiesAndReturnAccessTokens(authTokens, res);
    }

    public async logout(refreshToken: string, res: Response): Promise<void> {
        await this.tokenService.deleteByToken(refreshToken);
        res.cookie(AuthConstant.REFRESH_TOKEN_COOKIES_NAME, '', {
            httpOnly: true,
            secure: true,
            expires: new Date(),
        });
        res.sendStatus(HttpStatus.NO_CONTENT);
    }

    public async refreshAuthTokens(refreshToken: string, res: Response, userAgent: string): Promise<void> {
        const existRefreshToken: Token = await this.tokenService.deleteByToken(refreshToken);
        const isRefreshTokenExpired: boolean = new Date(existRefreshToken.exp) < new Date();

        if (isRefreshTokenExpired) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }

        const user: User = await this.userService.findById(existRefreshToken.userId);

        const authTokens: AuthTokens = await this.generateAuthTokens(user, userAgent);

        this.setRefreshTokenToCookiesAndReturnAccessTokens(authTokens, res);
    }

    public setRefreshTokenToCookiesAndReturnAccessTokens(tokens: AuthTokens, res: Response): void {
        res.cookie(AuthConstant.REFRESH_TOKEN_COOKIES_NAME, tokens.refreshToken.token, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(tokens.refreshToken.exp),
            secure:
                this.configService.get(ModeConstants.NODE_ENV, ModeConstants.DEVELOPMENT) === ModeConstants.PRODUCTION,
            path: '/',
        });
        res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken });
    }

    private async generateAuthTokens(user: User, userAgent: string): Promise<AuthTokens> {
        const accessToken: string = this.jwtService.sign({
            id: user.id,
            email: user.email,
            roles: user.roles,
        });
        const refreshToken: Token = await this.generateRefreshToken(
            user.id,
            userAgent,
            this.configService.get(AuthConstant.JWT_REFRESH_EXP_IN_DAYS),
        );

        const authTokens: AuthTokens = { accessToken: 'Bearer ' + accessToken, refreshToken };

        if (!authTokens) {
            throw new BusinessException(ErrorCode.REFRESH_TOKENS_UNABLE);
        }

        return authTokens;
    }

    private async generateRefreshToken(
        userId: string,
        userAgent: string,
        expireTimeInDays: number = 30,
    ): Promise<Token> {
        const previousRefreshToken: Token = await this.tokenService.findByUserIdAndUserAgent(userId, userAgent);
        const token: string = previousRefreshToken?.token ?? '';

        return this.tokenService.upsert(
            {
                token: v4(),
                exp: add(new Date(), { days: expireTimeInDays }),
                userId: userId,
                userAgent: userAgent,
            },
            token,
        );
    }
}
