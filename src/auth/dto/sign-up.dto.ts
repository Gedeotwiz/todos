
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from "class-validator";
import { ApiSchema } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export namespace SignupDto {
  @ApiSchema({ name: 'SignupInput' })
  export class Input {
    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    names: string;

    @IsEmail()
    @ApiProperty()
    @IsNotEmpty()
    email: string;

    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    phone: string;
    
    @ApiProperty()
    @IsStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    password: string;
  }
  
  @ApiSchema({ name: 'SignupOutput' })
  export class Output {
  @ApiProperty({ example: 'John Doe' })
  @Expose()
  names: string;

  @ApiProperty({ example: 'john@example.com' })
  @Expose()
  email: string;

  @ApiProperty({ example: '+250788123456' })
  @Expose()
  phone: string;
}
}