import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepository) {}

  private async checkPwdAgainstHash(hash: string, password: string) {
    return await bcrypt.compare(password, hash);
  }

  async validate(username: string, pwd: string) {
    const user = await this.userRepo.findOne({
      where: {
        username: username,
      },
    });

    if (user && (await this.checkPwdAgainstHash(user.password, pwd))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  findAll() {
    return this.userRepo.findAll();
  }

  findOne(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  async create(userDto: CreateUserDto) {
    //hashing the pwd and storing the hashed pwd
    const salt = await bcrypt.genSalt();
    const password = userDto.password;
    const hashed_pwd = await bcrypt.hash(password, salt);
    userDto.password = hashed_pwd;
    userDto.salt = salt;
    const item = await this.userRepo.save(userDto);
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

  hello() {
    return 'hello world';
  }
}
