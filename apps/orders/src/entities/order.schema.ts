import { Asset } from 'apps/assets/src/entities/asset.schema';
import { User } from 'apps/auth/src/users/entities/user.schema';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { State } from '../constants/state';
import { Notification } from '../notifications/entities/notification.schema';

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

  @Column({ type: 'enum', enum: State, default: State.B_REQUESTED })
  state: State;

  @ManyToOne(() => User)
  @JoinColumn({ referencedColumnName: 'id' })
  seller: User;

  @ManyToOne(() => User)
  @JoinColumn({ referencedColumnName: 'id' })
  buyer: User;

  @Column({ nullable: true })
  cryptoPrice: string;

  @ManyToOne(() => Asset)
  @JoinColumn({ referencedColumnName: 'id' })
  asset: Asset;

  @Column({ nullable: true })
  orderManagerContract: string;

  @Column({ nullable: true })
  nftContract: string;

  @OneToMany(() => Notification, (notification) => notification.order)
  notifications: Notification[];
}
