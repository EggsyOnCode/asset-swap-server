import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAssets } from '../../user-assets/entities/userAssets.schema';
import { Asset } from 'apps/assets/src/entities/asset.schema';
import { UserAdvertized } from '../../advertized-assets/entities/userAdvertised.schema';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  //hashed pass using the bcrypt CRYPTO lib
  @Column()
  password: string;

  @CreateDateColumn()
  joinedDate: Date;

  @OneToMany(() => UserAssets, (asset) => asset.assetId)
  @JoinColumn()
  assets?: Asset[];

  @OneToMany(() => UserAssets, (asset) => asset.assetId)
  @JoinColumn()
  advertized?: UserAdvertized[];
}
