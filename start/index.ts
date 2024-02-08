import { Elysia } from "elysia";

import sisventa from "../sisventa/src/index"

const app = new Elysia()


.use(sisventa)

.get("/", () => "Hola")

.listen(3000);

console.log(
  `💀 server is running at ${app.server?.hostname}: ${app.server?.port} 📡`
);
