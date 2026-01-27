import { Injectable, NotFoundException, ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Todos, TodosDocument } from './todos.schema';
import { CreateTaskDto } from './dto/todo.dto';
import { FetchuTodosDto } from './dto/fetch.todos.dto';
import { UpdateTaskDto } from './dto/update.tod.dto';
import { TodoStatus } from 'src/--share--/dto/enum/task-enum';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todos.name) private readonly todosModel: Model<TodosDocument>,
  ) {}

  async createTodos(body: CreateTaskDto.Input, userId: string): Promise<CreateTaskDto.Output> {
    const existTodo = await this.todosModel.findOne({ time: body.time, userId }).exec();
    if (existTodo) {
      throw new ConflictException('Please select another time because this is scheduled');
    }

    const todo = await this.todosModel.create({
      title: body.title,
      summary: body.summary,
      description: body.description,
      time: body.time,
      status: TodoStatus.ON_TRACK,
      userId: new Types.ObjectId(userId),
    });

    if (!todo) throw new HttpException('Failed to create task', HttpStatus.BAD_REQUEST);

    return {
      id: todo.id,
      title: todo.title,
      summary: todo.summary,
      description: todo.description,
      time: todo.time,
      status: todo.status,
      userId: String(todo.userId),
    };
  }

  async getAllTodos(input: FetchuTodosDto.Input, userId: string) {
    const { page = 1, size = 10, q, id } = input;

    const filter: any = { userId: new Types.ObjectId(userId) };
    if (id) filter.id = id;
    if (q) filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { status: { $regex: q, $options: 'i' } },
    ];

    const total = await this.todosModel.countDocuments(filter);
    const todos = await this.todosModel.find(filter)
      .skip((page - 1) * size)
      .limit(size)
      .exec();

    if (!todos.length) throw new NotFoundException('No todos found');

    const data = todos.map(todo => ({
      id: todo.id,
      title: todo.title,
      summary: todo.summary,
      description: todo.description,
      time: todo.time,
      status: todo.status,
      userId: String(todo.userId),
    }));

    return { data, total };
  }

  async getByStatus(userId: string, status: TodoStatus) {
    const todos = await this.todosModel.find({ userId: new Types.ObjectId(userId), status }).exec();

    if (!todos.length) throw new NotFoundException(`No todos found with status: ${status}`);

    const today = new Date();
    const results = todos.map(todo => {
      let updatedStatus: TodoStatus = todo.status;
      const dueDate = new Date(todo.time);

      if (todo.status !== TodoStatus.DONE) {
        updatedStatus = today <= dueDate ? TodoStatus.ON_TRACK : TodoStatus.OFF_TRACK;
        if (updatedStatus !== todo.status) {
          todo.status = updatedStatus;
          todo.save().catch(err => console.error(`Failed to update todo ${todo.id}:`, err));
        }
      }

      return {
        id: todo.id,
        title: todo.title,
        summary: todo.summary,
        description: todo.description,
        time: todo.time,
        status: todo.status,
        userId: String(todo.userId),
      };
    });

    return { data: results };
  }

  async updateTodos(id: string, body: UpdateTaskDto.Input) {
    const todo = await this.todosModel.findOne({ id }).exec();
    if (!todo) throw new NotFoundException(`Todo not found on this id ${id}`);

    todo.title = body.title ?? todo.title;
    todo.summary = body.summary ?? todo.summary;
    todo.description = body.description ?? todo.description;
    todo.time = body.time ?? todo.time;
    todo.status = body.status ?? todo.status;

    await todo.save();

    return {
      id: todo.id,
      title: todo.title,
      summary: todo.summary,
      description: todo.description,
      time: todo.time,
      status: todo.status,
      userId: String(todo.userId),
    };
  }

  async deleteTodoById(id: string) {
    const deleted = await this.todosModel.deleteOne({ id }).exec();
    if (deleted.deletedCount === 0) throw new NotFoundException(`Todo not found on this id ${id}`);
    return { message: 'Todo deleted successfully' };
  }
}
