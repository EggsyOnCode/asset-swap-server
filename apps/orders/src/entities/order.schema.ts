import { Asset } from 'apps/assets/src/entities/asset.schema';
import { User } from 'apps/auth/src/users/entities/user.schema';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum State {
  REQUESTED = 'requested',
  INSPECTED = 'inspected',
  COMPLETED = 'completed',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sellerId: number;

  @Column()
  buyerId: number;

  @Column()
  assetId: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'enum', enum: State })
  state: State;

  @OneToOne(() => User)
  seller: User;

  @OneToOne(() => User)
  buyer: User;

  @OneToOne(() => Asset)
  asset: User;
}
