import { Body, Controller, Post} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/sign-up.dto';
import { GenericResponse } from 'src/--share--/dto/genericResponse.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/password.dto';
import { VerifyOtpDto,ResetPasswordDto } from './dto/password.dto';


@Controller("auth")
export class AuthController{
    constructor(private readonly authService:AuthService){}

   @Post("signup")
   async createUser(@Body() body: SignupDto.Input,): Promise<GenericResponse<SignupDto.Output>> {
   const payload = await this.authService.signUp(body);
    return new GenericResponse("User successfully created", payload);
   }

   @Post("login")
   async SignIn(@Body() body:LoginDto.Input):Promise<GenericResponse<LoginDto.Output>>{
    const payload = await this.authService.login(body)
    return new GenericResponse("Login successfuly",payload)
   }

   @Post('forgot-password')
   async forgotPassword(@Body() body:ForgotPasswordDto){
    return this.authService.forgotPassword(body)
   }

   @Post("verify-otp")
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.email, dto.otp);
  }

  @Post("reset-password")
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

}