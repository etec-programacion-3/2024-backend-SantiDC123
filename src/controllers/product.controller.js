import { TOKEN_SECRET } from "../config.js";
import Product from "../models/product.model.js";
import Sale from "../models/sale.model.js";
import Stock from "../models/stock.model.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const crearProducto = async (req, res) => {
    const { titulo, descripcion, precio, stock, categoria } = req.body;
    const portada = req.file?.filename || '';
    //console.log(portada);

    if (!titulo || !descripcion || !precio || !stock || !categoria || !portada) {
        res.status(400).json({ message: 'Error: todos los campos deben ser completados.' })
    } else {

        try {
            const nuevoProducto = new Product({
                titulo,
                descripcion,
                precio,
                stock,
                categoria,
                portada
            })

            const productoGuardado = await nuevoProducto.save();

            res.status(200).json(productoGuardado)
        } catch (error) {
            console.log(error);
        }

    }

}


export const modificarProducto = async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, precio, stock, categoria } = req.body;
    let { portada } = req.body;
    const nuevaPortada = req.file?.filename || false;

    if (nuevaPortada) {
        portada = nuevaPortada;
    }

    if (!titulo || !descripcion || !categoria || !portada) {
        res.status(400).json({ message: 'Error: todos los campos deben ser completados.' })
    } else if (precio < 0 || stock < 0) {
        res.status(400).json({ message: 'Error: el stock y/o precio debe ser mayor igual a 0.' })

    }
    else {

        try {
            const productoModificado = {
                titulo,
                descripcion,
                precio: parseFloat(precio),
                stock: parseInt(stock),
                categoria,
                portada
            }

            const producto = await Product.findById(id)
            if (!producto) return res.status(404).json({ message: 'No se ha encontrado el producto' });

            if (producto.stock != productoModificado.stock) {
                const { token } = req.cookies;

                if (!token) return res.status(401).json({ message: "Usuario no logeado." })

                jwt.verify(token, TOKEN_SECRET, async (err, user) => {

                    if (err) return res.status(401).json({ message: "Token no válido." })

                    const userFound = await User.findById(user.id);
                    if (!userFound) return res.status(401).json({ message: "Usuario no encontrado en la BD." })

                    const nuevoHistorialStock = new Stock({
                        id_usuario: userFound.id,
                        producto: producto.id,
                        valor_previo: producto.stock,
                        valor_actual: productoModificado.stock,
                        descripcion: 'Stock modificado desde el panel de administración.'
                    })
                    const historialGuardado = await nuevoHistorialStock.save();
                    console.log(historialGuardado);

                })


            }

            const productoActualizado = await Product.findByIdAndUpdate(id, productoModificado, { new: true });
            if (!productoActualizado) return res.status(404).json({ message: 'No se ha encontrado el producto' });
            res.status(200).json(productoActualizado)

        } catch (error) {
            console.log(error);
        }

    }

}


export const listarProductos = async (req, res) => {
    try {
        const listadoProductos = await Product.find({ activo: { $ne: false } });
        res.json(listadoProductos)
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al intentar acceder al listado de productos." })
    }
}
export const listarProductosAdmin = async (req, res) => {
    try {
        const listadoProductos = await Product.find();
        res.json(listadoProductos)
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al intentar acceder al listado de productos." })
    }
}


export const listarDetalleProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await Product.findById(id);
        res.json(producto)
    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al intentar acceder al detalle del producto." })
    }
}

export const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    try {
        // verificar si el producto ya está asociado a una venta.
        const productosProcesados = await Sale.find({ 'detalle.product': id })
        if (productosProcesados.length > 0) return res.status(400).json({ message: "El producto que intenta eliminar ya está asociado a una venta." })

        const producto = await Product.findById(id)
        if (!producto) return res.status(404).json({ message: 'No se ha encontrado el producto' });
        const productoEliminado = await Product.findByIdAndDelete(id);
        res.sendStatus(204);

    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al eliminar el producto." })

    }

}

export const modificarEstadoActivo = async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await Product.findById(id)
        if (!producto) return res.status(404).json({ message: 'No se ha encontrado el producto' });

        const productoActualizado = await Product.findByIdAndUpdate(id, { activo: !producto.activo }, { new: true });
        res.status(200).json(productoActualizado)

    } catch (error) {
        return res.status(500).json({ message: "Ha ocurrido un error al cambiar el estado del producto." })

    }
}