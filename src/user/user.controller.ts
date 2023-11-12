import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { AddUserDto } from '@user/dto/add-user.dto';
import { FindUserDto } from '@user/dto/find-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findOne(@Body() dto: FindUserDto) {
    return this.userService.findOne(dto);
  }
  @Get('all')
  findAll() {
    return this.userService.findAll();
  }
  @Post()
  addUser(@Body() dto: AddUserDto) {
    return this.userService.add(dto);
  }
}
