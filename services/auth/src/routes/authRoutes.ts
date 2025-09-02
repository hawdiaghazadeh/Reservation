import { FastifyInstance, FastifyRegisterOptions, FastifyReply, FastifyRequest } from "fastify";
import { env } from "../env";
import { RegisterBody, loginBody, registerSchema } from "../schemas/authSchemas";
import { login, register } from "../services/authService";

const authRoutes = (
    app: FastifyInstance
) => {

    app.route({
        method: "POST",
        url: "/api/register",
        schema: {
            tags: ['auth'],
            summary: 'Register user',
            description: 'Register a new user. Returns JSON response or redirects if redirecturl is provided.',
            body: {
                type: 'object',
                required: ['email', 'password', 'confirmpassword'],
                properties: {
                    email: {type: 'string'},
                    password: {type: 'string'},
                    confirmpassword: {type: 'string'},
                    name: {type: 'string'},
                    redirecturl: { type: 'string'}
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        status: { type: 'number' },
                        message: { type: 'string' },
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                                email: { type: 'string' },
                                name: { type: 'string' },
                            }
                        }
                    }
                }
            }
        },
        handler: async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const body = request.body as RegisterBody;
                const parsed = registerSchema.parse(body);
                const { email, password, confirmpassword, name , redirecturl} = parsed;
                const { user, accessToken, refreshToken } = await register(email, password, confirmpassword, name);
                
                if (redirecturl) {
                    reply.setCookie(
                        'refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: env.SECURE,
                        sameSite: 'lax',
                        path: '/'
                    })
                    reply.setCookie(
                        'accessToken', accessToken, {
                        httpOnly: true,
                        secure: env.SECURE,
                        sameSite: 'lax',
                        path: '/'
                    })
                    return reply.redirect(redirecturl);
                } else {
                    return reply.status(200).send({
                        status: 1,
                        message: "register successfully",
                        user: {
                            id: user._id,
                            email: user.email,
                            name: user.name
                        }
                    });
                }
                
            } catch (error) {
                reply.send(error)
            }
        }
    })

    app.route({
        method: 'POST',
        url: '/api/login',
        schema: {
            tags: ['auth'],
            summary: 'login api',
            description: 'api that user can signin system with registered infos',
            body: {
                type: 'object',
                required : ['email', 'password'],
                properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                    redirecturl: { type: 'string' }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        status: { type: 'number' },
                        message: { type: 'string' }
                    }
                }
            }
        },
        handler: async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const {email, password, redirecturl} = request.body as loginBody
                const {accessToken, refreshToken} = await login(email, password)
                
                // set accessToken to cookies
                reply.setCookie(
                    'refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: env.SECURE,
                    sameSite: 'lax',
                    path: '/'
                })
                // set refreshToken to cookies
                reply.setCookie(
                    'accessToken', accessToken, {
                    httpOnly: true,
                    secure: env.SECURE,
                    sameSite: 'lax',
                    path: '/'
                })

                if (redirecturl) {
                    return reply.redirect(redirecturl)
                }
                
                return reply.status(200).send({
                    status: 1,
                    messgage: 'login successfully'
                })

            }
            catch (error) {
                reply.send(error)
            }
        }
    })


}
export default authRoutes;