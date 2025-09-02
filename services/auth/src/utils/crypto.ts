import arggon2 from "argon2";
import * as crypto from "crypto";

export const hashPassword = async (password: string) => {
    return await arggon2.hash(password, {
        type: arggon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 5,
        parallelism: 2
    })
}

export const verifyPassword = async (hash: string, password:string) => {
    return await arggon2.verify(hash, password)
}

export const randomToken = (bytes = 32) => {
    return crypto.randomBytes(bytes).toString('hex')
}

export const sha256Hex = (s: string) => {
    return crypto.createHash('sha256').update(s).digest('hex')
}