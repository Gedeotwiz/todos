import { Injectable, HttpException, HttpStatus ,NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todos } from './todos.entity';
import { CreateTaskDto } from './dto/todo.dto';


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

  async getAllTodos():Promise<any>{
     const todos = await this.todosRepository.find()
     if(!todos){
       throw new NotFoundException("Todos not found please")
     }
     return todos
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
}
