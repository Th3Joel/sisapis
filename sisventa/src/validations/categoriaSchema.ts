import * as yup from "yup";

import { prisma as db } from "../config/database";

export const CategoriaSchema = (id: string) =>
  yup.object({
    nombre: yup
      .string()
      .max(50, "Debe ser menor a 50 caracteres")
      .trim()
      .required("Campo requerido")
     .test("is-repeat","Este nombre ya existe",(d) => repeat(d, id)),
    descripcion: yup.string().max(200,"Debe de ser menor a 200 caracteres").trim(),
  });

async function repeat(nombre: string | undefined, id: string) {
  
  const categoria = await db.categorias.findFirst({
    where: {
      nombre,
      NOT: {
        id: {
          equals: id,
        },
      },
    },
  });

  return !categoria;
}
