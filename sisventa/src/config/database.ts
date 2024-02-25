import { PrismaClient } from "prisma/prisma-client";

import { Elysia } from "elysia";

export const prisma = new PrismaClient({
  log: ["error", "info", "warn"],
});




prisma.$connect().then(()=>console.log("Conectado a la base de datos"));


export default new Elysia().decorate("db",prisma);
