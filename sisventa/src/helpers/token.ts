import jwt from "jsonwebtoken";

interface TokenData {
  id: string;
  role:string;
}
//De ultimo se pone string para que retorne un string -> expiresIn:string):string
export const makeToken = (data: TokenData, expiresIn: string): string => {
  const token = jwt.sign(data, process.env.TOKEN_KEY as string, {
    expiresIn,
  });
  return token;
};

export const verifyToken = async (token: string, db: any, option: boolean)=> {
  try {
    if (option) {
      const f = await db.token.findFirst({
        where: {
          token,
        },
      });
      if (!f) return false;
    }
    return jwt.verify(token, process.env.TOKEN_KEY as string);
  } catch (error: any) {
    console.log(error);
    return false;
  }
};
