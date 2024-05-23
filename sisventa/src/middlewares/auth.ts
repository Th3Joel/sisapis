import { verifyToken } from "../helpers/token";

interface AuthInput{
    headers:{
        key:string
    };
    store:any;
    db:any;
    cookie:{
      _secure:{
        value:string
      }
    }
}
const Auth = async(input:any) => {
    const {headers,store,db,cookie} = input;
    
  const t:any = await verifyToken(headers.key,db,true);
  if(!t){
    return {
      status:false,
      msj:"No autorizado"
    }
  }
  if(t.id){
    store.user = {id:t.id,role:t.role}
  }
};

export default Auth;
