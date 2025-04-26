'use client'

import { useMutation } from '@tanstack/react-query'
import { passwordFormSchema, useSchema } from '../schemas/passwordSchema'
import { z } from 'zod'
import { UserPasswordData, updateUserPassword } from '@/services/user'

type PasswordMutationData = {
  data: UserPasswordData
  id: string
}

export const usePasswordMutation = () => {
  return useMutation({
    // mutationFn: (user: PasswordMutationData) => updatePassword(user.id, user.data),
    mutationFn: (user: PasswordMutationData) => updateUserPassword(user.id, user.data),
    mutationKey: ['update_user_password'],
  })
}

export function useUpdatePasswordForm(userId: string) {
  const { form } = useSchema(passwordFormSchema, {
    password: '',
    confirmPassword: '',
  })

  const { mutate, data, isPending, isError, error, isSuccess } = usePasswordMutation()

  const onSubmit = (values: z.infer<typeof passwordFormSchema>) =>
    mutate({ data: { password: values.password }, id: userId })

  return {
    form,
    onSubmit,
    data,
    isError,
    isSuccess,
    isPending,
    error,
  }
}
