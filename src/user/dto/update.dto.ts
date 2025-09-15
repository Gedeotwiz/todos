import { 
  IsEmail,
  IsString,IsOptional
} from "class-validator";
import { ApiSchema, ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserRole } from "src/--share--/dto/enum/user-role-enum";

export namespace UpdateDto {
  @ApiSchema({ name: 'UpdateInput' })
  export class Input {
    @IsString()
    @ApiProperty()
    names: string;

    @IsEmail()
    @ApiProperty()
    email: string;

    @IsString()
    @ApiProperty()
    phone: string;

     @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    image?: string;
    
  }
  
  @ApiSchema({ name: 'UpdateOutput' })
  export class Output {
    
    @ApiProperty()
    id:string

    @ApiProperty({ example: 'John Doe' })
    @Expose()
    names: string;

    @ApiProperty({ example: 'john@example.com' })
    @Expose()
    email: string;

    @ApiProperty({ example: '+250788123456' })
    @Expose()
    phone: string;

    @ApiProperty()
    @Expose()
    image: string;

    @ApiProperty({ enum: UserRole, example: UserRole.USER })
    @Expose()
    role: UserRole;
  }
}
