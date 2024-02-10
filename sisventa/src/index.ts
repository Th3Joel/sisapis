import { Elysia } from "elysia";
import AuhtR from "./routes/AuthR";
import UserR from "./routes/UserR";
import {cors} from '@elysiajs/cors'

import db from "./config/Database";

const app = new Elysia({prefix:'/sisventa'})

.use(cors)
.use(db)
.use(AuhtR)
.use(UserR)

.get("/",()=>{
    return "hello";
})



export default app;