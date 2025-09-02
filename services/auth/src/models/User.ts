import { Schema, model, InferSchemaType } from "mongoose";

const userSchema = new Schema({
    email : { 
        type: String, 
        unique: true, 
        index: true, 
        required: true, 
        lowercase: true, 
        trim: true,
    },
    emailVerifiedAt: { type: Date },
    password: { type: String },
    name: { type: String },
    photo: { type: String },
    providers: [{ provider: String, providerId: String }],
    totp: {
        secret: { type: String },
        enabled: { type: Boolean, default: false },
        backupCodes: { type: [String], default: [] }
    }
}, {
    timestamps: true
})

export type User = InferSchemaType<typeof userSchema> & {_id: string}
export const User = model<User>('User', userSchema)