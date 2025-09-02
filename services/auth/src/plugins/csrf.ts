import fastifyPlugin from "fastify-plugin";
import { randomToken } from '../utils/crypto';
import {env} from '../env';
import { FastifyInstance, FastifyPluginOptions } from "fastify";


const csrfToken = fastifyPlugin(async (fastify: FastifyInstance, opts:FastifyPluginOptions) => {
    fastify.addHook('preHandler', async (request , reply) => {
        // check method is not GET for check csrf token
        const isStateChanging = ['POST','PUT','PATCH','DELETE'].includes(request.method);
        if (!isStateChanging) return;
    
        const csrfHeader = request.headers['x-csrf-token'];
        const csrfCookie = request.cookies['csrf'];

        if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
            return reply.code(403).send({ error: 'Invalid CSRF token' });
        }

    })

    fastify.route( {
        method: 'GET',
        url: '/api/csrf',
        schema: {
          tags: ['Security'],
          summary: 'Get CSRF token',
          description: 'Get CSRF token',
          response: {
            200: {
              type: 'object',
              properties: {
                token: { type: 'string' },
                status: { type: 'number' },
                message: { type: 'string' }
              }
            }
          }
        },
        handler: async (request, reply) => {
            const token = randomToken(32);
            reply.setCookie('csrf', token , {
                httpOnly: true,   // JavaScript cannot access
                sameSite: 'lax',  // Basic CSRF protection
                secure: env.SECURE, // http: false , https: true
                path: "/"
            })
            reply.code(200).send({token: token, status: 1 , message: "success"})
        }
    })
});

export default csrfToken;