import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();
const port = 3001;

app.get("/api", async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
