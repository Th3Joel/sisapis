import { comparePasswd } from "../helpers/Passwd";
import { makeToken } from "../helpers/Token";
import { Resend } from "resend";

interface LoginInput {
  body: {
    email: string;
    password: string;
  };
  db: any;
  cookie: {
    _secure: any;
  };
}
export const Login = async (input: LoginInput) => {
  const {
    db,
    body,
    cookie: { _secure },
  } = input;


  const tokenRecord = await db.token.findFirst({
    where: { token: _secure.value },
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
      password: true,
    },
  });

  if (!user || !(await comparePasswd(body.password, user.password)))
    return {
      status: "error",
      msj: "Credenciales incorrectas",
    };

  delete user.password;

  //Crear una cookie en la session
  const t = makeToken({ id: user.id }, "2d");

  const tokenSaved = await db.token.create({
    data: {
      userId: user.id,
      token: t,
    },
  });

  if (!tokenSaved) return "error";
  _secure.value = t;
  _secure.httpOnly = true;
  _secure.domain = "localhost";
  _secure.path = "/";


  return {
    user,
    t,
  };
};

export const Logout = async ({ cookie: { _secure }, db }: any) => {
  await db.token.deleteMany({
    where: {
      token: {
        contains: _secure.value,
      },
    },
  });
  _secure.remove();
  _secure.domain = "localhost";
  _secure.path = "/";
  _secure.httpOnly = true;
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
  const tok = makeToken({id:user.id},"10m");
  const url = headers.host+"/sisventa/auth/verify?auth="+tok;

const resend = new Resend("re_gJ9U29Ve_K3dA7LXQGLQgytPZhfcgc61X");
const {data,error} = await resend.emails.send({
  from:"joel@triceratox.lat",
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


export const verify = ({query}:any) =>{
return query.auth;
}