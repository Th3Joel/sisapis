import * as yup from "yup";

import { prisma as db } from "../config/database";

export const ClienteSchema = (id: string) =>
  yup.object({
    nombre: yup
      .string()
      .max(10, "Debe ser menor a 10 caracteres")
      .trim()
      .required("Campo requerido")
     .test("is-repeat","Este nombre ya existe",(d) => repeat(d, id)),
    apellido: yup.string().max(15).trim(),
    celular: yup
      .string()
      .trim()
      .max(15)
      .matches(/^$|^[0-9]+$/, "Debe ser numerico"),
    correo: yup.string().email("Correo invalido").trim(),
    direccion: yup.string().max(50).trim(),
  });

async function repeat(nombre: string | undefined, id: string) {
  
  const clientes = await db.cliente.findFirst({
    where: {
      nombre,
      NOT: {
        id: {
          equals: id,
        },
      },
    },
  });

  return !clientes;
}
