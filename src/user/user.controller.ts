import { Controller, Get, Query,Req } from '@nestjs/common';
import { UserService } from './user.service';
import { FetchuUserDto } from './dto/fetch.user.dto';
import { GenericResponse } from 'src/--share--/dto/genericResponse.dto';
import { IsAdminOrUser } from 'src/auth/decorator/auth.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(@Query() input: FetchuUserDto.Input) {
    return this.userService.getAllUsers(input);
  }

  @Get("/id")
  @IsAdminOrUser()
  async getUserBy(@Req() req):Promise<any>{
        const userId = req.user.id
        const payload = await this.userService.findUserById(userId)
        return new GenericResponse("Todos successfuly retrived",payload)
  }

}
