import * as yup from "yup"

export const LoginSchema =()=> yup.object({
    
        email:yup.string().required("Campo requerido").email("Correo inválido"),
        password:yup.string().required("Campo requerido")
   
});