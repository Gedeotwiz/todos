import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { FetchuUserDto } from './dto/fetch.user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(@Query() input: FetchuUserDto.Input) {
    return this.userService.getAllUsers(input);
  }
}
