import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Todos, TodosSchema } from './todos.schema';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/use.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todos.name, schema: TodosSchema }]),
    AuthModule,
    UserModule,
  ],
  providers: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
