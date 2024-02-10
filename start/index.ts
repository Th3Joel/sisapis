import { Elysia } from "elysia";

import sisventa from "../sisventa/src/index";

import {cors} from "@elysiajs/cors";

const app = new Elysia()
.use(cors())

.use(sisventa)

.get("/", () => "Hola")

.listen(8080);

console.log(
  `💀 server is running at ${app.server?.hostname}: ${app.server?.port} 📡`
);
