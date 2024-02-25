import { Elysia } from "elysia";
import Auth from "../middlewares/auth";
import {
  all,
  find,
  remove,
  save,
  update,
} from "../controllers/clienteController";
import Validation from "../middlewares/validation";
import { ClienteSchema } from "../validations/clienteSchema";
import m from "../helpers/parseMiddle";

const ClienteR = new Elysia({ prefix: "/clientes" }).guard(
  {
    beforeHandle: Auth,
  },
  (app) =>
    app
      .get("/all", all)
      .get("/:id", find)
      .group("", m([Validation, ClienteSchema]), (app) =>
        app.post("/", save).put("/:id", update)
      )
      .delete("/:id", remove)
);

export default ClienteR;
