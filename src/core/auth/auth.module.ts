import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleAsyncOptions } from '@config';
import { UserModule } from '@core/entities/user/user.module';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [UserModule, PassportModule, JwtModule.registerAsync(jwtModuleAsyncOptions())],
})
export class AuthModule {}
