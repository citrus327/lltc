import { SettlementStatus } from "shared";

export interface SubmitSettlementPayload {
  amount?: string;
  id?: number;
  status?: SettlementStatus;
}
