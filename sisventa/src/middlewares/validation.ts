
const Validation = (app:any,schema: any) => {  
      try {
        schema[0].parse(app.body);
      } catch (err: any) {
       
        return err.errors;
      } 
};

export default Validation;
