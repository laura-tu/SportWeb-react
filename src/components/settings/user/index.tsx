'use client'

import React, { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Typography } from '@mui/material'
import ErrorModal from '@/components/error-modal'
import SuccessModal from '@/components/success-modal'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import useFetchUser from '../hooks/useFetchUser'
import { updateUserData } from '@/services/user'
import LoadingSpinner from '@/components/loading/loading-spinner'

interface FormData {
  name: string
  email: string
}

const SettingsUser = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient()
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)

  const { user: userData, isFetchingUser, userError } = useFetchUser()

  const form = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
    },
  })

  const { reset, handleSubmit } = form

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || '',
        email: userData.email || '',
      })
    }
  }, [userData, reset])

  const mutation = useMutation({
    mutationKey: ['update_user_data'],
    mutationFn: (updateData: FormData) => updateUserData(userId, updateData),
    onSuccess: () => {
      setSuccessModalOpen(true)
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
    },
    onError: () => {
      setErrorModalOpen(true)
    },
  })

  const onSubmit = (data: FormData) => {
    // Check for changes before submitting
    if (userData?.name === data.name && userData?.email === data.email) {
      console.log('Žiadne zmeny')
      return
    }

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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        <Typography variant="h5" sx={{ mb: 2 }}>
          Používateľ
        </Typography>
        <div className="flex flex-col md:flex-row gap-4">
          <FormControl>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-[20rem]">
                  <FormLabel>Meno</FormLabel>
                  <Input placeholder="Zadajte meno" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormControl>

          <FormControl>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-[20rem]">
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    readOnly
                    className="bg-muted/30 cursor-not-allowed"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormControl>
        </div>

        <Button type="submit" disabled={mutation.isPending} className="w-[10.5rem]">
          {mutation.isPending ? <LoadingSpinner small /> : 'Uložiť zmeny'}
        </Button>

        <SuccessModal
          open={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          text="Údaje boli úspešne aktualizované!"
        />

        <ErrorModal
          open={errorModalOpen}
          onClose={() => setErrorModalOpen(false)}
          text="Nepodarilo sa aktualizovať údaje."
        />
      </form>
    </FormProvider>
  )
}

export default SettingsUser
