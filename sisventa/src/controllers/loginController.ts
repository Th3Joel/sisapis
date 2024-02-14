import { comparePasswd, makePasswd } from "../helpers/passwd";
import { makeToken, verifyToken } from "../helpers/token";
import { Resend } from "resend";

interface LoginInput {
  body: {
    email: string;
    password: string;
  };
  db: any;
  
  headers:{
    key:string
  };
}
export const Login = async (input: LoginInput) => {
  const {
    db,
    body,
    headers
  } = input;

  const tokenRecord = await db.token.findFirst({
    where: { token: headers.key ?? '' },
  });
 
  if (tokenRecord) {
    return {
      status: false,
      msj: "Ya esta logeado",
    };
  }

  const user = await db.user.findUnique({
    where: {
      email: body.email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role:true,
      password: true,
    },
  });

  if (!user || !(await comparePasswd(body.password, user.password)))
    return {
      status: "error",
      msj: "Credenciales incorrectas",
    };

  delete user.password;

  //Crear el token y enviarselo guradarlo a la db
  const token = makeToken({ id: user.id,role:user.role }, "2d");

  const tokenSaved = await db.token.create({
    data: {
      userId: user.id,
      token
    },
  });

  if (!tokenSaved) return "error";
  /*_secure.value = t;
  _secure.httpOnly = true;
  _secure.domain = headers.host.split(':')[0];
  _secure.path = "/";*/


  return {
    ...user,
    token
  };
};

export const Logout = async ({ db ,headers}: any) => {
  await db.token.deleteMany({
    where: {
      token: {
        contains: headers.key,
      },
    },
  });
  /*_secure.remove();
  _secure.domain = headers.host.split(':')[0];
  _secure.path = "/";
  _secure.httpOnly = true;*/
  return {
    status: "true",
    msj: "Session cerrada",
  };
};


export const requestPasswd = async ({ body, db,headers }: any) => {
  const user = await db.user.findFirst({
    where: {
      email: body.email,
    },
  });
  if(!user){
    return{
      status:false,
      msj:"Este email no existe"
    }
  }
  const tok = makeToken({id:user.id,role:"nothing"},"10m");
  const url = headers.host+"/sisventa/auth/verify?auth="+tok;

const resend = new Resend("re_gJ9U29Ve_K3dA7LXQGLQgytPZhfcgc61X");
const {data,error} = await resend.emails.send({
  from:"Triceratox <auth@triceratox.lat>",
  to:user.email,
  subject:"Reestablece tu contraseña",
  html:`<a href="${url}">${url}</a>`

});

if(error){
  return {
    status:false,
    msj:"Ha currido un error"
  }
}

  return {
    status:true,
    msj:"Email fue enviado a tu correo"
  };
};


export const verify = async({query,body,db}:any) =>{

  const user:any = await verifyToken(query.auth,null,false);
  if(!user){
    return{
      status:"false",
      code:404
    };
  }
if(body.confirm !== body.passwd){
  return{
    status:false,
    msj:"Las contraseñas no coinciden"
  }
}

const updated = await db.user.update({
  where:{
    id:user.id
  },data:{
    password:await makePasswd(body.passwd)
  }
});

return {
  status:true,
  msj:"Contraseña actualizada correctamente"
};
}