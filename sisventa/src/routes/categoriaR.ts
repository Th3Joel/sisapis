import { Elysia } from "elysia";
import Auth from "../middlewares/auth";
import {
  all,
  find,
  remove,
  save,
  update,
} from "../controllers/categoriaController";
import Validation from "../middlewares/validation";
import { CategoriaSchema } from "../validations/categoriaSchema";
import m from "../helpers/parseMiddle";

const CategoriaR = new Elysia({ prefix: "/categorias" }).guard(
  {
    beforeHandle: Auth,
  },
  (app) =>
    app
      .get("/all", all)
      .get("/:id", find)
      .group("", m([Validation, CategoriaSchema]), (app) =>
        app.post("/", save).put("/:id", update)
      )
      .delete("/:id", remove)
);

export default CategoriaR;
