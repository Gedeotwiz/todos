import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from 'src/--share--/dto/enum/user-role-enum';
import { PasswordReset } from './passwordResent.schema';
import { Todos } from 'src/todos/todos.schema';

export type UserDocument = User & Document; 

@Schema({ collection: 'users', timestamps: true })
export class User {
  
  @Prop({ required: true })
  names: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, default: 'https://www.gravatar.com/avatar/?d=mp&f=y' })
  image: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: Object.values(UserRole), default: UserRole.USER })
  role: UserRole;

  @Prop({ default: null })
  refreshToken?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Todos' }] })
  todos: Types.ObjectId[];

  @Prop({ type: Date, default: null })
  verifiedAt?: Date;

  @Prop({ default: true })
  activated: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'PasswordReset' }] })
  passwordResets: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
