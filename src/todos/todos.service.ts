import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todos } from './todos.entity';
import { CreateTaskInputDto,CreateTaskOutputDto } from './dto/todo.dto';


@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todos)
    private readonly todosRepository: Repository<Todos>,
  ) {}

  async createTodos(body: CreateTaskInputDto): Promise<CreateTaskOutputDto> {
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
}
