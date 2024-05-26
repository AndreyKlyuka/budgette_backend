import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { Token, User } from '@prisma/client';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UserService } from '@entities/user/user.service';
import { TokenService } from '@entities/token/token.service';
import { CookieService } from '@common-services';
import { BusinessException, ErrorCode } from '@exceptions';
import { AuthTokens } from '@interfaces';
import { Auth, AuthConfig } from '@constants';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly cookieService: CookieService,
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
        this.cookieService.setRefreshToken(authTokens, res);
        res.status(HttpStatus.CREATED).json({ accessToken: authTokens.accessToken });
    }

    public async logout(refreshToken: string, res: Response): Promise<void> {
        if (!refreshToken) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }
        await this.tokenService.deleteByToken(refreshToken);
        this.cookieService.clearRefreshToken(res);
        res.sendStatus(HttpStatus.NO_CONTENT);
    }

    public async refreshAuthTokens(refreshToken: string, res: Response, userAgent: string): Promise<void> {
        if (!refreshToken) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }
        const existRefreshToken: Token = await this.tokenService.deleteByToken(refreshToken);
        const isRefreshTokenExpired: boolean = new Date(existRefreshToken.exp) < new Date();
        if (isRefreshTokenExpired) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }
        const user: User = await this.userService.findById(existRefreshToken.userId);
        const authTokens: AuthTokens = await this.generateAuthTokens(user, userAgent);
        this.cookieService.setRefreshToken(authTokens, res);
        res.status(HttpStatus.CREATED).json({ accessToken: authTokens.accessToken });
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
            this.configService.get(AuthConfig.REFRESH_TOKEN_EXP_IN_DAYS),
        );
        if (!refreshToken) {
            throw new BusinessException(ErrorCode.REFRESH_TOKENS_UNABLE);
        }
        return { accessToken, refreshToken };
    }

    private async generateRefreshToken(
        userId: string,
        userAgent: string,
        expireTimeInDays: number = Auth.REFRESH_TOKEN_EXP_TIME_IN_DAYS,
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
