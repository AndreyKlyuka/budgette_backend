import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthConstant } from '@core/auth/constants/auth.constant';

const jwtModuleOptions = (config: ConfigService): JwtModuleOptions => ({
    secret: config.get(AuthConstant.JWT_SECRET),
    signOptions: {
        expiresIn: config.get(AuthConstant.JWT_EXP, '5m'),
    },
});
export const jwtModuleAsyncOptions = (): JwtModuleAsyncOptions => ({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => jwtModuleOptions(config),
});
