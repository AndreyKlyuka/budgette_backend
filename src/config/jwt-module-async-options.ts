import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthConfig, Auth } from '@constants';

const jwtModuleOptions = (config: ConfigService): JwtModuleOptions => ({
    secret: config.get(AuthConfig.JWT_SECRET),
    signOptions: {
        expiresIn: config.get(AuthConfig.JWT_EXP, Auth.JWT_EXP_TIME),
    },
});
export const jwtModuleAsyncOptions = (): JwtModuleAsyncOptions => ({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => jwtModuleOptions(config),
});
