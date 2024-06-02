import { request } from "../utils/request";
import { SubmitSettlementPayload } from "./types";
import { parseInt } from "lodash-es";

export const placeSettlement = (payload: SubmitSettlementPayload) => {
  return request("/api/place-settlement", {
    method: "POST",
    body: {
      amount: parseInt(payload.amount!),
      id: payload.id,
    },
  });
};

export const fetchSettlement = () => {
  return request("/api/settlement", { method: "GET" });
};

export const fetchUserAInfo = () => {
  return request("/api/user/a", { method: "GET" });
};

export const fetchUserBInfo = () => {
  return request("/api/user/b", { method: "GET" });
};

export const disputeSettlement = (payload: {
  settlementId: number;
  amount: number;
}) => {
  return request("/api/dispute-settlement", {
    method: "POST",
    body: {
      settlementId: payload.settlementId,
      amount: payload.amount,
    },
  });
};

export const getLatestOffer = (payload: { settlementId: number }) => {
  return request(
    `/api/latest-settlement?settlementId=${payload.settlementId}`,
    {
      method: "GET",
    }
  );
};

export const settle = (payload: { settlementId: number }) => {
  return request("/api/settle", {
    method: "POST",
    body: {
      settlementId: payload.settlementId,
    },
  });
};
