import fastifyCookie from "@fastify/cookie";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import { FastifyPluginOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { env } from "../env";
import fastifyCors from "@fastify/cors";


const security = fastifyPlugin( async (fastify, opts:FastifyPluginOptions) => {
    // register helmet for security headers
    fastify.register(fastifyHelmet, {contentSecurityPolicy: false})
    // set rate limit for ddos attacks security
    fastify.register(fastifyRateLimit, { max: 120, timeWindow: '1 minute', hook: 'onRequest' })
    fastify.register(fastifyCookie, {secret: env.CSRF_SECRET, hook: 'onRequest'})
    fastify.register(fastifyCors , {
        origin: [env.WEB_ORIGIN],
        credentials: true,
        methods: ['GET','POST','PUT','PATCH', 'DELETE']
    })
})

export default security;