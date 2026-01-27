
import { Module } from '@nestjs/common';
import { Todos } from './todos/todos.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {TodosModule} from './todos/todos.module'
import { User } from './user/user.model';
import { UserModule } from './user/use.module';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { PasswordReset } from './user/passwordResent.modul';


@Module({
  imports: [
    ConfigModule.forRoot(), 
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT'), 10) || 5432,
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        models: [Todos,User,PasswordReset],
        autoLoadModels: true,      
        synchronize: true,
      }),
    }),
    TodosModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
