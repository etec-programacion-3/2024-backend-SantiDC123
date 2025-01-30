import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    rol: {
        type: String,
        required: true,
        trim: true
    },
    cart: [
        {
            producto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Producto"
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

export default mongoose.model('User', userSchema)