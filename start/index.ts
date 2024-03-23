import { Elysia } from "elysia";

import sisventa from "../sisventa/src/index";

import { cors } from "@elysiajs/cors";

import archivos from "../sisventa/src/helpers/Files";
import fs from "fs"
//import cors from 'cors'

const app = new Elysia()
  .use(
    cors({
      methods: ["GET", "DELETE", "PUT", "POST"],
    })
  )

  .use(sisventa)

  
  .listen(8080);

console.log(
  `💀 server is running at ${app.server?.hostname}: ${app.server?.port} 📡`
);
