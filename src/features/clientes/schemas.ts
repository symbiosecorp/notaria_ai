import { z } from 'zod'

export const clienteSchema = z.object({
  id: z.string(),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('El email no es válido'),
  telefono: z.string(),
  curp: z.string().optional(),
  rfc: z.string().optional(),
  domicilio: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
})

export const clienteInputSchema = clienteSchema.omit({ id: true, createdAt: true })

export type Cliente = z.infer<typeof clienteSchema>
export type ClienteInput = z.infer<typeof clienteInputSchema>
