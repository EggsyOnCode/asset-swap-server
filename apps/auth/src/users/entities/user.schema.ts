import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAssets } from '../../user-assets/entities/userAssets.schema';
import { Asset } from 'apps/assets/src/entities/asset.schema';
import { UserAdvertized } from '../../advertized-assets/entities/userAdvertised.schema';
import { Notification } from 'apps/orders/src/notifications/entities/notification.schema';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ nullable: true })
  salt: string;

  //hashed pass using the bcrypt CRYPTO lib
  @Column()
  password: string;

  @Column({ nullable: true })
  walletAddress: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  joinedDate: Date;

  @OneToMany(() => UserAssets, (asset) => asset.assetId)
  assets?: Asset[];

  @OneToMany(() => UserAssets, (asset) => asset.assetId)
  soldAssets?: Asset[];

  @OneToMany(() => UserAssets, (asset) => asset.assetId)
  advertized?: UserAdvertized[];

  @OneToMany(() => Notification, (notification) => notification.from)
  sentNotifications: Notification[];

  @OneToMany(() => Notification, (notification) => notification.to)
  receivedNotifications: Notification[];
}
