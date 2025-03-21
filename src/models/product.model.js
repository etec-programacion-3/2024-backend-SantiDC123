import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    precio: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    categoria: {
        type: String,
        required: true,
        trim: true
    },
    portada: {
        type: String,
        required: true,
        trim: true
    }
    
},
    {
        timestamps: true
    })

export default mongoose.model('Product', productSchema)