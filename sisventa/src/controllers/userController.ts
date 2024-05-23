import archivos from "../helpers/Files";
import { comparePasswd, makePasswd } from "../helpers/passwd";

interface IUsers{
  query:{
    page: string;
    pageSize: string;
    search: string | undefined;
  }
  db:any;
  store:{
    user:{
      id:string
    }
  }
  set:any;

  body:{
    imgFile:File
    name:string
    email:string
    role:string
    password:string
  }

  params:{
    name:string;
  }
}
export const all = async({ db,query:{page,pageSize,search},store }: IUsers) => {
  let where:any = {
    NOT:{
      id:{
        equals:store.user.id
      }
    },
    OR:undefined
  }
  if(search){
    where.OR= [
        {
          name:{
            contains:search
          }
        },
        {
          email:{
            contains:search
          }
        }
      ]
    
  }
  const users = await db.user.findMany({
    skip:(parseInt(page) - 1) * parseInt(pageSize),
    take:parseInt(pageSize),
    where,
    select:{
      id:true,
      name:true,
      email:true,
      role:true,
      picture:true
    }
  });

  const count = parseInt(await db.user.count({where}))
  return {
    status:true,
    all:{
      data:users,
      count,
      pages: Math.ceil(count / parseInt(pageSize)),
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    }
  }
};

export const createUser = async ({ db, body }: IUsers) => {
  
  //Sacar nombre de imagen
  const ext = body.imgFile.name.split(".")[1];
  const nameFile = `${body.email}.${ext}`;

  const user = await db.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: await makePasswd(body.password),
      role: body.role,
      picture:nameFile
    },
  });


  //Guardar la imagen
  
    const file = new archivos("sisventa/uploads/img/profile/");
    file.save(nameFile,body.imgFile);
  

  return {
    status:true,
    msj: "Usuario creado correctamente",
    user,
  };
};

export const updateUser = async ({ db, body, params, store }: any) => {
  const id = params?.id ? params.id : store.user.id;

  try {
    const updateUser = await db.user.update({
      where: {
        id,
      },
      data: {
        name: body.name,
        email: body.email,
        password: await makePasswd(body.password),
        role: body.role,
      },
    });

    return {
      status: true,
      msj: "Usuario actualizado correctamente",
      user: updateUser,
    };
  } catch (error: any) {
    if (error.code === "P2025")
      return {
        status: false,
        msj: "Usuario no encontrado",
      };
  }
};

export const getProfile = async ({ db, store, params }: any) => {
  const id = params !== undefined ? params.id : store.user.id;

  const user = await db.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    return {
      status: false,
      msj: "Usuario no encontrado",
    };
  }
  delete user.password;
  return {
    status: true,
    user,
  };
};

export const deleteUser = async ({ db, store, params }: any) => {
  
  const id = params.id;

  if (id === store.user.id)
    return {
      status: false,
      msj: "No puedes eliminar tu cuenta",
    };
  try {
    const delUser = await db.user.delete({
      where: {
        id,
      },
    });

    if (delUser)
      return {
        status: true,
        msj: "Usuario eliminado correctamente",
      };
  } catch (error: any) {
    if (error.code === "P2025")
      return {
        status: false,
        msj: "Usuario no encontrado",
      };
  }
};

export const updatePasswd = async ({ db, store, body, set }: any) => {
  const { old, confirm, passwd } = body;

  let err: any = { error: [] };

  const user = await db.user.findUnique({ where: { id: store.user.id } });

  if (await comparePasswd(old, user.password)) {
    err.error.push({
      input: "old",
      msj: "Contraseña incorrecta",
    });
  }

  if (passwd !== confirm) {
    err.error.push({
      input: "confirm",
      msj: "Las contraseñas no coinciden",
    });
  }

  if (err.error.length !== 0) {
    return err;
  }

  const up = await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: await makePasswd(passwd),
    },
  });

  if (up) {
    return {
      status: true,
      msj: "Contraseña actualizada correctamente",
    };
  } else {
    set.status = 500;
  }
};

export const picture = ({params:{name},set}:IUsers) => {
  const file = new archivos("sisventa/uploads/img/profile/");

  set.headers["Content-Type"] ="image/png";
  return file.get(name).file;
}