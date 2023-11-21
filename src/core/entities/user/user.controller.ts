import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateOrUpdateUserDto } from './dto';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':email')
    getOne(@Param('email') email: string): Promise<User> {
        return this.userService.findByEmail(email);
    }
    @Get()
    getAll(): Promise<User[]> {
        return this.userService.findAll();
    }
    @Post()
    create(@Body() dto: CreateOrUpdateUserDto): Promise<User> {
        return this.userService.create(dto);
    }
}
