 import {z} from 'zod'

 export const ClienteSchema = z.object({
    nombre:z.string().max(15).trim(),
    apellido:z.string().max(15).trim(),
    celular:z.string().max(15).trim(),
    correo:z.string().email().trim(),
    direccion:z.string().max(50).trim()
 });