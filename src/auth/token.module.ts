import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TokenService } from './utils/jwt-token-service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}), 
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
