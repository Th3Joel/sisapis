import { Elysia } from "elysia";
import AuhtR from "./routes/authR";
import UserR from "./routes/userR";
import ClienteR from "./routes/clienteR";

import db from "./config/database";

const app = new Elysia({prefix:'/sisventa'})

.use(db)
.use(AuhtR)
.use(UserR)
.use(ClienteR)

.get("/",()=>{
    return "hello";
})



export default app;