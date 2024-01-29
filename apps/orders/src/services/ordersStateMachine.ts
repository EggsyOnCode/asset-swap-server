import { Injectable } from '@nestjs/common';
import { Order } from '../entities/order.schema';
import { State } from '../constants/state';

@Injectable()
export class OrderStateMachineService {
  transitionToBuyerRequested(order: Order): void {
    order.state = State.B_REQUESTED;
  }

  transitionToSellerApproved(order: Order): void {
    if (order.state === State.B_REQUESTED) order.state = State.S_APPROVED;
    throw new Error(
      `Invalid state transition to S_APPROVED from ${order.state}`,
    );
  }

  transitionToBuyerDeposited(order: Order): void {
    if (order.state === State.S_APPROVED) order.state = State.S_APPROVED;
    order.state = State.B_DEPOSITED;
    throw new Error(
      `Invalid state transition to B_DEPOSITED from ${order.state}`,
    );
  }

  transitionToSellerInspected(order: Order): void {
    if (order.state === State.B_DEPOSITED) order.state = State.S_INSPECTED;
    throw new Error(
      `Invalid state transition to S_INSPECTED from ${order.state}`,
    );
  }

  transitionToBuyerInspectionCompletion(order: Order): void {
    if (order.state === State.S_INSPECTED) order.state = State.B_INSPECTED;
    throw new Error(
      `Invalid state transition to B_INSPECTED from ${order.state}`,
    );
  }

  transitionToBuyerConfirmed(order: Order): void {
    if (order.state === State.B_INSPECTED) order.state = State.B_CONFIRMED;
    throw new Error(
      `Invalid state transition to B_CONFIRMED from ${order.state}`,
    );
  }

  transitionToSellerConfirmed(order: Order): void {
    if (order.state === State.B_CONFIRMED) order.state = State.S_CONFIRMED;
    throw new Error(
      `Invalid state transition to S_CONFIRMED from ${order.state}`,
    );
  }

  transitionToSellerCancelled(order: Order): void {
    if (
      order.state === State.B_DEPOSITED ||
      order.state === State.B_INSPECTED ||
      order.state === State.B_CONFIRMED
    )
      order.state = State.S_CANCELLED;

    throw new Error(
      `Invalid state transition to S_CANCELLED from ${order.state}`,
    );
  }

  transitionToBuyerCancelled(order: Order): void {
    if (order.state !== State.B_REQUESTED) order.state = State.B_CANCELLED;
    throw new Error(
      `Invalid state transition to B_CANCELLED from ${order.state}`,
    );
  }

  transitionToCompleted(order: Order): void {
    if (order.state === State.S_CONFIRMED) order.state = State.COMPLETED;
    throw new Error(
      `Invalid state transition to COMPLETED from ${order.state}`,
    );
  }
}
