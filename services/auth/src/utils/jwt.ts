import jwt from 'jsonwebtoken';
import { env } from "../env"
import { ServerError } from './response';

interface ITokenPayload {
    user_id: string
    email: string
    type: 'access' | 'refresh'
}
export const generateJWT = (user_id: string, email: string) => {
    const accessPayload: ITokenPayload = {
        user_id,
        email,
        type: 'access'
    }
    const refreshPayload: ITokenPayload = {
        user_id,
        email,
        type: 'refresh'
    }
    const accessToken = jwt.sign(accessPayload, env.JWT_SECRET, { expiresIn: '1h' })
    const refreshToken = jwt.sign(refreshPayload, env.JWT_SECRET, { expiresIn: '7d' })
    return { accessToken, refreshToken }
}


export const verifyJWT = (token: string, type: 'access' | 'refresh') => {
    try {
        const secret = type === 'access' ? env.JWT_SECRET : env.JWT_SECRET
        const payload = jwt.verify(token, secret) as ITokenPayload
        return payload
    } 
    catch (error) {
        throw new ServerError(401, 'Invalid or expired token')
    }
}
