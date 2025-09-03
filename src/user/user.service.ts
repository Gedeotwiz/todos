import {
  Injectable,NotFoundException
} from "@nestjs/common";
import { User } from "./user.model";
import { InjectModel } from "@nestjs/sequelize";
import { FetchuUserDto } from "./dto/fetch.user.dto";
import { Op } from "sequelize";


@Injectable()
export class UserService{
   constructor(
    @InjectModel(User) 
    private readonly userModule: typeof User,
   ){}

   async findUserByEmail(email: string): Promise<User | null> {
  return this.userModule.findOne({
    where: { email },
    attributes: ['id', 'email', 'password', 'names', 'role'],
  });
}


 async getAllUsers(
  input: FetchuUserDto.Input,
): Promise<{ data: FetchuUserDto.Output[]; total: number }> {
  const { page = 1, size = 10, q, id } = input;

  const where: any = {};

  if (id) {
    where.id = id;
  }

  if (q) {
    where[Op.or] = [
      { names: { [Op.iLike]: `%${q}%` } },
      { email: { [Op.iLike]: `%${q}%` } },
      { phone: { [Op.iLike]: `%${q}%` } },
    ];
  }

  const { rows, count } = await this.userModule.findAndCountAll({
    where,
    limit: size,
    offset: (page - 1) * size,
  });

  if (rows.length === 0) {
    throw new NotFoundException(`User not found`);
  }

  const result: FetchuUserDto.Output[] = rows.map((user) => ({
    id: user.id,
    names: user.names,
    email: user.email,
    image:user.image,
    phone: user.phone,
    activated: user.activated,
    role: user.role,
  }));

  return { data: result, total: count };
}

  async findUserById(id:number):Promise<any>{

     const user = await this.userModule.findOne({where:{id}})
      if(!user){
         throw new NotFoundException(`User not found`);
      }
     return user
  }


}