import {
  Controller,
  Post,
  Body,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import cloudinary from '../config/cloudinary.config';
import { cloudinaryStorage } from './cloudinary.storage';
import { DeleteImageDto } from './dto/delete-image.dto';

@Controller('upload')
export class UploadController {
  @UseGuards(JwtAuthGuard)
  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: cloudinaryStorage,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  @Delete('image')
  async deleteImage(@Body() dto: DeleteImageDto) {
    const result = await cloudinary.uploader.destroy(dto.public_id);
    return {
    success: result.result === 'ok',
  };
  }

  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return {
      url: file.path,
      public_id: file.filename,
    };
  }
}