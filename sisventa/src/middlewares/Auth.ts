import { verifyToken } from "../helpers/Token";

const Auth = ({cookie:{token},store}:any) =>verifyToken(token.value,store);


export default Auth;