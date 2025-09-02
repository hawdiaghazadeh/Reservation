import { buildApp } from "./app";
import { env } from "./env";

const app = buildApp();
app.listen({
    port: env.PORT,
    host: env.HOST
}).catch((error) => {
    // write error on app logger => default app loger is pino
    app.log.error(error)
    process.exit(1)
})
