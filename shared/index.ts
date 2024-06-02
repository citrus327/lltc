export enum SettlementStatus {
  PENDING = 0,
  SETTLED = 1,
  DISPUTED = -1,
}

export interface Settlement {
  id: number;
  amount: number;
  status: SettlementStatus;
}

export interface User {
  name: string;
}

export interface Offer {
  id: number;
  amount: number;
}
