import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('media')
export class MediaController {
  @Post('upload')
  upload() {}
}