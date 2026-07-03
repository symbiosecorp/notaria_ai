import { z } from 'zod'

export const templateSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  status: z.enum(['active', 'inactive']),
  createdAt: z.date(),
})

export const templateInputSchema = templateSchema.omit({ id: true, createdAt: true })

export type Template = z.infer<typeof templateSchema>
export type TemplateInput = z.infer<typeof templateInputSchema>
