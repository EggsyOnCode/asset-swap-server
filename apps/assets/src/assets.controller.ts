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
  Header,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './DTOs/createAssetDTO.request';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'apps/auth/src/services/jwt-auth.guard';
import { NftInfoDTO } from './DTOs/NftInfo';
import { Asset } from './entities/asset.schema';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  findAll() {
    return this.assetsService.findAll();
  }
  @Get('getFile/:id')
  @Header('Content-type', 'image/png')
  async findFile(@Param('id') id: number) {
    const file = await this.assetsService.getObject(id);

    // Set content type header to indicate it's an image

    // Send the file data as the response
    return file;
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

  @UseGuards(JwtAuthGuard)
  @Post('/storeNft')
  async uploadNftToIpfs(@Body() nftInfo: NftInfoDTO) {
    const nftUrl = await this.assetsService.uploadNftToIpfs(nftInfo);
    return {
      url: nftUrl,
    };
  }
  @Put(':id')
  update(@Param('id') id: number, @Body() assetDTO: Partial<Asset>) {
    return this.assetsService.update(id, assetDTO);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.assetsService.delete(id);
  }
}
