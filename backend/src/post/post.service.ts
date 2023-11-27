import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post-dto';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FilterPostDto } from './dto/filter-post-dto';
import { UpdatePostDto } from './dto/update-post-dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createPost(
    userId: number,
    createPostDto: CreatePostDto,
    file: Express.Multer.File,
  ): Promise<Post> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const { url } = await this.cloudinaryService.uploadImage(file);

    try {
      return await this.postRepository.save({
        ...createPostDto,
        user,
        thumpnail: url,
      });
    } catch (error) {
      throw new HttpException('Can not create post', HttpStatus.BAD_REQUEST);
    }
  }

  async getPost(query: FilterPostDto): Promise<any> {
    const page = query.page || 1;
    const item_per_page = query.item_per_page || 10;
    const search = query.search || '';
    const category = Number(query.category) || null;

    const skip = (page - 1) * item_per_page;

    const [res, total] = await this.postRepository.findAndCount({
      where: {
        title: Like('%' + search + '%'),
        category: {
          id: category,
        },
      },
      order: { created_at: 'DESC' },
      take: item_per_page,
      skip,
      relations: {
        user: true,
        category: true,
      },
      select: {
        category: {
          id: true,
          name: true,
        },
        user: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
        },
      },
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

  async getPostDetail(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: Number(id) },
      relations: ['user', 'category'],
      select: {
        category: {
          id: true,
          name: true,
        },
        user: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
        },
      },
    });
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return post;
  }

  async updatePost(
    id: number,
    updatePost: UpdatePostDto,
    file: Express.Multer.File,
  ): Promise<UpdateResult> {
    const { url } = await this.cloudinaryService.uploadImage(file);

    try {
      return await this.postRepository.update(id, {
        ...updatePost,
        thumpnail: url,
      });
    } catch (error) {
      throw new HttpException('Cant not update post', HttpStatus.UNAUTHORIZED);
    }
  }

  async deletePost(id: string): Promise<DeleteResult> {
    return await this.postRepository.delete({ id: Number(id) });
  }
}
