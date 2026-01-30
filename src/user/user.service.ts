import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { FetchuUserDto } from './dto/fetch.user.dto';
import { UpdateDto } from './dto/update.dto';
import { UserRole } from 'src/--share--/dto/enum/user-role-enum';
import { Readable } from 'stream';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { File as MulterFile } from 'multer';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
  }

 async findUserByEmail(email: string): Promise<UserDocument | null> {
  return this.userModel
    .findOne({ email })
    .select('_id email password names role')
    .exec();
}


  async getAllUsers(input: FetchuUserDto.Input) {
    const { page = 1, size = 10, q, id } = input;
    const filter: any = {};

    if (id) filter.id = id;
    if (q) filter.$or = [
      { names: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { phone: { $regex: q, $options: 'i' } },
    ];

    const total = await this.userModel.countDocuments(filter);
    const users = await this.userModel.find(filter)
      .skip((page - 1) * size)
      .limit(size)
      .exec();

    if (!users.length) throw new NotFoundException('User not found');

    const data: FetchuUserDto.Output[] = users.map(user => ({
      id: user.id,
      names: user.names,
      email: user.email,
      image: user.image,
      phone: user.phone,
      activated: user.activated,
      role: user.role,
    }));

    return { data, total };
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findOne({ id }).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
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
    const user = await this.userModel.findOne({ id }).exec();
    if (!user) throw new NotFoundException(`User not found on this id ${id}`);

    user.names = body.names ?? user.names;
    user.email = body.email ?? user.email;
    user.phone = body.phone ?? user.phone;

    if (uploadedFile?.buffer?.length) {
      const imageUrl = await this.uploadBufferToCloudinary(uploadedFile.buffer, 'profiles');
      user.image = imageUrl;
    } else if (body.image) {
      user.image = body.image;
    }

    await user.save();

    return {
      payload: {
        id: user.id,
        names: user.names,
        email: user.email,
        phone: user.phone,
        image: user.image,
        role: user.role as UserRole,
      },
    };
  }
}
