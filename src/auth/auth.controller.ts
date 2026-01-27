import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/sign-up.dto';
import { GenericResponse } from 'src/--share--/dto/genericResponse.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, VerifyOtpDto, ResetPasswordDto } from './dto/password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ------------------ SIGN UP ------------------
  @Post('signup')
  async createUser(
    @Body() body: SignupDto.Input,
  ): Promise<GenericResponse<SignupDto.Output>> {
    const payload = await this.authService.signUp(body);
    return new GenericResponse('User successfully created', payload);
  }

  // ------------------ LOGIN ------------------
  @Post('login')
  async signIn(
    @Body() body: LoginDto.Input,
  ): Promise<GenericResponse<LoginDto.Output>> {
    const payload = await this.authService.login(body);
    return new GenericResponse('Login successfully', payload);
  }

  // ------------------ FORGOT PASSWORD ------------------
  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const payload = await this.authService.forgotPassword(body);
    return new GenericResponse('OTP sent successfully', payload);
  }

  // ------------------ VERIFY OTP ------------------
  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const payload = await this.authService.verifyOtp(dto.email, dto.otp);
    return new GenericResponse('OTP verified successfully', payload);
  }

  // ------------------ RESET PASSWORD ------------------
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const payload = await this.authService.resetPassword(dto);
    return new GenericResponse('Password reset successfully', payload);
  }
}
