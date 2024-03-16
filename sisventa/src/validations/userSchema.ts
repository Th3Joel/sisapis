import * as yup from "yup";
import { prisma as db } from "../config/database";

export const CreateSchema = (id: string) =>
  yup.object().shape({
    name: yup.string().max(50).required("Campo requerido"),
    email: yup
      .string()
      .email("Correo inválido")
      .required("Campo requerido")
      .test("is-repeat", "Este correo ya existe", (d) => repeat(d, id)),
    password: yup.string().min(4).required("Campo requerido"),
    role: yup
      .string()
      .required("Campo requerido")
      .oneOf(["admin", "vendedor", "bodega"], "Rol inválido"),
    imgFile: yup
      .mixed()
      .test("false","Tipo de imagen invalido ",(value:any)=>{
        
        return ["image/png","image/jpeg","image/jpg","image/webp",""].includes(value.type)
        
      })
      .test("false","Imagen supera los 10MB",(value:any)=>{
        return value.size <= 10 * 1024 * 1024;
      })
      
  });

export const UpdatePassSchema = yup.object({
  old: yup.string(),
  confirm: yup.string().min(4),
  passwd: yup.string().min(4),
});

async function repeat(email: string | undefined, id: string) {
  const users = await db.user.findFirst({
    where: {
      email,
      NOT: {
        id: {
          equals: id,
        },
      },
    },
  });

  return !users;
}
