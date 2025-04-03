import mongoose from "mongoose";


const stockSchema = new mongoose.Schema({
    fecha_modificacion: {
        type: Date,
        required: true,
        default: Date.now
    },
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    valor_previo: {
        type: Number,
        required: true
    },
    valor_actual: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        trim:true
    }
},
    {
        timestamps: true
    })

export default mongoose.model('Stock', stockSchema)