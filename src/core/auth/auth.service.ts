import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { UserService } from '@entities/user/user.service';
import { Token, User } from '@prisma/client';
import { AuthTokens } from './interfaces/tokens.interface';
import { compareSync } from 'bcrypt';
import { BusinessException, ErrorCode } from '@exceptions';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '@entities/token/token.service';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import { ConfigService } from '@nestjs/config';
import { AuthConstant } from './constants/auth.constant';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}
    public async register(dto: RegisterDto): Promise<User> {
        const user: User = await this.findExistUserByEmail(dto.email);

        if (user) {
            throw new BusinessException(ErrorCode.BAD_REQUEST_TO_REGISTER_USER);
        }

        return this.userService.create(dto);
    }

    public async login(dto: LoginDto, userAgent: string): Promise<AuthTokens> {
        const user: User = await this.findExistUserByEmail(dto.email);

        if (!user || !compareSync(dto.password, user.password)) {
            throw new BusinessException(ErrorCode.INCORRECT_PASSWORD_OR_EMAIL);
        }
        return this.generateTokens(user, userAgent);
    }

    public async refreshTokens(refreshToken: string, userAgent: string): Promise<AuthTokens> {
        const existRefreshToken: Token = await this.tokenService.findByToken(refreshToken);

        if (!existRefreshToken) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }

        await this.tokenService.deleteByToken(existRefreshToken.token);

        if (new Date(existRefreshToken.exp) < new Date()) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }
        const user: User = await this.findExistUserById(existRefreshToken.userId);
        return this.generateTokens(user, userAgent);
    }

    public setRefreshTokenToCookies(tokens: AuthTokens, res: Response): void {
        if (!tokens) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }

        res.cookie(AuthConstant.REFRESH_TOKEN_COOKIES_NAME, tokens.refreshToken.token, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(tokens.refreshToken.exp),
            secure: this.configService.get(AuthConstant.NODE_ENV, AuthConstant.DEVELOPMENT) === AuthConstant.PRODUCTION,
            path: '/',
        });
        res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken });
    }

    private async generateTokens(user: User, userAgent: string): Promise<AuthTokens> {
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

        return { accessToken: 'Bearer ' + accessToken, refreshToken };
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
                expiresIn: add(new Date(), { days: expireTimeInDays }),
                userId: userId,
                userAgent: userAgent,
            },
            token,
        );
    }

    private async findExistUserByEmail(email: string): Promise<User> {
        return this.userService.findOneByEmail(email);
    }
    private async findExistUserById(id: string): Promise<User> {
        return this.userService.findOneById(id);
    }
}
