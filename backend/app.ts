import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Settlement, SettlementStatus } from "shared";
import { prisma } from "./primsa";
import { findUserA, findUserB } from "./fn";

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.get("/api/settlement", async (_, res) => {
  const currentSettlement = await prisma.settlement.findFirst({
    where: {
      sender_id: (await findUserA()).id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json({
    success: true,
    data: currentSettlement,
  });
});

app.get("/api/user/a", async (_, res) => {
  res.json({
    success: true,
    data: await findUserA(),
  });
});

app.get("/api/user/b", async (_, res) => {
  res.json({
    success: true,
    data: await findUserB(),
  });
});

app.post("/api/place-settlement", async (req, res) => {
  const payload = req.body;

  try {
    const userA = await prisma.user.findFirst({
      where: {
        name: "A",
      },
    });

    const id = payload.id;
    if (id) {
      const settlement = await prisma.settlement.update({
        data: {
          amount: payload.amount,
          status: SettlementStatus.PENDING,
        },
        where: {
          id,
        },
      });

      res.json({
        success: true,
        data: settlement,
      });
    } else {
      const settlement: Settlement = await prisma.settlement.create({
        data: {
          amount: payload.amount,
          status: SettlementStatus.PENDING,
          sender_id: userA.id,
        },
      });

      res.json({
        success: true,
        data: settlement,
      });
    }
  } catch (e) {
    console.error(e);
    res.json({
      success: false,
      data: null,
    });
  }
});

app.post("/api/dispute-settlement", async (req, res) => {
  const payload = req.body;
  const settlement = await prisma.settlement.update({
    data: {
      status: SettlementStatus.DISPUTED,
    },
    where: {
      id: payload.settlementId,
    },
  });

  const userA = await findUserA();
  await prisma.record.create({
    data: {
      receiver_id: userA.id,
      amount: payload.amount,
      settlement_id: payload.settlementId,
    },
  });

  res.json({
    success: true,
    data: settlement,
  });
});

app.post("/api/settle", async (req, res) => {
  const payload = req.body;
  const settlement = await prisma.settlement.update({
    data: {
      status: SettlementStatus.SETTLED,
    },
    where: {
      id: payload.settlementId,
    },
  });

  res.json({
    success: true,
    data: settlement,
  });
});

app.get("/api/latest-settlement", async (req, res) => {
  const payload = req.query;
  const list = await prisma.record.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      settlement_id: parseInt(payload.settlementId as string),
    },
  });

  res.json({
    success: true,
    data: list[0],
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
