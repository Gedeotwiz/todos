import { Injectable, HttpException, HttpStatus ,NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Todos } from './todos.model';
import { CreateTaskDto } from './dto/todo.dto';
import { FetchuTodosDto } from './dto/fetch.todos.dto';
import { UpdateTaskDto } from './dto/update.tod.dto';
import { TaskStatus } from 'src/--share--/dto/enum/task-enum';


@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todos)
    private readonly todosModule: typeof Todos,
  ) {}

  async createTodos(body: CreateTaskDto.Input): Promise<CreateTaskDto.Output> {
  const todo = await this.todosModule.create({
    title: body.title,
    description: body.description,
    time: body.time,
    status: TaskStatus.ON_TRACK,
  });

  if (!todo) {
    throw new HttpException('Failed to create task', HttpStatus.BAD_REQUEST);
  }

  return {
    id:todo.id,
    title: todo.title,
    description: todo.description,
    time: todo.time,
    status: todo.status,
  };
}


  async getAllTodos(
  input: FetchuTodosDto.Input,
): Promise<{ data: FetchuTodosDto.Output[]; total: number }> {
  const { page = 1, size = 10, q, id } = input;

  const where: any = {};

  if (id) {
    where.id = id;
  }

  if (q) {
    where.title = { $iLike: `%${q}%` };
  }

  const { rows, count } = await this.todosModule.findAndCountAll({
    where,
    limit: size,
    offset: (page - 1) * size,
  });

  if (rows.length === 0) {
    throw new NotFoundException(`No todos found`);
  }

  const result: FetchuTodosDto.Output[] = rows.map((todo) => ({
    id: todo.id,
    title: todo.title,
    description: todo.description,
    time: todo.time,
    status: todo.status,
  }));

  return { data: result, total: count };
}

  async updateTodos(id: string, body: UpdateTaskDto.Input): Promise<UpdateTaskDto.Output> {
  const todos = await this.todosModule.findOne({ where: { id } });

  if (!todos) {
    throw new NotFoundException(`Todos not found on this id ${id}`);
  }

  todos.title = body.title ?? todos.title;
  todos.description = body.description ?? todos.description;
  todos.status = body.status ?? todos.status;

  await todos.save();

  return {
    id:todos.id,
    title: todos.title,
    description: todos.description,
    status: todos.status,
  };
}

 async deletTodoById(id: number): Promise<{ message: string }> {
    const deleted = await this.todosModule.destroy({ where: { id } });

    if (!deleted) {
      throw new NotFoundException(`Todo not found on this id ${id}`);
    }

    return { message: 'Todo deleted successfully' };
  }


}
