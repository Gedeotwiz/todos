import { ApiSchema } from '@nestjs/swagger';
import { PaginationDto } from 'src/--share--/dto/pagination.dto';
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';


export namespace FetchuUserDto{
    @ApiSchema({ name: 'FetchUserInput' })
    export class Input extends PaginationDto{

        @ApiPropertyOptional({ description: 'Search keyword (name or email)' })
        @IsOptional()
        @IsString()
       q?: string;
        

        @ApiPropertyOptional({ description: 'Filter by user id' })
        @IsOptional()
        @Type(() => Number)
        @IsNumber()
        id?: number;
    }
     

    @ApiSchema({ name: 'FetchUserInput' })
    export class Output {
       id:string;
       names:string;
       email:string;
       image:string;
       phone:string;
       activated:boolean;
       role:string
    }
}