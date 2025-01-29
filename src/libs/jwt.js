import jwt from "jsonwebtoken";

export function crearTokenDeAcceso(data) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            data,
            'APP_ECOMMERCE',
            { expiresIn: "1d" },
            (err, token) => {
                if (err) reject(err)
                resolve(token)
            })
    })
}