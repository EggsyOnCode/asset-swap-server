import { User } from 'apps/auth/src/users/entities/user.schema';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../../entities/order.schema';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  msg: string;

  @Column({ unique: false })
  fromId: number;

  @Column({ unique: false })
  toId: number;

  @Column({ unique: false })
  orderId: number;

  @Column({
    default: false,
  })
  read: boolean;

  @ManyToOne(() => User, (user) => user.id) // Specify User entity
  @JoinColumn({ name: 'fromId' }) // Specify join column for user
  from: User;

  @ManyToOne(() => User, (user) => user.id) // Specify User entity
  @JoinColumn({ name: 'toId' }) // Specify join column for user
  to: User;

  @ManyToOne(() => Order, (order) => order.id) // Specify Order entity
  @JoinColumn({ name: 'orderId' }) // Specify join column for order
  order: Order;
}
