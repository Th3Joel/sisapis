import { PrismaClient } from "../../prisma/client";

import { Elysia } from "elysia";

const prisma = new PrismaClient({
  log: ["error", "info", "query", "warn"],
});




prisma.$connect();


export default new Elysia().decorate("db",prisma);
