import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.schema';
import { Asset } from 'apps/assets/src/entities/asset.schema';

@Entity()
export class UserAssets {
  //these are both fk and userID and assetID together make a natural composite key
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  assetId: number;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  boughtAt: Date;

  @ManyToOne(() => User, (user) => user.assets)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => User, (user) => user.soldAssets)
  @JoinColumn({ name: 'sellerId' })
  seller: User;

  @OneToOne(() => Asset)
  @JoinColumn({ name: 'assetId' })
  asset: Asset;

  @Column({ nullable: true })
  nftIpfsUrl: string;

  @Column({ nullable: true })
  nftContract: string;

  @Column()
  sellerId: number;
}
