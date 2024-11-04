import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { Token, User } from '@prisma/client';
import { compareSync } from 'bcrypt';
import { Response } from 'express';
import { UserService } from '@entities/user/user.service';
import { TokenService } from '@entities/token/token.service';
import { CookieService } from '@common-services';
import { BusinessException, ErrorCode } from '@exceptions';
import { AuthTokens } from '@interfaces';
import { AuthConfig } from '@constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
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

    const authTokens: AuthTokens = await this.generateAccessAndRefreshTokens(user, userAgent);

    const refreshTokenCookie: Cookie = {
      name: AuthConfig.REFRESH_TOKEN_COOKIES_NAME,
      value: authTokens.refreshToken.token,
      expiresDate: authTokens.refreshToken.exp,
    };
    this.cookieService.set(refreshTokenCookie, res);
    res.status(HttpStatus.CREATED).json({ accessToken: authTokens.accessToken });
  }

  public async logout(refreshToken: string, res: Response): Promise<void> {
    if (!refreshToken) {
      throw new BusinessException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
    }
    await this.tokenService.deleteByToken(refreshToken);
    this.cookieService.clear(AuthConfig.REFRESH_TOKEN_COOKIES_NAME, res);
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

    const authTokens: AuthTokens = await this.generateAccessAndRefreshTokens(user, userAgent);

    const refreshTokenCookie: Cookie = {
      name: AuthConfig.REFRESH_TOKEN_COOKIES_NAME,
      value: authTokens.refreshToken.token,
      expiresDate: authTokens.refreshToken.exp,
    };
    this.cookieService.set(refreshTokenCookie, res);
    res.status(HttpStatus.CREATED).json({ accessToken: authTokens.accessToken });
  }

  private async generateAccessAndRefreshTokens(user: User, userAgent: string): Promise<AuthTokens> {
    const accessToken: string = this.generateAccessToken(user);
    const refreshToken: Token = await this.tokenService.generateRefreshToken(user.id, userAgent);
    return { refreshToken, accessToken };
  }

  private generateAccessToken(user: User): string {
    return this.jwtService.sign({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });
  }
}
