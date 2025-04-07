import Stock from "../models/stock.model.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import productModel from "../models/product.model.js";


export const listarHistorialStock = async (req, res) => {
    try {
        const { token } = req.cookies;

        if (!token) return res.status(401).json({ message: "Usuario no logeado." })

        jwt.verify(token, TOKEN_SECRET, async (err, user) => {

            if (err) return res.status(401).json({ message: "Token no válido." })

            const userFound = await User.findById(user.id);
            if (!userFound) return res.status(401).json({ message: "Usuario no encontrado en la BD." })

            const historialStock = await Stock.find()
                .populate({
                    path: 'producto',
                    model: productModel
                })
                .sort({ 'fecha_modificacion': -1 });
            res.json(historialStock)

        })

    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al intentar acceder al historial de stock." })

    }
}


export const listarHistorialStockPorProducto = async (req, res) => {
    try {
        const { producto } = req.params;
        const { token } = req.cookies;

        if (!token) return res.status(401).json({ message: "Usuario no logeado." })

        jwt.verify(token, TOKEN_SECRET, async (err, user) => {

            if (err) return res.status(401).json({ message: "Token no válido." })

            const userFound = await User.findById(user.id);
            if (!userFound) return res.status(401).json({ message: "Usuario no encontrado en la BD." })

            const historialStock = await Stock.find({ producto }).sort({ 'fecha_modificacion': -1 });
            res.json(historialStock)

        })

    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al intentar acceder al historial de stock." })

    }
}
