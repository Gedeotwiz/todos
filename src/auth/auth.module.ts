import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/use.module';
import { TokenModule } from './token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([]), 
    UserModule,
    TokenModule, 
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
