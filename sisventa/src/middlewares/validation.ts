const Validation = async (app: any, schema: any) => {
  const method = app.request.method;

  //Si existe un el id de parametro valida y sigue
  //cuando no hay parametro y la peticion es put (actualizar)
  //se valida
  //con el id del usuario logueado del token
  //Ej cuando se quiere actualizar el propio usuario
  const id = app.params?.id
    ? app.params.id
    : method === "PUT"
    ? app.store.user.id
    : undefined;
  try {
    //paso id para validacion opcional
    await schema[0](id).validate(app.body, { abortEarly: false });
  } catch (err: any) {
    var val: any = {};
    err.inner.map((x: any) => {
      val[x.path] = x.message;
    });
    return {
      status: false,
      errors: val,
    };
  }
};

export default Validation;
