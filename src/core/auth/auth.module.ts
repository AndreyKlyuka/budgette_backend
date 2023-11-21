import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleAsyncOptions } from '@config';
import { UserModule } from '@core/entities/user/user.module';
import { TokenModule } from '@entities/token/token.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { STRATEGIES } from './strategies';
import { GUARDS } from './guards';

@Module({
    controllers: [AuthController],
    providers: [AuthService, ...STRATEGIES, ...GUARDS],
    imports: [UserModule, TokenModule, PassportModule, JwtModule.registerAsync(jwtModuleAsyncOptions())],
})
export class AuthModule {}
