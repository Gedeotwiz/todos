import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todos } from './todos.entity';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { AuthModule } from 'src/auth/auth.module'; 
import { UserModule } from 'src/user/use.module';
import { TokenModule } from 'src/auth/token.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Todos]),
    AuthModule,
    UserModule,
    TokenModule,
  ],
  providers: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
