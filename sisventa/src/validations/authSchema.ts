import * as yup from "yup"

export const LoginSchema =()=> yup.object({
    
        email:yup.string().email("Correo inválido"),
        password:yup.string().min(4,"Debe ser mayor a 4 caracteres")
   
});