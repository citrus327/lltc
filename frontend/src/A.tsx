import { BaseComponentProps } from "./types";
import clsx from "clsx";
import { TextField, Box, Button, Alert } from "@mui/material";
import {
  fetchSettlement,
  fetchUserAInfo,
  getLatestOffer,
  placeSettlement,
} from "./api";
import { SubmitSettlementPayload } from "./api/types";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { Offer, Settlement, SettlementStatus, User } from "shared";
import { match, _ } from "@citrus327/match";

export const A: React.FC<BaseComponentProps> = (props) => {
  const { className, style } = props;
  const [settlement, setSettlement] = useState<Settlement>();
  const [userInfo, setUserInfo] = useState<User>();
  const [lastestOffer, setLastestOffer] = useState<Offer>();

  const retreiveSettlement = () => {
    fetchSettlement().then((res) => {
      const { data, success } = res;
      if (success) {
        if (data.status === SettlementStatus.SETTLED) {
          setSettlement(null!);
        } else {
          setSettlement(data);
        }
      }
    });
  };

  // get user info
  useEffect(() => {
    fetchUserAInfo().then((res) => {
      const { data, success } = res;
      success && setUserInfo(data);
    });
  }, []);

  // fetch current settlement
  useEffect(() => {
    retreiveSettlement();
  }, []);

  // get lastest offer from party B and refreshes settlement
  useEffect(() => {
    if (!settlement) return;

    const intervalId = setInterval(() => {
      getLatestOffer({ settlementId: settlement!.id }).then((res) => {
        const { success, data } = res;
        success && setLastestOffer(data);
      });
      retreiveSettlement();
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [settlement]);

  return (
    <div className={clsx(className)} style={style}>
      <div className="text-lg font-bold p-5 border-b text-right">
        Party {userInfo?.name}
      </div>

      <div className="p-5">
        {settlement && (
          <Alert
            severity={match(settlement?.status, [
              [SettlementStatus.PENDING, () => "info"],
              [SettlementStatus.SETTLED, () => "success"],
              [SettlementStatus.DISPUTED, () => "error"],
              [_, () => "info"],
            ])}
          >
            <div>
              Offered Settlement: <b>{settlement?.amount}</b>
            </div>
            {settlement?.status === SettlementStatus.DISPUTED && (
              <div>
                Party B offered: <b>{lastestOffer?.amount}</b>
              </div>
            )}

            <div>
              {match(settlement?.status, [
                [SettlementStatus.PENDING, () => "Waiting for Approving..."],
                [SettlementStatus.SETTLED, () => "Settled!"],
                [SettlementStatus.DISPUTED, () => "Settlement Disputed!"],
                [_, () => "Unknown"],
              ])}
            </div>
          </Alert>
        )}
        <Box
          className="flex flex-col gap-5 h-full p-5 pt-0 mt-5"
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = Object.fromEntries(
              new FormData(e.target as HTMLFormElement).entries()
            ) as unknown as SubmitSettlementPayload;

            placeSettlement({
              ...formData,
              id:
                settlement?.status === SettlementStatus.SETTLED
                  ? undefined
                  : settlement?.id,
            }).then(() => {
              (e.target as HTMLFormElement).reset();
              retreiveSettlement();
              toast("Updated!", { position: "top-left" });
            });
          }}
        >
          <TextField required label="Amount" name="amount" type="number" />

          <Button variant="contained" type="submit" className="mt-auto">
            Submit
          </Button>
        </Box>
      </div>

      <Toaster position="bottom-left" />
    </div>
  );
};
