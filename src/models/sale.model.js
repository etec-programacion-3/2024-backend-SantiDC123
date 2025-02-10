import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    fecha_venta: {
        type: Date,
        required: true,
        default: Date.now
    },
    total: {
        type: Number,
        required: true
    },
    id_comprador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    detalle: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            cantidad: {
                type: Number
            }
        }
    ]

},
    {
        timestamps: true
    })

export default mongoose.model('Sale', productSchema)