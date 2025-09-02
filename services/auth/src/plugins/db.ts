import { FastifyPluginAsync } from 'fastify';
import mongoose from 'mongoose';
import { env } from '../env';

const dbConnector: FastifyPluginAsync = async (fastify) => {
    try {
        // only in schema fields applied on mongodb
        mongoose.set('strictQuery', true)

        // connect mongodb
        await mongoose.connect(env.MONGODB_URL)
        console.log("database connected")

        // disconnect database when server turning off
        fastify.addHook('onClose', async () => {
            await mongoose.disconnect();
        })
    }
    catch (error) {
        console.error(error)
    }

}

export default dbConnector