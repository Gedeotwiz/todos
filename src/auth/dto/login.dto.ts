import { ApiSchema } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export namespace LoginDto{
    @ApiSchema({ name: 'LoginInput' })
      export class Input {
    
        @ApiProperty()
        @IsEmail()
        email: string;
    
        @ApiProperty()
        @IsString()
        @IsNotEmpty()
        password: string;
      }
      
      @ApiSchema({ name: 'LoginOutput' })
      export class Output {
      
      @ApiProperty({ example: 'ghfghwejnagtbyfte gvkayhruh' })
      accessToken: string;

      constructor(accessToken: string) {
      this.accessToken = accessToken;
    
    }

    }
}