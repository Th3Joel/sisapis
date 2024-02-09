import { Elysia } from "elysia";
import { Login, Logout, requestPasswd, verify } from "../controllers/LoginController";
import Validation from "../middlewares/Validation";
import { LoginSchema } from "../validations/AuthSchema";
import Auth from "../middlewares/Auth";

const route = new Elysia({ prefix: "/auth" })

  .post("/login", await Login, {
    beforeHandle: (d: any) => Validation(d, LoginSchema),
  })

  .post("/reset", requestPasswd)
  .get("/verify",verify)
  .get("/logout", Logout, {
    beforeHandle: Auth,
  });

export default route;
