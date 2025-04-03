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
            // declaramos el listado de errores inicialmente vacío
            let erroresSale = [];
            // ANTES DE REGISTRAR LA VENTA DEBEMOS VERIFICAR EL STOCK DE CADA PRODUCTO.
            for (const prodDetalle of detalle) {
                let idProd = prodDetalle.product;
                // MODIFICAR ESTA LÍNEA.
                let cantidadDetalle = parseInt(prodDetalle.cantidad);
                console.log(cantidadDetalle);
                const producto = await productModel.findById(idProd);
                if (cantidadDetalle > producto.stock) {
                    erroresSale.push({ message: `Error: stock superado para el producto ${producto.titulo}. Stock disponible: ${producto.stock} `, producto })
                    /*return res.status(400).json({ message: `Error: stock superado para el producto ${producto.titulo} - stock disponible: ${producto.stock} `, producto })*/
                } else if (!producto.activo) {
                    erroresSale.push({ message: `Error: El producto ${producto.titulo} ya no se encuentra disponible, por favor quitelo de su carrito.`, producto })
                }
            }
            // verifico si hubo algun error con los stocks de los productos
            if (erroresSale.length > 0) return res.status(400).json(erroresSale);

            /*
            DESCONTAR EL STOCK DE CADA PRODUCTO EN LA BASE DE DATOS, CUANDO DE REALICE LA VENTA.
                        */
            const nuevaVenta = new Sale({
                total,
                id_comprador: idUsuario,
                detalle,
            })
            const ventaGuardada = await nuevaVenta.save();
            // DESCONTAR STOCK DE CADA PRODUCTO EN LA BASE DE DATOS
            for (const prodDetalle of detalle) {
                // BUSCO EL PRODUCTO DEL DETALLE DENTRO DE LA BASE DATOS Y ACTUALIZO SU STOCK.
                const idProd = prodDetalle.product;
                const prodEncontrado = await productModel.findById(idProd);
                prodEncontrado.stock = prodEncontrado.stock - parseInt(prodDetalle.cantidad);
                await prodEncontrado.save();
            }


            res.status(200).json(ventaGuardada)
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
            const ventasCliente = await Sale.find({ id_comprador: idUsuario }).sort({ 'fecha_venta': -1 })
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

