import { Injectable, HttpException, HttpStatus ,NotFoundException,ConflictException} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Todos } from './todos.model';
import { CreateTaskDto } from './dto/todo.dto';
import { FetchuTodosDto } from './dto/fetch.todos.dto';
import { UpdateTaskDto } from './dto/update.tod.dto';
import { TodoStatus } from 'src/--share--/dto/enum/task-enum';
import { Op } from 'sequelize';


@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todos)
    private readonly todosModule: typeof Todos,
  ) {}

  async createTodos(body: CreateTaskDto.Input,userId:string): Promise<CreateTaskDto.Output> {

    const existTodo = await this.todosModule.findOne({where:{time:body.time}})
    if(existTodo){
       throw new ConflictException('Please select other time because this is scheduled');
    }
  const todo = await this.todosModule.create({
    title: body.title,
    summary:body.summary,
    description: body.description,
    time: body.time,
    status: TodoStatus.ON_TRACK,
    userId
  });

  if (!todo) {
    throw new HttpException('Failed to create task', HttpStatus.BAD_REQUEST);
  }
  return {
    id:todo.id,
    title: todo.title,
    summary:todo.summary,
    description: todo.description,
    time: todo.time,
    status: todo.status,
    userId:todo.userId
  };
}


  async getAllTodos(
  input: FetchuTodosDto.Input,userId:string
): Promise<{ data: FetchuTodosDto.Output[]; total: number }> {
  const { page = 1, size = 10, q, id } = input;

  const where: any = {
    userId, 
  };


  if (id) {
    where.id = id;
  }

  
  if (q) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${q}%` } },
      { status: TodoStatus.ON_TRACK || TodoStatus.DONE || TodoStatus.OFF_TRACK }
    ];
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
    summary:todo.summary,
    description: todo.description,
    time: todo.time,
    status: todo.status,
    userId:todo.userId
  }));

  return { data: result, total: count };
}

async getByStatus(
  userId: string,
  status: TodoStatus
): Promise<{ data: FetchuTodosDto.Output[] }> {
  const todos = await this.todosModule.findAll({
    where: { userId, status },
  });

  if (todos.length === 0) {
    throw new NotFoundException(`No todos found with status: ${status}`);
  }

  const toDateOnly = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = toDateOnly(new Date());

  const results: FetchuTodosDto.Output[] = [];

  for (const todo of todos) {
    
    let updatedStatus: TodoStatus = todo.status as TodoStatus;
    if (todo.status !== TodoStatus.DONE) {
      const dueDate = todo.time ? toDateOnly(new Date(todo.time)) : null;
      updatedStatus = dueDate && today <= dueDate ? TodoStatus.ON_TRACK : TodoStatus.OFF_TRACK;
    }

    
    if (todo.status !== TodoStatus.DONE && updatedStatus !== (todo.status as TodoStatus)) {
      try {
       await this.todosModule.update(
  { status: updatedStatus as any }, 
  { where: { id: todo.id } }
);
      } catch (err) {
        console.error(`Failed to update todo ${todo.id}:`, err);
      }
    }

    results.push({
      id: String(todo.id),
      title: todo.title,
      summary: todo.summary,
      description: todo.description,
      time: todo.time ,
      status: todo.status,
      userId: todo.userId,
    } as FetchuTodosDto.Output);
  }

  return { data: results };
}



  async updateTodos(id: string, body: UpdateTaskDto.Input): Promise<UpdateTaskDto.Output> {
  const todos = await this.todosModule.findOne({ where: { id } });

  if (!todos) {
    throw new NotFoundException(`Todos not found on this id ${id}`);
  }

  todos.title = body.title ?? todos.title;
  todos.summary = body.summary ?? todos.summary
  todos.description = body.description ?? todos.description;
  todos.time = body.time ?? todos.time
  todos.status = body.status ?? todos.status;

  await todos.save();

  return {
    id:todos.id,
    title: todos.title,
    summary:todos.summary,
    description: todos.description,
    time:todos.time,
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
