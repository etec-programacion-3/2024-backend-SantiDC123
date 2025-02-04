import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export function crearTokenDeAcceso(data) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            data,
            TOKEN_SECRET,
            { expiresIn: "1d" },
            (err, token) => {
                if (err) reject(err)
                resolve(token)
            })
    })
}