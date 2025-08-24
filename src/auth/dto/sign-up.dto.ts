import { 
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsOptional,
  IsEnum
} from "class-validator";
import { ApiSchema, ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserRole } from "src/--share--/dto/enum/user-role-enum";

export namespace SignupDto {
  @ApiSchema({ name: 'SignupInput' })
  export class Input {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    names: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    phone: string;
    
    @IsStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    @ApiProperty()
    password: string;

    @IsOptional()
    @IsEnum(UserRole, { message: "role must be USER or ADMIN" })
    @ApiProperty({ enum: UserRole, required: false, default: UserRole.USER })
    role?: UserRole;
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

    @ApiProperty({ enum: UserRole, example: UserRole.USER })
    @Expose()
    role: UserRole;
  }
}
