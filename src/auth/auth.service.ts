import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/user/user.schema';
import { PasswordReset, PasswordResetDocument } from 'src/user/passwordResent.schema';
import { SignupDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password.dto';
import { PasswordEncryption } from 'src/--share--/utils/password-ecripty';
import { plainToInstance } from 'class-transformer';
import { getUserRole, UserRole } from 'src/--share--/dto/enum/user-role-enum';
import { TokenService } from './utils/jwt-token-service';
import { IJwtPayload } from 'src/type/types';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { MailerService } from 'src/common/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    @InjectModel(PasswordReset.name)
    private readonly passwordResetModel: Model<PasswordResetDocument>,
    private readonly mailerService: MailerService,
  ) {}

  private otpStore = new Map<string, { otp: string; expiresAt: number }>();

  // ------------------ SIGN UP ------------------
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

    return plainToInstance(SignupDto.Output, user, { excludeExtraneousValues: true });
  }

  // ------------------ LOGIN ------------------
  async login(body: LoginDto.Input): Promise<LoginDto.Output> {
    const user = await this.userService.findUserByEmail(body.email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isMatch = await PasswordEncryption.comparePassword(body.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    const payload: IJwtPayload = {
      sub: user.email,
      id: user._id.toString(),
      role: user.role as UserRole,
    };

    const accessToken = this.tokenService.generateJwtToken(payload);

    return new LoginDto.Output(accessToken);
  }

  // ------------------ VERIFY TOKEN ------------------
  async verifyToken(token: string): Promise<any> {
    const secret = 'fdctrhaebgjygnkygjtfr';
    try {
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  // ------------------ FORGOT PASSWORD ------------------
async forgotPassword(body: ForgotPasswordDto) {
  const userExist = await this.userService.findUserByEmail(body.email);
  if (!userExist) throw new BadRequestException('User not found');

  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();

  try {
    const reset = await this.passwordResetModel.create({
      userId: userExist._id,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      used: false,
    });


    await this.mailerService.sendOtpEmail(body.email, otp);
    return { message: 'OTP sent to email' };

  } catch (error) {
    throw new BadRequestException(error.message);
  }
}





  // ------------------ VERIFY OTP ------------------
  async verifyOtp(email: string, otp: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) throw new BadRequestException('User not found');

    const record = await this.passwordResetModel
  .findOne({ userId: user._id, used: false })
  .sort({ _id: -1 })
  .exec();


    if (!record) throw new BadRequestException('OTP not found');
    if (record.used) throw new BadRequestException('OTP already used');
    if (Date.now() > record.expiresAt.getTime()) throw new BadRequestException('OTP expired');
    if (record.otp !== otp) throw new BadRequestException('Invalid OTP');

    return { message: 'OTP verified' };
  }

  // ------------------ RESET PASSWORD ------------------
  async resetPassword(body: ResetPasswordDto) {
    await this.verifyOtp(body.email, body.otp);

    const user = await this.userModel.findOne({ email: body.email }).exec();
    if (!user) throw new BadRequestException('User not found');

    const hashedPassword = await bcrypt.hash(body.newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Mark the latest OTP as used
    await this.passwordResetModel
      .findOneAndUpdate(
        { userId: user._id, otp: body.otp },
        { used: true },
        { sort: { createdAt: -1 } },
      )
      .exec();

    this.otpStore.delete(body.email);

    return { message: 'Password reset successful' };
  }
}
