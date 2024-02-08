import { z } from "zod";

 export const CreateSchema = z.object({
  body: z.object({
    name: z.string().max(50),
    email: z.string().email(),
    password:z.string().min(4),
    role:z.enum(["user","admin"])
  }),
});

