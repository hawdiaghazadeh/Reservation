import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import dbConnector from "./plugins/db"; 
import security from "./plugins/security";
import swagger from "./plugins/swagger";
import csrfToken from "./plugins/csrf";
import authRoutes from "./routes/authRoutes";
import { env } from "./env";
import fastifyFormbody from "@fastify/formbody";
import fastifyMultipart from "@fastify/multipart";
import { ServerError, sendError } from "./utils/response";
import z from "zod";

export const buildApp = () =>{
    // init app 
    const app = Fastify({
        logger: {
            level: env.NODE_ENV === 'production' ? 'info' : 'debug',
            redact: ['req.headers.authorization', 'req.headers.cookie', 'password', 'token', 'refreshToken'],
        }
    });

    // register swagger after routes
    app.register(swagger)

    // error handling
    app.setErrorHandler((error: any, request: FastifyRequest, reply: FastifyReply) => {
        // zod errors
        if (error instanceof z.ZodError) {
            return sendError(
                reply,
                "Validation Error",
                400,
                error.issues.map((e: any) => ({
                    field: Array.isArray(e.path) ? e.path.join('.') : String(e.path),
                    issue: e.message
                }))
            );            
        }
        // server errors
        if (error instanceof ServerError) {
            return sendError(
                reply,
                error.message,
                error.status,
                null 
            );
        }
        // other errors
        const statusCode = error.statusCode || error.status || 500;
        const message = statusCode === 500 ? "Internal server error" : error.message;
        sendError(
            reply,
            message,
            statusCode,
            env.NODE_ENV === 'development' ? error : null
        );
    });
    // register data transport forms
    app.register(fastifyFormbody)
    app.register(fastifyMultipart, {
        attachFieldsToBody: true
    })
    
    // register database
    app.register(dbConnector);

    // register security plugins 
    app.register(security);
    app.register(csrfToken)    

    // register routes
    app.register(authRoutes)
    
    
    
    
    return app;
}
