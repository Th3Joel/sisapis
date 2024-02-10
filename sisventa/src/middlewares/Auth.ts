import { string } from "zod";
import { verifyToken } from "../helpers/Token";

interface AuthInput{
    cookie:{
        _secure:{
            value:string
        }
    };
    store:any;
    db:any;
}
const Auth = async(input:AuthInput) => {
    const {cookie:{_secure},store,db} = input;
    
  const t:any = await verifyToken(_secure.value,db,true);
  if(!t){
    return "No autorizado";
  }
  if(t.id){
    store.user = {id:t.id}
  }
};

export default Auth;
