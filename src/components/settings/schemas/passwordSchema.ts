import { z, ZodEffects, ZodObject } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export const getPasswordSchema = (
  message: string = 'Heslo musí mať aspoň 8 znakov, 1 veľké písmeno, 1 malé písmeno',
) =>
  z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d]{8,}$/, {
    message,
  })

export const passwordFormSchema = z
  .object({
    password: getPasswordSchema(),
    confirmPassword: getPasswordSchema(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Heslá sa nezhodujú',
    path: ['confirmPassword'],
  })

export function useSchema<
  T extends ZodEffects<ZodObject<any, any, any>> | ZodObject<any, any, any>,
>(schema: T, defaultValues?: any) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  return {
    form,
  }
}
