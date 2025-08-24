import { Module } from '@nestjs/common';
import { SequelizeMethod } from 'sequelize/lib/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todos } from './todos.model';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { AuthModule } from 'src/auth/auth.module'; 
import { UserModule } from 'src/user/use.module';
import { TokenModule } from 'src/auth/token.module'; 
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forFeature([Todos]),
    AuthModule,
    UserModule,
    TokenModule,
  ],
  providers: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
