import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAdvertizedAssetDto } from '../advertized-assets/dto/create-advertized-asset.dto';
import { UpdateAdvertizedAssetDto } from '../advertized-assets/dto/update-advertized-asset.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() assetDTO: CreateAdvertizedAssetDto) {
    return this.userService.create(assetDTO);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() assetDTO: UpdateAdvertizedAssetDto) {
    return this.userService.update(id, assetDTO);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}
