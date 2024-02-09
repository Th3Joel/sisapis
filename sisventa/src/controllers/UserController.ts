import { comparePasswd, makePasswd } from "../helpers/Passwd";

export const getUsers = ({ db }: any) => {
  return db.user.findMany();
};

export const createUser = async ({ db, body }: any) => {
  const existEmail = await db.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (existEmail)
    return {
      status: false,
      msj: "Este email ya existe",
    };

  const user = await db.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: await makePasswd(body.password),
    },
  });

  return {
    msj: "Creado correctamente",
    user,
  };
};

export const updateUser = async ({ db, body, params, store }: any) => {
  const id = params !== undefined ? params.id : store.user.id;

  const exist = await db.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!exist)
    return {
      status: false,
      msj: "El usuario no existe",
    };

  const existEmail = await db.user.findUnique({
    where: {
      email: body.email,
    },
    select: {
      id: true,
    },
  });

  if (existEmail && existEmail.id !== id)
    return {
      status: false,
      msj: "Este email ya existe",
    };

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
  return user;
};

export const deleteUser = async ({ db, store, params }: any) => {
  const id = params.id;

  if (id === store.user.id)
    return {
      status: false,
      msj: "No puedes eliminar tu usuario",
    };

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
};

export const updatePasswd = async ({ db, store, body, set }: any) => {
  const { old, confirm, passwd } = body;

  let err: any = { error: [] };

  const user = await db.user.findUnique({ where: { id: store.user.id } });

  if (!(await comparePasswd(old, user.password))) {
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

