import { Injectable, HttpException, HttpStatus ,NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todos } from './todos.entity';
import { CreateTaskDto } from './dto/todo.dto';
import { FetchuTodosDto } from './dto/fetch.todos.dto';
import { UpdateTaskDto } from './dto/update.tod.dto';


@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todos)
    private readonly todosRepository: Repository<Todos>,
  ) {}

  async createTodos(body: CreateTaskDto.Input): Promise<CreateTaskDto.Output> {
    const todo = this.todosRepository.create({
  title: body.title,
  description: body.description,
  time: body.time,
  status: 'ON-TRACK', 
 });
    const saved = await this.todosRepository.save(todo);

    if (!saved) {
      throw new HttpException('Failed to create task', HttpStatus.BAD_REQUEST);
    }
    
    return {
      title: saved.title,
      description: saved.description,
      time: saved.time,
      status: saved.status,
    };
  }

  async getAllTodos(input: FetchuTodosDto.Input): Promise<{ data: FetchuTodosDto.Output[]; total: number }> {
      const { page = 1, size = 10, q, id } = input;

      const query = this.todosRepository.createQueryBuilder("todos")

      if(id){
        query.andWhere('todos.id = :id', { id });
      }

       if (q) {
      query.andWhere(
        '(todos.title ILIKE :q )',
        { q: `%${q}%` },
      );
    }

    query.skip((page - 1) * size).take(size);

    const [data, total] = await query.getManyAndCount();
     
     const result: FetchuTodosDto.Output[] = data.map((todos) => ({
        id:todos.id,
        title:todos.title,
        description:todos.description,
        time:todos.time,
        status:todos.status

     }))
     return {data:result,total}
  }

  async getById(id:number):Promise<CreateTaskDto.Output>{
    const todos = await this.todosRepository.findOne({where:{id}})
    if(!todos){
      throw new NotFoundException(`Todos not found on this id ${id}`)
    }
    return {
      title: todos.title,
      description: todos.description,
      time: todos.time,
      status: todos.status,
    };
  }

  async deletTodos(id:number):Promise<any>{
    const todos = await this.todosRepository.findOne({where:{id}})
      if(!todos){
      throw new NotFoundException(`Todos not found on this id ${id}`)
    }
    return await this.todosRepository.delete(id)
  }

  async updateTodos(id: number, body: UpdateTaskDto.Input): Promise<UpdateTaskDto.Output> {
  const todos = await this.todosRepository.findOne({ where: { id } });
  
  if (!todos) {
    throw new NotFoundException(`Todos not found on this id ${id}`);
  }

  
  todos.title = body.title ?? todos.title;
  todos.description = body.description ?? todos.description;
  todos.status = body.status ?? todos.status;

  const updated = await this.todosRepository.save(todos);

  return {
    title: updated.title,
    description: updated.description,
    status: updated.status,
  };
}

}
