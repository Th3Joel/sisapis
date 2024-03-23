import { Elysia } from "elysia";
import { Login, Logout, requestPasswd, verify } from "../controllers/loginController";
import Validation from "../middlewares/validation";
import { LoginSchema } from "../validations/authSchema";
import Auth from "../middlewares/auth";
import mdd from "../helpers/parseMiddle"

const route = new Elysia({ prefix: "/auth" })

  .post("/login", Login,mdd([Validation,LoginSchema]))

  .post("/reset", requestPasswd) 
  .post("/verify",verify)
  .get("/logout", Logout, mdd([Auth]));

export default route;
