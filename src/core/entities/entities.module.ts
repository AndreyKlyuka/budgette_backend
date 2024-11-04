import { Module } from '@nestjs/common';
import { UserModule } from '@entities/user/user.module';
import { TokenModule } from '@entities/token/token.module';

@Module({
  imports: [UserModule, TokenModule],
  exports: [UserModule, TokenModule],
})
export class EntitiesModule {}
