import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserAssets {
  //these are both fk and userID and assetID together make a natural composite key
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  assetId: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  boughtAt: Date;

  @ManyToOne(() => User, (user) => user.assets)
  owner: User;
}
