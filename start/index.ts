import { Elysia } from "elysia";

import sisventa from "../sisventa/src/index";

import { cors } from "@elysiajs/cors";

const app = new Elysia()
  .use(
    cors({
      origin: true, // Acepta solicitudes desde cualquier origen
      methods: "*", // Permite todos los métodos HTTP
      allowedHeaders: "*", // Acepta todas las cabeceras entrantes
      exposedHeaders: "*", // Expone todas las cabeceras en la respuesta
      credentials: true, // Permite el uso de credenciales (cookies, encabezados de autorización, etc.)
      maxAge: 5,
    })
  )

  .use(sisventa)

  .get("/", () => "Hola")

  .listen(8080);

console.log(
  `💀 server is running at ${app.server?.hostname}: ${app.server?.port} 📡`
);
