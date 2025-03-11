import Sale from "../models/sale.model.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import User from "../models/user.model.js";
import productModel from "../models/product.model.js";

export const registrarVenta = async (req, res) => {

    const { total, detalle } = req.body;
    // ID USUARIO, TOTAL, DETALLE DE VENTA.
    // ACCEDER AL ID DEL USUARIO LOGEADO
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "Usuario no logeado." })
    jwt.verify(token, TOKEN_SECRET, async (err, user) => {

        if (err) return res.status(401).json({ message: "Token no válido." })

        const userFound = await User.findById(user.id);
        if (!userFound) return res.status(401).json({ message: "Usuario no encontrado en la BD." })

        const idUsuario = user.id;

        // REGISTRAR LA VENTA

        try {
           
            // ANTES DE REGISTRAR LA VENTA DEBEMOS VERIFICAR EL STOCK DE CADA PRODUCTO.
            for (const prodDetalle of detalle) {
                let idProd = prodDetalle.product;
                // MODIFICAR ESTA LÍNEA.
                let cantidadDetalle = parseInt(prodDetalle.cantidad) + 1;
                console.log(cantidadDetalle);
                const producto = await productModel.findById(idProd);
                if (cantidadDetalle > producto.stock) {
                    return res.status(400).json({ message: `Error: stock superado para el producto ${producto.titulo} `, producto })
                }
            }
            
            /*
            DESCONTAR EL STOCK DE CADA PRODUCTO EN LA BASE DE DATOS, CUANDO DE REALICE LA VENTA.
                        const nuevaVenta = new Sale({
                            total,
                            id_comprador: idUsuario,
                            detalle,
                        })
                        const ventaGuardada = await nuevaVenta.save(); */
            res.status(200).json({ message: 'Venta Procesada!' })
        } catch (error) {
            console.log(error.message);
        }

    })
}


export const listarVentasCliente = async (req, res) => {
    // ACCEDER AL ID DEL USUARIO LOGEADO
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "Usuario no logeado." })
    jwt.verify(token, TOKEN_SECRET, async (err, user) => {

        if (err) return res.status(401).json({ message: "Token no válido." })

        const userFound = await User.findById(user.id);
        if (!userFound) return res.status(401).json({ message: "Usuario no encontrado en la BD." })

        const idUsuario = user.id;

        // REGISTRAR LA VENTA

        try {
            const ventasCliente = await Sale.find({ id_comprador: idUsuario })
            res.status(200).json(ventasCliente);
        } catch (error) {
            console.log(error.message);
        }

    })
}

export const listarDetalleVenta = async (req, res) => {
    // ACCEDER AL ID DEL USUARIO LOGEADO
    const idVenta = req.params.id;
    // BUSCAR LA VENTA
    console.log(idVenta);


    try {
        const venta = await Sale.findById(idVenta).populate({
            path: 'detalle.product',
            model: productModel
        });
        if (!venta) return res.status(400).json({ message: "No se ha encontrado la venta especificada." })
        res.status(200).json(venta.detalle);
    } catch (error) {
        console.log(error.message);
    }


}
