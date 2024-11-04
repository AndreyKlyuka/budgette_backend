import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleAsyncOptions } from '@config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { STRATEGIES } from './strategies';
import { GUARDS } from './guards';
import { EntitiesModule } from '@entities/entities.module';
import { CommonServicesModule } from '@common-services/common-services.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ...STRATEGIES, ...GUARDS],
  imports: [EntitiesModule, CommonServicesModule, PassportModule, JwtModule.registerAsync(jwtModuleAsyncOptions())],
})
export class AuthModule {}
