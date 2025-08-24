import { ApiSchema } from '@nestjs/swagger';
import { PaginationDto } from 'src/--share--/dto/pagination.dto';
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';


export namespace FetchuTodosDto{
    @ApiSchema({ name: 'FetchTodosInput' })
    export class Input extends PaginationDto{

        @ApiPropertyOptional({ description: 'Search keyword (title)' })
        @IsOptional()
        @IsString()
        q?: string;
        

        @ApiPropertyOptional({ description: 'Filter by user id' })
        @IsOptional()
        @Type(() => Number)
        @IsNumber()
        id?: number;
    }
     

    @ApiSchema({ name: 'FetchTodosInput' })
    export class Output {
       id:number;
       title:string;
       description:string;
       time:string;
       status:string
       
    }
}