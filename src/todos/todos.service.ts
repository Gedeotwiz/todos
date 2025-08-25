import { Injectable,Inject, HttpException, HttpStatus ,NotFoundException,ConflictException} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Todos } from './todos.model';
import { CreateTaskDto } from './dto/todo.dto';
import { FetchuTodosDto } from './dto/fetch.todos.dto';
import { UpdateTaskDto } from './dto/update.tod.dto';
import { TodoStatus } from 'src/--share--/dto/enum/task-enum';
import { Queue } from 'bullmq';
import { Op } from 'sequelize';


@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todos)
    private readonly todosModule: typeof Todos,

    @Inject('NOTIFICATION_QUEUE')
    private notificationQueue: Queue
  ) {}

  async createTodos(body: CreateTaskDto.Input,userId:string): Promise<CreateTaskDto.Output> {

    const existTodo = await this.todosModule.findOne({where:{time:body.time}})
    if(existTodo){
       throw new ConflictException('Please select other time because this is scheduled');
    }
  const todo = await this.todosModule.create({
    title: body.title,
    description: body.description,
    time: body.time,
    status: TodoStatus.ON_TRACK,
    userId
  });

  if (!todo) {
    throw new HttpException('Failed to create task', HttpStatus.BAD_REQUEST);
  }

  await this.notificationQueue.add(
    'send-reminder',{todoId:todo.id},{delay:60*60*1000}
  )
  return {
    id:todo.id,
    title: todo.title,
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
    where.title = { [Op.iLike]: `%${q}%` }; 
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
    userId:todo.userId
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
