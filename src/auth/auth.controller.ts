import { Body, Controller, Post} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/sign-up.dto';
import { GenericResponse } from 'src/--share--/dto/genericResponse.dto';
import { LoginDto } from './dto/login.dto';


@Controller("auth")
export class AuthController{
    constructor(private readonly authService:AuthService){}

   @Post("sign up")
   async createUser(@Body() body: SignupDto.Input,): Promise<GenericResponse<SignupDto.Output>> {
   const payload = await this.authService.signUp(body);
    return new GenericResponse("User successfully created", payload);
   }

   @Post("login")
   async SignIn(@Body() body:LoginDto.Input):Promise<GenericResponse<LoginDto.Output>>{
    const payload = await this.authService.Login(body)
    return new GenericResponse("Login successfuly",payload)
   }

}