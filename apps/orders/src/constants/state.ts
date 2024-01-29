export enum State {
  B_REQUESTED = 'buyer has requested',
  S_APPROVED = 'seller has approved',
  B_DEPOSITED = 'buyer has deposited funds',
  S_INSPECTED = 'seller has permitted inspection',
  B_INSPECTED = 'buyer has completed inspection',
  B_CONFIRMED = 'buyer has confirmed the order',
  S_CONFIRMED = 'seller has confirmed the order',
  S_CANCELLED = 'seller has cancelled the order',
  B_CANCELLED = 'buyer has cancelled the order',
  COMPLETED = 'completed',
}
