import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/user/user.model';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/use.module';
import { TokenModule } from './token.module';
import { JwtStrategy } from './jwt.stratege';
import { PasswordReset } from 'src/user/passwordResent.modul';

@Module({
  imports: [
    SequelizeModule.forFeature([User,PasswordReset]),
    UserModule,
    TokenModule,
    ConfigModule,  
    PassportModule.register({ defaultStrategy: 'jwt' }),  
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService,SequelizeModule],
})
export class AuthModule {}
