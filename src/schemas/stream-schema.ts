import { z } from "zod";

export const streamSchema = z.object({
    name: z.string().min(1, 'Name is required'),
  })

export type StreamSchema = z.infer<typeof streamSchema>;