import { Injectable } from '@nestjs/common';
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

    public async login(dto: LoginDto): Promise<AuthTokens> {
        const user: User = await this.findExistUserByEmail(dto.email);

        if (!user || !compareSync(dto.password, user.password)) {
            throw new BusinessException(ErrorCode.BAD_REQUEST_TO_LOGIN_USER);
        }

        const accessToken: string = this.jwtService.sign({
            id: user.id,
            email: user.email,
            roles: user.roles,
        });
        const refreshToken: Token = await this.generateRefreshToken(
            user.id,
            this.configService.get(AuthConstant.JWT_REFRESH_EXP_IN_DAYS),
        );

        return { accessToken, refreshToken };
    }

    private async generateRefreshToken(userId: string, expireTimeInDays: number): Promise<Token> {
        return this.tokenService.create({
            tokenName: v4(),
            expiresIn: add(new Date(), { days: expireTimeInDays }),
            userId: userId,
        });
    }

    private async findExistUserByEmail(email: string): Promise<User> {
        return this.userService.findOneByEmail(email);
    }
}
