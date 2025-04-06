import { z } from 'zod'

export const useFormValidation = () => {
  const schema = z.object({
    name: z.string().min(1, 'Meno je povinné'),
    email: z.string().email('Nesprávny formát emailu'),
  })

  const validate = (data: any) => {
    try {
      schema.parse(data)
      return { valid: true, errors: null }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.reduce(
          (acc, curr) => {
            acc[curr.path[0] as string] = curr.message
            return acc
          },
          {} as Record<string, string>,
        )
        return { valid: false, errors }
      }
      throw error
    }
  }

  return { validate }
}
