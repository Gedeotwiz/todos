import { Body, Controller, Post, Get,Param,Delete,Query,Patch,ParseIntPipe} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTaskDto } from './dto/todo.dto';
import { GenericResponse } from 'src/--share--/dto/genericResponse.dto';
import { FetchuTodosDto } from './dto/fetch.todos.dto';
import { AllowRoles } from 'src/auth/decorator/roles.decorator';
import { Authguard } from 'src/auth/guards/auth.guard';
import { UserRole } from 'src/--share--/dto/enum/user-role-enum';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth} from '@nestjs/swagger';
import { UpdateTaskDto } from './dto/update.tod.dto';


@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(Authguard)
  @AllowRoles(UserRole.USER)
  async createTodo(
    @Body() body: CreateTaskDto.Input,
  ): Promise<GenericResponse<CreateTaskDto.Output>> {
    const payload = await this.todosService.createTodos(body);
    return new GenericResponse("Todos successfully added", payload);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(Authguard)
  @AllowRoles(UserRole.USER)
  async getTodos(@Query() input: FetchuTodosDto.Input):Promise<any>{
      const payload = await this.todosService.getAllTodos(input)
      return new GenericResponse("Todos successfuly retrived",payload)
  }

@Delete(':id')
@ApiBearerAuth()
@UseGuards(Authguard)
@AllowRoles(UserRole.ADMIN)
async deleteTodos(@Param('id') id:number):Promise<any>{
  const payload = await this.todosService.deletTodos(id)
  return new GenericResponse("Todos successfully deleted", payload);
}

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(Authguard)
  @AllowRoles(UserRole.USER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTaskDto.Input,
  ): Promise<GenericResponse<UpdateTaskDto.Output>> {
    const payload = await this.todosService.updateTodos(id, body);
    return new GenericResponse("Todos successfully deleted", payload);
  }


}
