import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto';
import { UserService } from '@core/entities/user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}
    public register(dto: RegisterDto) {
        return this.userService.create(dto);
    }
}
