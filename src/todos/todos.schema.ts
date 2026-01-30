import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TodoStatus } from 'src/--share--/dto/enum/task-enum';
import { User } from 'src/user/user.schema';

export type TodosDocument = Todos & Document;

@Schema({ collection: 'todos', timestamps: true })
export class Todos {

  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ required: true, unique: true })
  description: string;

  @Prop({ required: true, unique: true })
  time: string;

  @Prop({ type: String, enum: Object.values(TodoStatus), default: TodoStatus.ON_TRACK })
  status: TodoStatus;

  
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  user?: Types.ObjectId; 
}

export const TodosSchema = SchemaFactory.createForClass(Todos);
