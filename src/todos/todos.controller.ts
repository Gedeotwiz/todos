
import { Body, Controller, Post } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTaskInputDto,CreateTaskOutputDto } from './dto/todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async createTodo(
    @Body() body: CreateTaskInputDto,
  ): Promise<CreateTaskOutputDto> {
    return this.todosService.createTodos(body);
  }
}
