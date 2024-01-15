import Veterinario from "../models/Veterinario.js"
import sendMailToUser from "../config/nodemailer.js"

//metodo para el login
const login = async(req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const veterinarioBDD = await Veterinario.findOne({email}).select("-status -__v -token -updatedAt -createdAt")
    if(veterinarioBDD?.confirmEmail===false) return res.status(403).json({msg:"Lo sentimos, debe verificar su cuenta"})
    if(!veterinarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const verificarPassword = await veterinarioBDD.matchPassword(password)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})
    const {nombre,apellido,direccion,telefono,_id} = veterinarioBDD
    res.status(200).json({
        nombre,
        apellido,
        direccion,
        telefono,
        _id,
        email:veterinarioBDD.email
    })
}
  
//metodo para mostrar el perfil
const perfil=(req,res)=>{
    res.status(200).json({res:'perfil del veterinario'})
}
//Metodo para registro

const registro = async (req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const verificarEmailBDD = await Veterinario.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    const nuevoVeterinario = new Veterinario(req.body)
    nuevoVeterinario.password = await nuevoVeterinario.encrypPassword(password)

    const token = nuevoVeterinario.crearToken()
    await sendMailToUser(email,token)
    await nuevoVeterinario.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
}

//metodo para confirmar token
const confirmEmail = async (req,res)=>{
    if(!(req.params.token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    const veterinarioBDD = await Veterinario.findOne({token:req.params.token})
    if(!veterinarioBDD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})
    veterinarioBDD.token = null
    veterinarioBDD.confirmEmail=true
    await veterinarioBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"}) 
}

// metodo par alistar veterinarios
const listarVeterinarios = (req,res)=>{
    res.status(200).json({res:'lista de veterinarios registrados'})
}

//metodo para mostrar detalle de un veterinario en particular 
const detalleVeterinario = (req,res)=>{
    res.status(200).json({res:'detalle de un eterinario registrado'})
}
// metood para actualizar el perfil 
const actualizarPerfil = (req,res)=>{
    res.status(200).json({res:'actualizar perfil de un veterinario registrado'})
}
//Metodo para actualizar password
const actualizarPassword = (req,res)=>{
    res.status(200).json({res:'actualizar password de un veterinario registrado'})
}
//metodo para recuperar password
const recuperarPassword= (req,res)=>{
    res.status(200).json({res:'enviar mail recuperación'})
}
//metodo para comprobar el token
const comprobarTokenPasword= (req,res)=>{
    res.status(200).json({res:'verificar token mail'})
}
//metodo para crear nuevo password
const nuevoPassword= (req,res)=>{
    res.status(200).json({res:'crear nuevo password'})
}

export {
    login,
    perfil,
    registro,
    confirmEmail,
    listarVeterinarios,
    detalleVeterinario,
    actualizarPerfil,
    actualizarPassword,
	recuperarPassword,
    comprobarTokenPasword,
	nuevoPassword
}