import { Elysia } from "elysia";
import Auth from "../middlewares/auth";
import {
  all,
  find,
  remove,
  save,
  update,
} from "../controllers/proveedorController";
import Validation from "../middlewares/validation";
import { ProveedorSchema } from "../validations/proveedorSchema";
import m from "../helpers/parseMiddle";

const ProveedorR = new Elysia({ prefix: "/proveedores" }).guard(
  {
    beforeHandle: Auth,
  },
  (app) =>
    app
      .get("/all", all)
      .get("/:id", find)
      .group("", m([Validation, ProveedorSchema]), (app) =>
        app.post("/", save).put("/:id", update)
      )
      .delete("/:id", remove)
);

export default ProveedorR;
