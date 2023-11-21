import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';
import { User } from '@prisma/client';
import { UserService } from '@entities/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthConstant } from '@constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get(AuthConstant.JWT_SECRET),
        });
    }

    public async validate(payload: JwtPayloadInterface): Promise<JwtPayloadInterface> {
        const user: User = await this.userService.findById(payload.id);

        if (!user) {
            //TODO Fix to custom error
            throw new UnauthorizedException();
        }

        return payload;
    }
}
