interface ICliente {
  db: any;
  body: {
    nombre: string;
    apellido: string;
    celular: string;
    correo: string;
    direccion: string;
  };
  params: {
    id: string;
  };
  query: {
    page: string;
    pageSize: string;
    search: string | undefined;
  };
}

export const all = async ({
  db,
  query: { page, pageSize, search },
}: ICliente) => {
  //Si viene el parametro search busca si no lista todos
  let where = {};
  if (search) {
    where = {
      OR: [
        {
          nombre: {
            contains: search,
          },
        },
        {
          apellido: {
            contains: search,
          },
        },
      ],
    };
  }

  const clientes = await db.cliente.findMany({
    skip: (parseInt(page) - 1) * parseInt(pageSize),
    take: parseInt(pageSize),
    where,
  });

  const count = parseInt(await db.cliente.count({where}));

  return {
    status: true,
    all: {
      data: clientes,
      count,
      pages: Math.ceil(count / parseInt(pageSize)),
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    },
  };
};
export const find = async ({ params, db }: ICliente) => {
  const cliente = await db.cliente.findUnique({ where: { id: params.id } });
  if (!cliente)
    return {
      status: false,
      msj: "Usuario no encontrado",
    };

  return {
    status: true,
    find: cliente,
  };
};
export const save = async ({ db, body }: ICliente) => {
  const cliente = await db.cliente.create({
    data: {
      nombre: body.nombre,
      apellido: body.apellido,
      celular: body.celular,
      correo: body.correo,
      direccion: body.direccion,
    },
  });

  if (!cliente)
    return {
      status: false,
      msj: "Ha ocurrido un error",
    };

  return {
    status: true,
    msj: "Cliente creado exitosamente",
    cliente,
  };
};
export const update = async ({ db, body, params }: ICliente) => {
  try {
    const cliente = await db.cliente.update({
      where: {
        id: params.id,
      },
      data: {
        nombre: body.nombre,
        apellido: body.apellido,
        celular: body.celular,
        correo: body.correo,
        direccion: body.direccion,
      },
    });

    return {
      status: true,
      msj: "Cliente actualizado correctamente",
    };
  } catch (error: any) {
    if (error.code === "P2025")
      return {
        status: false,
        msj: "Cliente no encontrado",
      };
  }
};

export const remove = async ({ db, params }: ICliente) => {
  try {
    await db.cliente.delete({ where: { id: params.id } });

    return {
      status: true,
      msj: "Cliente eliminado correctamente",
    };
  } catch (error: any) {
    if (error.code === "P2025")
      return {
        status: false,
        msj: "Cliente no encontrado",
      };
  }
};
