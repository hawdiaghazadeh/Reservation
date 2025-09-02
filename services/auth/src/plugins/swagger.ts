import fastifyPlugin from "fastify-plugin";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui"; 
import { FastifyPluginOptions } from "fastify";
import { env } from "../env";


const swagger = fastifyPlugin( async (fastify, opts: FastifyPluginOptions) => {
    await fastify.register(fastifySwagger, {
        openapi: {
            info: {
                title: "Auth Service",
                version: "1.0.0",
                description: "Authentication API"
            },
            servers: [
                {
                  url: `http://${env.HOST}:${env.PORT}`
                }
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer'
                    }
                }
            },
            tags: [
                { name: 'auth', description: 'Authentication endpoints' }
            ]
        }
    })

    await fastify.register(fastifySwaggerUi , {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false
        },
        uiHooks: {
            onRequest: function (request, reply, next) { next() },
            preHandler: function (request, reply, next) { next() }
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
        transformSpecificationClone: true
    })
})

export default swagger;