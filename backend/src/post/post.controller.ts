import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post-dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { PostService } from './post.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilterPostDto } from './dto/filter-post-dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdatePostDto } from './dto/update-post-dto';
@ApiBearerAuth()
@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('thumpnail'))
  createPost(
    @Req() req: any,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { id } = req.user;
    return this.postService.createPost(id, createPostDto, file);
  }

  @Get()
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'item_per_page' })
  @ApiQuery({ name: 'search' })
  getPosts(@Query() query: FilterPostDto): Promise<any> {
    return this.postService.getPost(query);
  }

  @UseGuards(AuthGuard)
  @Get()
  getPostDetail(@Param() id: string) {
    return this.postService.getPostDetail(id);
  }
  @UseGuards(AuthGuard)
  @Put(':id')
  updateUser(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UpdateResult> {
    return this.postService.updatePost(id, updatePostDto, file);
  }
  @UseGuards(AuthGuard)
  @Delete()
  deletePost(@Param() id: string): Promise<DeleteResult> {
    return this.postService.deletePost(id);
  }
}
