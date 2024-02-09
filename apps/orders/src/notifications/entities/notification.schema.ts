import { User } from 'apps/auth/src/users/entities/user.schema';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../entities/order.schema';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  msg: string;

  @Column()
  userId: number;

  @Column()
  orderId: number;

  @Column({
    default: false,
  })
  read: boolean;

  @OneToOne(() => User, (user) => user.id)
  user: User;

  @OneToOne(() => Order, (order) => order.id)
  order: Order;
}
