import { Router } from "express";
import { crearProducto, listarDetalleProducto, listarProductos } from "../controllers/product.controller.js";
import multer from 'multer';
// multer config
const storage = multer.diskStorage({
    destination: './src/public/uploads',
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({ storage })

const router = Router();

router.post('/product/new',upload.single('portada'), crearProducto)

router.get('/product', listarProductos)
router.get('/product/detail/:id', listarDetalleProducto)

export default router;