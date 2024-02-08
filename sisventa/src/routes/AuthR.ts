import { Elysia } from "elysia";
import { Login,Logout } from "../controllers/LoginController";
import Validation from "../middlewares/Validation";
import { LoginSchema } from "../validations/AuthSchema";
import Auth from "../middlewares/Auth";



const route = new Elysia({prefix:"/auth"})

.post("/login", Login, {
    beforeHandle:(d) => Validation(d,LoginSchema)
  })
  
.get("/logout",Logout,{
    beforeHandle:Auth
})



export default route;