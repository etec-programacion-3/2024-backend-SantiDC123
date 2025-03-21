import Product from "../models/product.model.js";


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
            console.log('Producto creado');
            
            const productoGuardado = await nuevoProducto.save();
            console.log(productoGuardado);
            
            res.status(200).json(productoGuardado)
        } catch (error) {
            console.log(error);
        }

    }

}


export const listarProductos = async (req, res) => {
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