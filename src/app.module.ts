import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule, ConfigModule.forRoot({ isGlobal: true })],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
