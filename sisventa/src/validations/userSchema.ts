import { z } from "zod";

 export const CreateSchema = z.object({
  
    name: z.string().max(50),
    email: z.string().email(),
    password:z.string().min(4),
    role:z.enum(["vendedor","admin","bodega"])
  
});

export const UpdatePassSchema = z.object({
  
    old:z.string(),
    confirm:z.string().min(4),
    passwd:z.string().min(4)
  
});