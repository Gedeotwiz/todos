import {
  Injectable,
  ConflictException,
  UnauthorizedException,BadRequestException,
  Body
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/user.model';
import { SignupDto } from './dto/sign-up.dto';
import { PasswordEncryption } from 'src/--share--/utils/password-ecripty';
import { plainToInstance } from 'class-transformer';
import { getUserRole, UserRole } from 'src/--share--/dto/enum/user-role-enum';
import { LoginDto } from './dto/login.dto';
import { TokenService } from './utils/jwt-token-service';
import { IJwtPayload } from 'src/type/types';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import { ForgotPasswordDto,ResetPasswordDto ,VerifyOtpDto} from './dto/password.dto';
import { PasswordReset } from 'src/user/passwordResent.modul';
import { sendOtpEmail } from 'src/common/mailer';
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly tokenService: TokenService,
    private readonly userService : UserService,

    @InjectModel(PasswordReset) 
    private readonly passwordResetModel: typeof PasswordReset
  ) {}
  private otpStore = new Map<string, { otp: string; expiresAt: number }>();

  async signUp(body: SignupDto.Input): Promise<SignupDto.Output> {
    const userExist = await this.userService.findUserByEmail(body.email);
    if (userExist) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await PasswordEncryption.hashPassword(body.password);

    const user = await this.userModel.create({
      email: body.email,
      names: body.names,
      phone: body.phone,
      password: hashedPassword,
      role: getUserRole(body.role),
    });

    return plainToInstance(SignupDto.Output, user, {
      excludeExtraneousValues: true,
    });
  }

  async login(body: LoginDto.Input): Promise<LoginDto.Output> {
  
  const user = await this.userService.findUserByEmail(body.email);

  if (!user) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const isMatch = PasswordEncryption.comparePassword(body.password, user.password);

  if (!isMatch) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const payload: IJwtPayload = {
    sub: user.email,
    id: user.id,
    role: user.role as UserRole,
  };

  const accessToken = this.tokenService.generateJwtToken(payload);

  return new LoginDto.Output(accessToken);
}
  async verifyToken(token: string): Promise<any> {
    const secret = 'fdctrhaebgjygnkygjtfr';
    try {
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async forgotPassword(body:ForgotPasswordDto){
     console.log(body.email)
     const userExist = await this.userService.findUserByEmail(body.email);
    if (!userExist) {
      throw new BadRequestException('User not found');
    }

     const otp = (Math.floor(100000 + Math.random() * 900000)).toString();

     await this.passwordResetModel.create({
        userId: userExist.id,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
     });
     await sendOtpEmail(body.email,otp)
     
     return { message: "OTP sent to email" };
  } 

  async verifyOtp(email: string, otp: string) {
  const user = await this.userService.findUserByEmail(email);
  if (!user) throw new BadRequestException("User not found");

  const record = await this.passwordResetModel.findOne({
    where: { userId: user.id },
    order: [["createdAt", "DESC"]], 
  });

  if (!record) throw new BadRequestException("OTP not found");

  if (Date.now() > record.expiresAt.getTime()) {
    throw new BadRequestException("OTP expired");
  }

  if (record.otp !== otp) throw new BadRequestException("Invalid OTP");

  return { message: "OTP verified" };
}


  async resetPassword(body:ResetPasswordDto) {
    const otp = (body as any).otp;
  
    await this.verifyOtp(body.email,body.otp);

    const user = await User.findOne({ where: {email: body.email } });
    if (!user) throw new BadRequestException("User not found");

    const hashedPassword = await bcrypt.hash(body.newPassword, 10);
    await user.update({ password: hashedPassword });

    this.otpStore.delete(body.email); 

    return { message: "Password reset successful" };
  }
}
