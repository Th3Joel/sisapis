import { comparePasswd } from "../helpers/Passwd";
import { makeToken } from "../helpers/Token";
export const Login = async ({ db, body, cookie: { token }}:any) => {
  const user = await db.user.findUnique({
    where: {
      email: body.email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      password:true
    }
  });
  
  if (!user)
    return {
      status: "error",
      msj: "Usuario no encontrado",
    };

  if (!(await comparePasswd(body.password, user.password)))
    return {
      status: "error",
      msj: "Credenciales incorrectas",
    };

    delete user.password;

  //Crear una cookie en la session
  const t = makeToken({id:user.id});
  token.value = t;
  token.set({
    domain:'hola:3000',
    httpOnly:true
  });
  

  return {
    user,
    t,
  };
};

export const Logout = ({ cookie: token }:any) => {
  token.remove();
  return {
    status: "true",
    msj: "Session cerrada",
  };
};
