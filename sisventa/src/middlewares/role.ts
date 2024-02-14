interface IRole {
  store: {
    user: {
      role: string;
    };
  };
}
const Role = ({store:{user}}:IRole,role:string[]) => {

      if (!role.find((x) => x === user.role) && user.role !== "admin") {
        return {
          status: false,
          msj: "No tiene permisos para este recurso",
        };
      }
    }
export default Role;
