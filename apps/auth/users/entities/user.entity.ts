import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { UserAssets } from './userAssets.entity';
import { Asset } from 'apps/assets/src/entities/asset.schema';

@Entity()
export class User {
  @PrimaryColumn()
  userID: number;

  @Column()
  username: string;

  //hashed pass using the bcrypt crpto lib
  @Column()
  password: string;

  @CreateDateColumn()
  joinedDate: Date;

  @OneToMany(() => UserAssets, (asset) => asset.assetId)
  @JoinColumn()
  assets: Asset[];
}
