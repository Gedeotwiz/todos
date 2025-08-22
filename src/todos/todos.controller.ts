import { Body, Controller, Post, Get,Param,Delete} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTaskDto } from './dto/todo.dto';
import { GenericResponse } from 'src/--share--/dto/genericResponse.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async createTodo(
    @Body() body: CreateTaskDto.Input,
  ): Promise<GenericResponse<CreateTaskDto.Output>> {
    const payload = await this.todosService.createTodos(body);
    return new GenericResponse("Todos successfully added", payload);
  }

  @Get()
  async getTodos():Promise<any>{
      const payload = await this.todosService.getAllTodos()
      return new GenericResponse("Todos successfuly retrived",payload)
  }

@Get(':id')
async getById(@Param('id') id: number): Promise<GenericResponse<CreateTaskDto.Output>> {
  const payload = await this.todosService.getById(id);
  return new GenericResponse("Todos successfully retrieved", payload);
}

@Delete(':id')
async deleteTodos(@Param('id') id:number):Promise<any>{
  const payload = await this.todosService.deletTodos(id)
  return new GenericResponse("Todos successfully deleted", payload);
}


}
