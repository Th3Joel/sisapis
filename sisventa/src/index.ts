import { Elysia } from "elysia";
import AuhtR from "./routes/authR";
import UserR from "./routes/userR";
import ClienteR from "./routes/clienteR";
import fs from "fs";
import db from "./config/database";
import archivos from "./helpers/Files";
import ProveedorR from "./routes/proveedoresR";
import CategoriaR from "./routes/categoriaR";

const app = new Elysia({ prefix: "/sisventa" })

  .use(db)
  .use(AuhtR)
  .use(UserR)
  .use(ClienteR)
  .use(ProveedorR)
  .use(CategoriaR)

  /*.get("/img/:name", ({ params,set }) => {
    const path = "sisventa/uploads/img/profile/";
    const file = new archivos(path);
    return file.get(params.name).file;
  })*/

  .get("/", () => {
    return "hello";
  })

  .onError(({ error, set }) => {
    if (error.name == "ENOENT") {
      set.status = 200;

      return {
        status: false,
        msj: "Archivo no encontrado",
      };
    }
  });

export default app;
