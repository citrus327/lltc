import { useCallback, useEffect, useRef, useState } from "react";
import { BaseComponentProps } from "./types";
import clsx from "clsx";
import {
  disputeSettlement,
  fetchSettlement,
  fetchUserBInfo,
  settle,
} from "./api";
import { Settlement, SettlementStatus, User } from "shared";
import { Toaster, toast } from "react-hot-toast";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from "@mui/material";
import { parseInt } from "lodash-es";

export const B: React.FC<BaseComponentProps> = (props) => {
  const { className, style } = props;
  const [settlement, setSettlement] = useState<Settlement>();
  const [userInfo, setUserInfo] = useState<User>();
  const $ref = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);

  // Get latest settlement from Party A, and notify if party A gives a new settlement
  const retreiveSettlement = useCallback(() => {
    fetchSettlement().then((res) => {
      const { data, success } = res;

      if (settlement?.amount && data.amount !== settlement?.amount) {
        toast("Party A has placed another settlement!", {
          position: "top-right",
        });
      }

      success && setSettlement(data);
    });
  }, [settlement]);

  // get user info
  useEffect(() => {
    fetchUserBInfo().then((res) => {
      const { data, success } = res;
      success && setUserInfo(data);
    });
  }, []);

  // retreive settlement every 1 second
  useEffect(() => {
    const intervalId = setInterval(() => {
      retreiveSettlement();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [retreiveSettlement, settlement]);

  return (
    <div className={clsx(className)} style={style}>
      <div className="border-b p-5 flex items-center justify-between">
        <span className="text-lg font-bold ">Party {userInfo?.name}</span>
      </div>

      {!settlement || settlement?.status === SettlementStatus.SETTLED ? (
        <Alert severity="info" className="m-5">
          <div>Waiting for Party A to place a settlement...</div>
        </Alert>
      ) : (
        <div className="p-5 space-y-5">
          <Alert severity="info">Settlement from A: {settlement?.amount}</Alert>
          <Box
            className="flex flex-col gap-5 h-full p-5 pt-0 mt-5"
            component="form"
            ref={$ref}
            onSubmit={(e) => {
              e.preventDefault();
              const formData = Object.fromEntries(
                new FormData(e.target as HTMLFormElement).entries()
              ) as unknown as { amount: string };

              disputeSettlement({
                settlementId: settlement!.id,
                amount: parseInt(formData.amount),
              }).then(() => {
                retreiveSettlement();

                (e.target as HTMLFormElement).reset();
                toast("Settlement Disputed!", { position: "top-right" });
              });
            }}
          >
            <TextField required label="Amount" name="amount" type="number" />

            <Button
              variant="contained"
              type="submit"
              className="mt-auto"
              disabled={settlement?.status === SettlementStatus.DISPUTED}
            >
              Dispute
            </Button>
          </Box>

          <Button
            fullWidth
            color="success"
            variant="contained"
            className="!mt-64"
            disabled={settlement?.status === SettlementStatus.DISPUTED}
            onClick={() => {
              setOpen(true);
            }}
          >
            Agree
          </Button>
        </div>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Agree</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to agree with a settlement of
            <b className="text-red-500"> {settlement?.amount}</b>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            close
          </Button>
          <Button
            onClick={() => {
              settle({
                settlementId: settlement!.id,
              }).then(() => {
                $ref.current!.reset();
                setSettlement(null!);
              });
              setOpen(false);
            }}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <Toaster position="bottom-right" />
    </div>
  );
};
