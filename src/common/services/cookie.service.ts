import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Mode, ModeConfig } from '@constants';

@Injectable()
export class CookieService {
  constructor(private readonly configService: ConfigService) {}

  set(cookie: Cookie, res: Response) {
    res.cookie(cookie.name, cookie.value, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(cookie.expiresDate),
      secure: this.configService.get(ModeConfig.NODE_ENV, Mode.DEVELOPMENT) === Mode.PRODUCTION,
      path: '/',
    });
  }

  clear(name: string, res: Response) {
    res.cookie(name, '');
  }
}
