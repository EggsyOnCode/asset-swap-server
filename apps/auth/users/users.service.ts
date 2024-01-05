import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepository) {}

  findAll() {
    return this.userRepo.findAll();
  }

  findOne(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  async create(assetDTO: CreateUserDto) {
    const item = await this.userRepo.save(assetDTO);
    return item;
  }

  async update(id: number, updatedAsset: UpdateUserDto) {
    const item = await this.userRepo.findOne({
      where: { id },
    });
    return this.userRepo.save({
      ...item, // existing fields
      ...updatedAsset, // updated fields
    });
  }

  async delete(id: number) {
    const item = await this.userRepo.findOne({
      where: { id },
    });
    return this.userRepo.remove(item);
  }
}
