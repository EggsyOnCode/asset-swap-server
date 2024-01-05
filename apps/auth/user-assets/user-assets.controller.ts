import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserAssetsService } from './user-assets.service';
import { CreateUserAssetDto } from './dto/create-user-asset.dto';
import { UpdateUserAssetDto } from './dto/update-user-asset.dto';

@Controller('user-assets')
export class UserAssetsController {
  constructor(private readonly userAssetsService: UserAssetsService) {}

  @Post()
  create(@Body() createUserAssetDto: CreateUserAssetDto) {
    return this.userAssetsService.create(createUserAssetDto);
  }

  @Get()
  findAll() {
    return this.userAssetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userAssetsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserAssetDto: UpdateUserAssetDto) {
    return this.userAssetsService.update(+id, updateUserAssetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userAssetsService.remove(+id);
  }
}
