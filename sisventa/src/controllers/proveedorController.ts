interface IProveedores {
    db: any;
    body: {
      nombre: string;
      direccion: string;
      telefono: string;
      correo: string;
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
  }: IProveedores) => {
    //Si viene el parametro search busca si no lista todos
    let where = {};
    if (search) {
      where = {
        OR: [
          {
            nombre: {
              contains: search,
            },
          }
        ],
      };
    }
  
    const proveedores = await db.proveedores.findMany({
      skip: (parseInt(page) - 1) * parseInt(pageSize),
      take: parseInt(pageSize),
      where,
    });
  
    const count = parseInt(await db.proveedores.count({where}));
  
    return {
      status: true,
      all: {
        data: proveedores,
        count,
        pages: Math.ceil(count / parseInt(pageSize)),
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      },
    };
  };
  export const find = async ({ params, db }: IProveedores) => {
    const proveedores = await db.proveedores.findUnique({ where: { id: params.id } });
    if (!proveedores)
      return {
        status: false,
        msj: "Proveedores no encontrado",
      };
  
    return {
      status: true,
      find: proveedores,
    };
  };

  export const save = async ({ db, body }: IProveedores) => {
    const proveedores = await db.proveedores.create({
      data: {
        nombre: body.nombre,
        telefono: body.telefono,
        correo: body.correo,
        direccion: body.direccion,
      },
    });
  
    if (!proveedores)
      return {
        status: false,
        msj: "Ha ocurrido un error",
      };
  
    return {
      status: true,
      msj: "Proveedor creado exitosamente",
      proveedores,
    };
  };
  export const update = async ({ db, body, params }: IProveedores) => {
    try {
      const proveedores = await db.proveedores.update({
        where: {
          id: params.id,
        },
        data: {
          nombre: body.nombre,
          telefono: body.telefono,
          correo: body.correo,
          direccion: body.direccion,
        },
      });
  
      return {
        status: true,
        msj: "Proveedor actualizado correctamente",
      };
    } catch (error: any) {
      if (error.code === "P2025")
        return {
          status: false,
          msj: "Proveedor no encontrado",
        };
    }
  };
  
  export const remove = async ({ db, params }: IProveedores) => {
    try {
      await db.proveedores.delete({ where: { id: params.id } });
  
      return {
        status: true,
        msj: "Proveedor eliminado correctamente",
      };
    } catch (error: any) {
      if (error.code === "P2025")
        return {
          status: false,
          msj: "Proveedor no encontrado",
        };
    }
  };
  