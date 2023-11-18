import { Module } from '@nestjs/common';
import { UserModule } from '@core/entities/user/user.module';
import { TokenModule } from './token/token.module';

@Module({
    imports: [UserModule, TokenModule],
    exports: [UserModule],
})
export class EntitiesModule {}
