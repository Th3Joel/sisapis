import jwt from 'jsonwebtoken';


export const makeToken = (data:object) =>{
    const token = jwt.sign(
        data,
        process.env.TOKEN_KEY as string,
        {
          expiresIn: "20d"
        }
      );
      return token;
}



export const verifyToken = (tok:string,store:any) =>{
    try {
        const decode:any = jwt.verify(tok,process.env.TOKEN_KEY as string);
        //Almacenar el id del usuario en la respuesta
        store.user = {
            id:decode.id
        }
    } catch (error:any) {
        return error.message
    }
}