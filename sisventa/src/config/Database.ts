import { PrismaClient } from "../../prisma/client";

import { Elysia } from "elysia";

const prisma = new PrismaClient({
  log: ["error", "info", "warn"],
});




prisma.$connect();


export default new Elysia().decorate("db",prisma);
