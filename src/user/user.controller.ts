import { Controller, Get, Query, Req, Patch, Body, UploadedFile, UseInterceptors,Post } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { FetchuUserDto } from './dto/fetch.user.dto';
import { GenericResponse } from 'src/--share--/dto/genericResponse.dto';
import { IsAdminOrUser } from 'src/auth/decorator/auth.decorator';
import { UpdateDto } from './dto/update.dto';
import type { File } from "multer";


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(@Query() input: FetchuUserDto.Input) {
    return this.userService.getAllUsers(input);
  }

  @Get("/me")
  @IsAdminOrUser()
  async getUserBy(@Req() req): Promise<any> {
    const userId = req.user.id;
    const payload = await this.userService.findUserById(userId);
    return new GenericResponse("User retrieved successfully", payload);
  }

  @Get("/email")
  async getUserEmail(@Query('email') email: string): Promise<any> {
    return this.userService.findUserByEmail(email);
  }

  @Post('/upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: File) {
  
    const url = await this.userService.uploadBufferToCloudinary(file.buffer, 'profiles');
    return { url };
  }

  @Patch("/me")
  @IsAdminOrUser()
  @UseInterceptors(FileInterceptor("file"))
  async updateProfile(
    @Req() req,
    @Body() body: UpdateDto.Input,
    @UploadedFile() file?: File
  ): Promise<{ payload: UpdateDto.Output }> {
    const userId = req.user.id;
    return this.userService.updateUserProfile(userId, body, file);
  }


}
