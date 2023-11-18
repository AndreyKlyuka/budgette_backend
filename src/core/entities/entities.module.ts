import { Module } from '@nestjs/common';
import { UserModule } from '@core/entities/user/user.module';

@Module({
    imports: [UserModule],
    exports: [UserModule],
})
export class EntitiesModule {}
