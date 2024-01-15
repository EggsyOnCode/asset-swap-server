import { Injectable } from '@nestjs/common';
import { Order } from '../entities/order.schema';
import { State } from '../constants/state';

@Injectable()
export class OrderStateMachineService {
  transitionToRequested(order: Order): void {
    order.state = State.REQUESTED;
  }
  transitionToCancelled(order: Order): void {
    if (
      order.state === State.REQUESTED ||
      order.state === State.ACCEPTED ||
      order.state === State.INSPECTED ||
      order.state === State.SELLER_CONF_PENDING
    ) {
      order.state = State.CANCELLED;
    } else {
      throw new Error(
        `Invalid state transition to Cancelled from ${order.state}`,
      );
    }
  }

  transitionToAccepted(order: Order): void {
    if (order.state === State.REQUESTED) {
      order.state = State.ACCEPTED;
    } else {
      throw new Error(
        `Invalid state transition to ACCEPTED State from ${order.state}`,
      );
    }
  }

  transitionToInspected(order: Order): void {
    if (order.state === State.ACCEPTED) {
      order.state = State.INSPECTED;
      // Any other logic related to transitioning to inspected state
    } else {
      throw new Error(
        `Invalid state transition to Inspected from ${order.state}`,
      );
    }
  }

  transitionToSellerConfPending(order: Order): void {
    if (order.state === State.INSPECTED) {
      order.state = State.SELLER_CONF_PENDING;
    } else {
      throw new Error(
        `Invalid state transition to seller_confirmation_pending state from ${order.state}`,
      );
    }
  }

  transitionToCompleted(order: Order): void {
    if (order.state === State.SELLER_CONF_PENDING) {
      order.state = State.COMPLETED;
    } else {
      throw new Error(
        `Invalid state transition to Completed from ${order.state}`,
      );
    }
  }
}
