import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty() 
  @IsEmail()
  email: string;
}

export class VerifyOtpDto {

  @ApiProperty()  
  @IsEmail()
  email: string;
  
  @ApiProperty()
  @IsString()
  otp: string;
}

export class ResetPasswordDto {
  @ApiProperty()  
  @IsEmail()
  email: string;
  
  @ApiProperty()
  @IsString()
  otp: string;
  
  @ApiProperty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}
