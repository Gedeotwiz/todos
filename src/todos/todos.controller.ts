import { Body, Controller, Post, Get,Param,Delete,Query,Patch,ParseIntPipe,Req} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTaskDto } from './dto/todo.dto';
import { GenericResponse } from 'src/--share--/dto/genericResponse.dto';
import { FetchuTodosDto } from './dto/fetch.todos.dto';
import { UpdateTaskDto } from './dto/update.tod.dto';
import { IsUser } from 'src/auth/decorator/auth.decorator';
import { IsAdmin } from 'src/auth/decorator/auth.decorator';
import { IsAdminOrUser } from 'src/auth/decorator/auth.decorator';
import { TodoStatus } from 'src/--share--/dto/enum/task-enum';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @IsAdminOrUser()
  async createTodo(
    @Body() body: CreateTaskDto.Input, @Req() req
  ): Promise<GenericResponse<CreateTaskDto.Output>> {
     const userId = req.user.id
    const payload = await this.todosService.createTodos(body,userId);
    return new GenericResponse("Todos successfully added", payload);
  }

  @Get()
  @IsUser()
  async getTodos(@Query() input: FetchuTodosDto.Input,@Req() req):Promise<any>{
      const userId = req.user.id
      const payload = await this.todosService.getAllTodos(input,userId)
      return new GenericResponse("Todos successfuly retrived",payload)
  }

@Delete(':id')
@IsAdmin()
async deleteTodos(@Param('id') id:string):Promise<any>{
  const payload = await this.todosService.deletTodoById
  return new GenericResponse("Todos successfully deleted", payload);
}

@Get("status/:status")
@IsUser()
async getByStatus(
  @Param("status") status: TodoStatus,
  @Req() req,
): Promise<any> {
  const userId = req.user.id;
  const payload = await this.todosService.getByStatus(userId,status)
  return new GenericResponse(`Todos with status ${status} retrieved successfully`, payload);
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
