import { Body, Controller, Post, Get, Param, Delete, Query, Patch, Req } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTaskDto } from './dto/todo.dto';
import { UpdateTaskDto } from './dto/update.tod.dto';
import { FetchuTodosDto } from './dto/fetch.todos.dto';
import { GenericResponse } from 'src/--share--/dto/genericResponse.dto';
import { IsAdminOrUser, IsUser, IsAdmin } from 'src/auth/decorator/auth.decorator';
import { TodoStatus } from 'src/--share--/dto/enum/task-enum';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @IsAdminOrUser()
  async createTodo(@Body() body: CreateTaskDto.Input, @Req() req) {
    const userId = req.user.id;
    const payload = await this.todosService.createTodos(body, userId);
    return new GenericResponse('Todo successfully added', payload);
  }

  @Get()
  @IsUser()
  async getTodos(@Query() input: FetchuTodosDto.Input, @Req() req) {
    const userId = req.user.id;
    const payload = await this.todosService.getAllTodos(input, userId);
    return new GenericResponse('Todos successfully retrieved', payload);
  }

  @Delete(':id')
  @IsAdmin()
  async deleteTodo(@Param('id') id: string) {
    const payload = await this.todosService.deleteTodoById(id);
    return new GenericResponse('Todo successfully deleted', payload);
  }

  @Get('status/:status')
  @IsAdminOrUser()
  async getByStatus(@Param('status') status: TodoStatus, @Req() req) {
    const userId = req.user.id;
    const payload = await this.todosService.getByStatus(userId, status);
    return new GenericResponse(`Todos with status ${status} retrieved successfully`, payload);
  }

  @Patch(':id')
  @IsUser()
  async updateTodo(@Param('id') id: string, @Body() body: UpdateTaskDto.Input) {
    const payload = await this.todosService.updateTodos(id, body);
    return new GenericResponse('Todo successfully updated', payload);
  }
}
