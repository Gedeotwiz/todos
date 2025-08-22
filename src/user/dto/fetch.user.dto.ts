import { ApiSchema } from '@nestjs/swagger';
import { PaginationDto } from 'src/--share--/dto/pagination.dto';
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';


export namespace FetchuUserDto{
    @ApiSchema({ name: 'FetchUserInput' })
    export class Input extends PaginationDto{

        @ApiPropertyOptional({ description: 'Search keyword (name or email)' })
        @IsOptional()
        @IsString()
       q?: string;
        

        @ApiPropertyOptional({ description: 'Filter by user id' })
        @IsOptional()
        @IsNumber()
       id?: string;
    }
     

    @ApiSchema({ name: 'FetchUserInput' })
    export class Output {
       id:number;
       names:string;
       email:string;
       phone:string;
       activated:boolean;
       role:string
    }
}