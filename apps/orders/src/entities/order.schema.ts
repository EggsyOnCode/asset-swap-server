import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum State {
  REQUESTED = 'requested',
  INSPECTED = 'inspected',
  COMPLETED = 'completed',
}

@Entity()
export class Order {
  @PrimaryColumn()
  orderID: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'enum', enum: State })
  state: State;
}
