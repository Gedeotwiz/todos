import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User, UserSchema } from 'src/user/user.schema';
import { PasswordReset, PasswordResetSchema } from 'src/user/passwordResent.schema';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/use.module';
import { TokenModule } from './token.module';
import { JwtStrategy } from './jwt.stratege';

@Module({
  imports: [
    // ---------------- MongoDB Models ----------------
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: PasswordReset.name, schema: PasswordResetSchema },
    ]),

    forwardRef(() => UserModule),
    TokenModule,
    ConfigModule,

    // ---------------- JWT / Passport ----------------
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
  exports: [AuthService, MongooseModule],
})
export class AuthModule {}
