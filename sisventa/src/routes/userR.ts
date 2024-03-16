import { Elysia } from "elysia";
import Auth from "../middlewares/auth";
import {
  createUser,
  all,
  getProfile,
  updateUser,
  deleteUser,
  updatePasswd,
  picture,
} from "../controllers/userController";
import { CreateSchema, UpdatePassSchema } from "../validations/userSchema";
import Validation from "../middlewares/validation";
import Role from "../middlewares/role";

import mdd from "../helpers/parseMiddle";

//Para crear un grupo de rutas
const UserR = new Elysia({ prefix: "/users" }).guard(
  {
    //Midleware
    beforeHandle: Auth,
  },
  (app) =>
    app
    .get("/picture/:name",picture)
      .get("/all", all, mdd([Role]))

      .group("/profile", (app) =>
        app
          .get("", getProfile, mdd([Role, "bodega"]))
          .get("/:id", getProfile, mdd([Role]))
      )

      .group("", mdd([Validation, CreateSchema]), (app) =>
        app
          .post("", createUser, mdd([Role]))
          .put("", updateUser, mdd([Role, "user"]))
          .put("/:id", updateUser, mdd([Role]))
      )
      .post("/upload",({body}:{body:{file:File}})=>{
        console.log(body)
      })
      .post("/update_passwd", updatePasswd, mdd([Validation, UpdatePassSchema]))

      .delete("/:id", deleteUser, mdd([Role]))
)


export default UserR;
