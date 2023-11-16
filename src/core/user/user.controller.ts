import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateOrUpdateUserDto } from './dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    getOne(@Param('id') id: string) {
        return this.userService.getOne(id);
    }
    @Get()
    getAll() {
        console.log('all');
        return this.userService.getAll();
    }
    @Post()
    create(@Body() dto: CreateOrUpdateUserDto) {
        return this.userService.create(dto);
    }
}
