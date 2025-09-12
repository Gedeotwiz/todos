import {
  Injectable,NotFoundException
} from "@nestjs/common";
import { User } from "./user.model";
import { InjectModel } from "@nestjs/sequelize";
import { FetchuUserDto } from "./dto/fetch.user.dto";
import { Op } from "sequelize";
import { UpdateDto } from "./dto/update.dto";
import { UserRole } from "src/--share--/dto/enum/user-role-enum";
import { Readable } from 'stream';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { File as MulterFile } from "multer";


@Injectable()
export class UserService{
   constructor(
    @InjectModel(User) 
    private readonly userModule: typeof User,
   ){
    cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    });
   }

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


  async uploadBufferToCloudinary(buffer: Buffer, folder = 'profiles'): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) return reject(err);
      resolve((result as UploadApiResponse).secure_url);
    });

    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);

    readable.pipe(stream);
  });
}


  async updateUserProfile(
    id: string,
    body: UpdateDto.Input,
    uploadedFile?: MulterFile
  ): Promise<{ payload: UpdateDto.Output }> {
    const user = await this.userModule.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`user not found on this id ${id}`);
    }

    
    user.names = body.names ?? user.names;
    user.email = body.email ?? user.email;
    user.phone = body.phone ?? user.phone;

    if (uploadedFile && uploadedFile.buffer && uploadedFile.buffer.length > 0) {
      const imageUrl = await this.uploadBufferToCloudinary(uploadedFile.buffer, 'profiles');
      user.image = imageUrl;
    } else if (body.image) {
      user.image = body.image;
    }

    await user.save();

    const output: UpdateDto.Output = {
      id: user.id,
      names: user.names,
      email: user.email,
      phone: user.phone,
      image: user.image,
      role: user.role as UserRole,
    };

    return { payload: output };
  }


}