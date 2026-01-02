import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import slugify from 'slugify';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}

  async create(dto: CreatePostDto, userId: string) {
    const slug = slugify(dto.title, { lower: true });

    return this.postModel.create({
      ...dto,
      slug,
      author: userId,
    });
  }

  async findAllPublished() {
    return this.postModel
      .find({ published: true })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
  }

  async findBySlug(slug: string) {
    return this.postModel
      .findOne({ slug, published: true })
      .populate('author', 'username');
  }
}