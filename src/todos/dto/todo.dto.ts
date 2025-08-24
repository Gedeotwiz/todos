
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiSchema } from '@nestjs/swagger';

export  namespace CreateTaskDto {

  @ApiSchema({ name: 'CreateTaskInput' })
  export class Input {
     @IsNotEmpty({ message: 'Please write your task title' })
  @IsString()
  @ApiProperty()
  title: string;
  
  @IsNotEmpty({ message: 'Please write your task description' })
  @IsString()
  @ApiProperty()
  description: string;
  
  @IsNotEmpty({ message: 'Please write the time you are supposed to complete the task' })
  @Matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, { 
    message: 'Time must be in the format MM/DD/YYYY',
  })
  @ApiProperty({ example: '10/03/2024', description: 'The time you are supposed to complete the task, in MM/DD/YYYY format' })
  time: string;
  }


  @ApiSchema({ name: 'CreateTaskOutput' })
  export class Output {
  id:string;
  title: string;
  description: string;
  time: string;
  status: string;
 }

}


