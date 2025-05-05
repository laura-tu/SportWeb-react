'use client'

import React, { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Typography } from '@mui/material'
import ErrorModal from '@/components/error-modal'
import SuccessModal from '@/components/success-modal'
import useFetchUser from '../hooks/useFetchUser'
import { updateUserData } from '@/services/user'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import LoadingSpinner from '@/components/loading/loading-spinner'
import { cn } from '@/lib/utils'

interface EmailChangeProps {
  userId: string
  width?: string
}

interface FormData {
  email: string
}

const EmailChange: React.FC<EmailChangeProps> = ({ userId, width }) => {
  const queryClient = useQueryClient()
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)

  const { user: userData, isFetchingUser, userError } = useFetchUser()

  const form = useForm<FormData>({
    defaultValues: { email: userData?.email || '' },
  })

  const { handleSubmit, reset } = form

  useEffect(() => {
    if (userData?.email) {
      reset({ email: userData.email })
    }
  }, [userData, reset])

  const mutation = useMutation({
    mutationKey: ['update_user_email'],
    //mutationFn: (data: FormData) => updateUser(data, userId), //CORS issue
    mutationFn: (data: FormData) => updateUserData(userId, { email: data.email }),
    onSuccess: () => {
      setSuccessModalOpen(true)
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
    },
    onError: () => {
      setErrorModalOpen(true)
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(data)
  }

  if (isFetchingUser) {
    return <LoadingSpinner />
  }

  if (userError) {
    return (
      <Typography color="error" sx={{ mt: 3 }}>
        Nepodarilo sa načítať údaje
      </Typography>
    )
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormControl>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className={cn(width)}>
                <FormLabel>Nový email</FormLabel>
                <Input type="email" placeholder="Zadajte nový email" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </FormControl>

        <Button type="submit" disabled={mutation.isPending} className="w-[10.5rem]">
          {mutation.isPending ? <LoadingSpinner small /> : 'Aktualizovať email'}
        </Button>

        <ErrorModal
          open={errorModalOpen}
          onClose={() => setErrorModalOpen(false)}
          text={mutation.error?.message || 'Nepodarilo sa aktualizovať email.'}
        />

        <SuccessModal
          open={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          text="Email bol úspešne aktualizovaný!"
        />
      </form>
    </FormProvider>
  )
}

export default EmailChange
