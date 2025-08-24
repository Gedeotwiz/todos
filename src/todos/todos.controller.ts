import { Body, Controller, Post, Get,Param,Delete,Query,Patch,ParseIntPipe} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTaskDto } from './dto/todo.dto';
import { GenericResponse } from 'src/--share--/dto/genericResponse.dto';
import { FetchuTodosDto } from './dto/fetch.todos.dto';
import { UpdateTaskDto } from './dto/update.tod.dto';
import { IsUser } from 'src/auth/decorator/auth.decorator';
import { IsAdmin } from 'src/auth/decorator/auth.decorator';


@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @IsUser()
  async createTodo(
    @Body() body: CreateTaskDto.Input,
  ): Promise<GenericResponse<CreateTaskDto.Output>> {
    const payload = await this.todosService.createTodos(body);
    return new GenericResponse("Todos successfully added", payload);
  }

  @Get()
  async getTodos(@Query() input: FetchuTodosDto.Input):Promise<any>{
      const payload = await this.todosService.getAllTodos(input)
      return new GenericResponse("Todos successfuly retrived",payload)
  }

@Delete(':id')
@IsAdmin()
async deleteTodos(@Param('id') id:string):Promise<any>{
  const payload = await this.todosService.deletTodoById
  return new GenericResponse("Todos successfully deleted", payload);
}

  @Patch(':id')
  @IsUser()
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() body: UpdateTaskDto.Input,
  ): Promise<GenericResponse<UpdateTaskDto.Output>> {
    const payload = await this.todosService.updateTodos(id, body);
    return new GenericResponse("Todos successfully deleted", payload);
  }
}
