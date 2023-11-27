import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user-dto';
import { FilterUserDto } from './dto/filter-user-dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getUsers(query: FilterUserDto): Promise<any> {
    const page = Number(query.page) || 1;
    const item_per_page = Number(query.item_per_page) || 10;
    const skip = (page - 1) * item_per_page;

    const keySearch = query.search || '';

    const [res, total] = await this.userRepository.findAndCount({
      where: [
        { firstName: Like('%' + keySearch + '%') },
        { lastName: Like('%' + keySearch + '%') },
        { email: Like('%' + keySearch + '%') },
      ],
      order: { created_at: 'DESC' },
      take: item_per_page,
      skip: skip,
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'created_at',
        'updated_at',
      ],
    });

    const lastPage = Math.ceil(total / item_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data: res,
      total,
      currentPage: page,
      nextPage,
      prevPage,
    };
  }
  async getUserId(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('User is not exist', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);

    return await this.userRepository.save({
      ...createUserDto,
      password: hashPassword,
    });
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.userRepository.update(id, updateUserDto);
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
  async updateAvatar(
    id: number,
    file: Express.Multer.File,
  ): Promise<UpdateResult> {
    const result = await this.cloudinaryService.uploadImage(file);
    console.log('result: ', result);
    return await this.userRepository.update(id, { avatar: result.url });
  }
}
