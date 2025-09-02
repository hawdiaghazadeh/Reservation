import {z} from "zod"

export const emailSchema = z.string().email().max(256)
export const passwordSchema = z.string().min(8).max(128)
