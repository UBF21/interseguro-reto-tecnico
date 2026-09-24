import { z } from 'zod'

// Espejo exacto de LoginCommandValidator.cs (api-auth) -- mismo largo mínimo/máximo en
// ambos lados. Si cambia una regla ahí, cambia acá también.
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es obligatorio.')
    .max(254, 'El correo es demasiado largo.')
    .email('Ingresá un correo válido.'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria.')
    .min(8, 'La contraseña debe tener al menos 8 caracteres.')
    .max(72, 'La contraseña no puede superar los 72 caracteres.'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
