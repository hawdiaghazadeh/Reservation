
import { FastifyReply } from 'fastify';

export const sendError = (
    reply: FastifyReply,
    message = "internal server error",
    code = 400, 
    error?: any,
    status = 0
) => {
    console.log("send Error: ",message , code, error, status)

    return reply.status(code).send({
        status,
        message,
        error
    })   
}

export class ServerError {
    message: string;
    status: number;

    constructor(status: number, message: string) {
        this.message = message;
        this.status = status
    }
}