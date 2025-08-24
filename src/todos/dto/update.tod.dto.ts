
import { ApiProperty } from '@nestjs/swagger';
import { IsString} from 'class-validator';
import { ApiSchema } from '@nestjs/swagger';
import { TaskStatus } from 'src/--share--/dto/enum/task-enum';

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
   status: TaskStatus;
  
  }

  @ApiSchema({ name: 'UpdateTaskOutput' })
  export class Output {
  id:string;
  title: string;
  description: string;
  status: string;
 }

}


