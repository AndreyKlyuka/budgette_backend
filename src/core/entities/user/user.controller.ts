import {
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { UserResponse } from './responses';
import { CurrentUser } from '@decorators';
import { JwtPayload } from '@core/auth/interfaces';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':email')
    async getOne(@Param('email') email: string): Promise<User> {
        const user: User = await this.userService.findByEmail(email);
        return new UserResponse(user);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    async getAll(): Promise<User[]> {
        const users: User[] = await this.userService.findAll();
        return users.map((user: User) => new UserResponse(user));
    }
    @Delete()
    async deleteOne(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() currentUser: JwtPayload,
    ): Promise<Partial<User>> {
        return this.userService.delete(id, currentUser);
    }
}
