import { Controller, Get, Query,Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { FetchuUserDto } from './dto/fetch.user.dto';
import { IsAdmin } from 'src/auth/decorator/auth.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @IsAdmin()
  async getAllUsers(@Query() input: FetchuUserDto.Input) {
    return this.userService.getAllUsers(input);
  }

}
