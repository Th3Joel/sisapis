const Validation = (app:Object, schema:any) => {
  try {
    schema.parse(app);
  } catch (err:any) {
    return err.errors;
  }
};

export default Validation;
