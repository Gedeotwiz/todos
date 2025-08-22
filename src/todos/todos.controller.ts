import { Body, Controller, Post } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTaskInputDto, CreateTaskOutputDto } from './dto/todo.dto';
import { GenericResponse } from 'src/--share--/dto/genericResponse.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async createTodo(
    @Body() body: CreateTaskInputDto,
  ): Promise<GenericResponse<CreateTaskOutputDto>> {
    const payload = await this.todosService.createTodos(body);
    return new GenericResponse("Task successfully added", payload);
  }
}
