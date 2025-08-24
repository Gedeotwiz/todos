import {
  Injectable,
} from "@nestjs/common";
import { User } from "./user.entity";
import {Repository } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';
import { FetchuUserDto } from "./dto/fetch.user.dto";


@Injectable()
export class UserService{
   constructor(
    @InjectRepository(User) 
    private readonly userRepository:Repository<User>,
   ){}

   async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { email }
    });
  }

  async getAllUsers(input: FetchuUserDto.Input): Promise<{ data: FetchuUserDto.Output[]; total: number }> {
    const { page = 1, size = 10, q, id } = input;

    const query = this.userRepository.createQueryBuilder('user');

    if (id) {
      query.andWhere('user.id = :id', { id });
    }

    if (q) {
      query.andWhere(
        '(user.names ILIKE :q OR user.email ILIKE :q OR user.phone ILIKE :q)',
        { q: `%${q}%` },
      );
    }

    query.skip((page - 1) * size).take(size);

    const [data, total] = await query.getManyAndCount();

    const result: FetchuUserDto.Output[] = data.map((user) => ({
      id: user.id,
      names: user.names,
      email: user.email,
      phone: user.phone,
      activated: user.activated,
      role: user.role,
    }));

    return { data: result, total };
  }

  async findUserById(id:number):Promise<any>{
     return await this.userRepository.findOne({where:{id}})
  }

}