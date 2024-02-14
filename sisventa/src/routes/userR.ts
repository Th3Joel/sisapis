import { Elysia } from "elysia";
import Auth from "../middlewares/auth";
import {
  createUser,
  getUsers,
  getProfile,
  updateUser,
  deleteUser,
  updatePasswd,
} from "../controllers/userController";
import { CreateSchema, UpdatePassSchema } from "../validations/userSchema";
import Validation from "../middlewares/validation";
import Role from "../middlewares/role";

import mdd from "../helpers/parseMiddle";

//Para crear un grupo de rutas
const UserR = new Elysia({ prefix: "/user" }).guard(
  {
    //Midleware
    beforeHandle: Auth,
  },
  (app) =>
    app

      .get("/all", getUsers, mdd([Role]))

      .group("/profile", mdd([Role, "user"]), (app) =>
        app
          .get("", getProfile, mdd([Role, "user"]))
          .get("/:id", getProfile, mdd([Role]))
      )

      .group("", mdd([Validation, CreateSchema]), (app) =>
        app
          .post("", createUser, mdd([Role]))
          .patch("", updateUser, mdd([Role, "user"]))
          .patch("/:id", updateUser, mdd([Role]))
      )

      .post("/update_passwd", updatePasswd, mdd([Validation, UpdatePassSchema]))

      .delete("/:id", deleteUser, mdd([Role]))
);

export default UserR;
