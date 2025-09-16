import { Module,forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PasswordReset } from './passwordResent.modul';


@Module({
    imports: [
    SequelizeModule.forFeature([User,PasswordReset]), forwardRef(() => AuthModule),
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})

export class UserModule {}