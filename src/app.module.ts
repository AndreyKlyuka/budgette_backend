import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { AuthModule } from '@core/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [DatabaseModule, AuthModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule {}
