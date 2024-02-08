
import bcrypt from 'bcryptjs';
export const makePasswd = async(passwd:string) => {
    const salt = await bcrypt.genSaltSync(10);
    return await bcrypt.hashSync(passwd,salt);
}



export const comparePasswd = async(passwd:string,hash:string) =>{
    return await bcrypt.compareSync(passwd,hash)
}