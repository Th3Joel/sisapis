import { Elysia,Handler } from "elysia";
import Auth from "../middlewares/Auth";
import {
  createUser,
  getUsers,
  getProfile,
  updateUser,
  deleteUser,
  updatePasswd
} from "../controllers/UserController";
import { CreateSchema, UpdatePassSchema } from "../validations/UserSchema";
import Validation from "../middlewares/Validation";

//Para crear un grupo de rutas
const route = new Elysia({ prefix: "/user" }).guard(
  {
    //Midleware
    beforeHandle: Auth,
  },
  (app:Handler) =>

    app
      .get("/all", getUsers)
      
      .group("/profile", (app:Handler) =>
        app.get("", getProfile).get("/:id", getProfile)
      )

      .group(
        "",
        {
          beforeHandle: (x:Handler) => Validation(x, CreateSchema),
        },
        (app:Handler) =>
          app
            .post("", createUser)
            .patch("", updateUser)
            .patch("/:id", updateUser)
      )
      .post("/update_passwd",updatePasswd,{
        beforeHandle:(x:Handler) => Validation(x,UpdatePassSchema)
      })

      .delete("/:id", deleteUser)
)

export default route; 
