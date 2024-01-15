import { Asset } from 'apps/assets/src/entities/asset.schema';
import { User } from 'apps/auth/src/users/entities/user.schema';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { State } from '../constants/state';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false })
  buyerId: number;

  @Column({ unique: false })
  sellerId: number;

  @Column({ nullable: false, unique: false })
  assetId: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'enum', enum: State })
  state: State;

  @ManyToOne(() => User)
  @JoinColumn({ referencedColumnName: 'id' })
  seller: User;

  @ManyToOne(() => User)
  @JoinColumn({ referencedColumnName: 'id' })
  buyer: User;

  @ManyToOne(() => Asset)
  @JoinColumn({ referencedColumnName: 'id' })
  asset: Asset;
}
