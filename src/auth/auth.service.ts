import {
  Injectable,
  ConflictException,UnauthorizedException
} from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { UserService } from "src/user/user.service";
import { SignupDto } from "./dto/sign-up.dto";
import { PasswordEncryption } from "src/--share--/utils/password-ecripty";
import { plainToInstance } from "class-transformer";
import { User } from "src/user/user.entity";
import { getUserRole } from "src/--share--/dto/enum/user-role-enum";
import { LoginDto } from "./dto/login.dto";
import { UserRole } from "src/--share--/dto/enum/user-role-enum";
import { TokenService } from "./utils/jwt-token-service";


export interface IJwtPayload {
  id: number;
  sub: string;
  role: UserRole;
}




@Injectable()
export class AuthService{
    
    constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly userService:UserService,
    private tokenService: TokenService
  ){}

  
  async signUp(body: SignupDto.Input): Promise<SignupDto.Output> {
  const userExist = await this.userService.findUserByEmail(body.email);
  if (userExist) {
    throw new ConflictException("User already exists");
  }

  const hashedPassword = await PasswordEncryption.hashPassword(body.password);

  let user: User;
  await this.entityManager.transaction(async (manager) => {
    user = await manager.save(
      plainToInstance(User, {
        email: body.email,
        names: body.names,
        phone: body.phone,
        password: hashedPassword,
        role: getUserRole('USER'),
      }),
    );
  });

  return plainToInstance(SignupDto.Output, user, {
    excludeExtraneousValues: true,
  });
  }

  async Login(body:LoginDto.Input):Promise<LoginDto.Output>{
    const user = await this.userService.findUserByEmail(body.email)

    if(!user || !PasswordEncryption.comparePassword(body.password,user.password)){
        throw new UnauthorizedException("Invalid email or password");
    }
     const payload:IJwtPayload ={
         sub:user.email,
         id:user.id,
         role:user.role
     }

     const accessToken = this.tokenService.generateJwtToken(payload);

     return new LoginDto.Output(accessToken);
  }
}