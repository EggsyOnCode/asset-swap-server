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
export class UserAdvertized {
  //these are both fk and userID and assetID together make a natural composite key
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  assetId: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  removedAt: Date;

  @ManyToOne(() => User, (user) => user.advertized)
  @JoinColumn()
  user: User;

  @OneToOne(() => Asset)
  @JoinColumn()
  asset: Asset;
}
