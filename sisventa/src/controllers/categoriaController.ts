interface ICategorias {
    db: any;
    body: {
      nombre: string;
      descripcion: string;
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
  }: ICategorias) => {
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
  
    const categorias = await db.categorias.findMany({
      skip: (parseInt(page) - 1) * parseInt(pageSize),
      take: parseInt(pageSize),
      where,
    });
  
    const count = parseInt(await db.categorias.count({where}));
  
    return {
      status: true,
      all: {
        data: categorias,
        count,
        pages: Math.ceil(count / parseInt(pageSize)),
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      },
    };
  };
  export const find = async ({ params, db }: ICategorias) => {
    const categorias = await db.categorias.findUnique({ where: { id: params.id } });
    if (!categorias)
      return {
        status: false,
        msj: "Categoría no encontrada",
      };
  
    return {
      status: true,
      find: categorias,
    };
  };

  export const save = async ({ db, body }: ICategorias) => {
    const categorias = await db.categorias.create({
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion,
      },
    });
  
    if (!categorias)
      return {
        status: false,
        msj: "Ha ocurrido un error",
      };
  
    return {
      status: true,
      msj: "Categoria creada exitosamente",
      categorias,
    };
  };
  export const update = async ({ db, body, params }: ICategorias) => {
    try {
      const categorias = await db.categorias.update({
        where: {
          id: params.id,
        },
        data: {
          nombre: body.nombre,
          descripcion: body.descripcion
        },
      });
  
      return {
        status: true,
        msj: "Categoria actualizada correctamente",
      };
    } catch (error: any) {
      if (error.code === "P2025")
        return {
          status: false,
          msj: "Categoria no encontrada",
        };
    }
  };
  
  export const remove = async ({ db, params }: ICategorias) => {
    try {
      await db.categorias.delete({ where: { id: params.id } });
  
      return {
        status: true,
        msj: "Categoria eliminada correctamente",
      };
    } catch (error: any) {
      if (error.code === "P2025")
        return {
          status: false,
          msj: "Proveedor no encontrado",
        };
    }
  };
  