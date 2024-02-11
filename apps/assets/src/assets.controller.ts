// assets.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './DTOs/createAssetDTO.request';
import { updateAssetDto } from './updateAssetd.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'apps/auth/src/services/jwt-auth.guard';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  findAll() {
    return this.assetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.assetsService.findOne(id);
  }
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('assetImage'))
  @Post()
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() assetDTO: CreateAssetDto,
    @Request() req,
  ) {
    const userId = req.user.userId; // fetching the user who created the asset

    const item = await this.assetsService.create(file, assetDTO, userId);
    return item;
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() assetDTO: updateAssetDto) {
    return this.assetsService.update(id, assetDTO);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.assetsService.delete(id);
  }
}
