import { TOKEN_SECRET } from "../config.js";
import { crearTokenDeAcceso } from "../libs/jwt.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registrarUsuario = async (req, res) => {

    const { nombre, email, password, passwordConfirm } = req.body;

    if (nombre == '' || email == '' || password == '') {
        res.status(400).json({ message: 'Error: todos los campos deben ser completados.' })
    } else if (password != passwordConfirm) {
        res.status(400).json({ message: 'Error: las contraseñas debe coincidir' })
    } else {

        try {

            const usuarioExistente = await User.findOne({ email: email })
            if (usuarioExistente) return res.status(400).json({ message: "El email ingresado ya está registrado." })

            const hashPassword = await bcrypt.hash(password, 10)
            const nuevoUsuario = new User({
                nombre,
                email,
                password: hashPassword,
                rol: "cliente",
                carrito: []
            })

            const usuarioGuardado = await nuevoUsuario.save();

            const token = crearTokenDeAcceso({ id: usuarioGuardado._id, nombre: usuarioGuardado.nombre })
            res.cookie('token', token)

            res.json({ message: 'usuario Registrado!', usuario: usuarioGuardado })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }


    }

}

export const loginUsuario = async (req, res) => {
    const { email, password } = req.body;
    if (email == '' || password == '') {
        res.status(400).json({ message: 'Error: todos los campos deben ser completados.' })
    } else {
        try {
            // proceso de login.
            const usuarioEncontrado = await User.findOne({ email });

            if (!usuarioEncontrado) return res.status(400).json({ message: "El correo ingresado es incorrecto." })

            const passValida = await bcrypt.compare(password, usuarioEncontrado.password);
            if (!passValida) return res.status(400).json({ message: "La contraseña es incorrecta." })

            // logeo exitoso
            const token = await crearTokenDeAcceso({id:usuarioEncontrado._id,nombre: usuarioEncontrado.nombre})
           
            res.cookie('token', token)

            res.json({
                id: usuarioEncontrado._id,
                nombre: usuarioEncontrado.nombre,
                email: usuarioEncontrado.email,
                carrito: usuarioEncontrado.carrito
            })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }


}

export const cerrarSesionUsuario = async (req, res) => {
    res.clearCookie('token');
    return res.sendStatus(200)
}

export const verificarToken = (req, res) => {
    const { token } = req.cookies;
    
    if (!token) return res.status(401).json({ message: "Usuario no logeado." })
        
    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        
        if (err) return res.status(401).json({ message: "Token no válido." })
            
        const userFound = await User.findById(user.id);
        if (!userFound) return res.status(401).json({ message: "Usuario no encontrado en la BD." })

        return res.json({ id: userFound.id, nombre: userFound.nombre, cart: userFound.cart })
    })
}