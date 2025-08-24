
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiSchema } from '@nestjs/swagger';

export  namespace UpdateTaskDto {

  @ApiSchema({ name: 'UpdateTaskInput' })
  export class Input {
  @IsString()
  @ApiProperty()
  title: string;
  
  @IsString()
  @ApiProperty()
  description: string;

   @IsString()
   @ApiProperty()
   status: string;
  
  }

  @ApiSchema({ name: 'UpdateTaskOutput' })
  export class Output {
  title: string;
  description: string;
  status: string;
 }

}


