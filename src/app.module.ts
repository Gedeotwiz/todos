
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todos } from './todos/todos.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {TodosModule} from './todos/todos.module'
import { User } from './user/user.entity';
import { UserModule } from './user/use.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot(), 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT'), 10) || 5432,
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Todos,User],
        synchronize: true,
      }),
    }),
    TodosModule,
    UserModule,
    AuthModule
  ],
})
export class AppModule {}
