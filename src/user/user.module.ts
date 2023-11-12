import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from '@user/user.repository';

@Module({
  controllers: [UserController],
  providers: [UserRepository, UserService],
})
export class UserModule {}
