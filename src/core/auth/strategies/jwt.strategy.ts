import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '@core/auth/interfaces';
import { User } from '@prisma/client';
import { UserService } from '@entities/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthConfig } from '@constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get(AuthConfig.JWT_SECRET),
        });
    }

    public async validate(payload: JwtPayload): Promise<JwtPayload> {
        const user: User = await this.userService.findById(payload.id);

        if (!user) {
            //TODO Fix to custom error
            throw new UnauthorizedException();
        }

        return payload;
    }
}
