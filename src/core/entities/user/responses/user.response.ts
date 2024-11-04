import { Role, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponse implements User {
  @Exclude()
  id: string;

  email: string;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
  @Exclude()
  roles: Role[];

  constructor(user: User) {
    Object.assign(this, user);
  }
}
