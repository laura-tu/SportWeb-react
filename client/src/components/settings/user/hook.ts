import { z } from 'zod';

export const useFormValidation = () => {
  const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    changedPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .optional(),
    changedPasswordConfirm: z.string().optional(),
  }).refine(data => data.changedPassword === data.changedPasswordConfirm, {
    message: 'Passwords do not match',
    path: ['changedPasswordConfirm'], // Specify the error path
  });

  const validate = (data: any) => {
    try {
      schema.parse(data);
      return { valid: true, errors: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0] as string] = curr.message;
          return acc;
        }, {} as Record<string, string>);
        return { valid: false, errors };
      }
      throw error;
    }
  };

  return { validate };
};
