import { z } from "zod";
import { emailSchema, passwordSchema } from "./generalSchemas";

// register schemas 
export const registerSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    confirmpassword: passwordSchema,
    name: z.string().min(4).max(64).optional(),
    redirecturl: z.string().url().optional()
})

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    redirecturl: z.string().url().optional()
})


// types
export type RegisterBody = z.infer<typeof registerSchema>
export type loginBody = z.infer<typeof loginSchema>