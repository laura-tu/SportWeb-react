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

const WIDTH = 'w-[23rem]'

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
      <form onSubmit={handleSubmit(onSubmit)} className="mt-14 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <FormControl>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className={WIDTH}>
                  <FormLabel className="text-lg">Meno</FormLabel>
                  <Input placeholder="Zadajte meno" className="text-lg" {...field} />
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
                <FormItem className={WIDTH}>
                  <FormLabel className="text-lg">Email</FormLabel>
                  <Input
                    type="email"
                    readOnly
                    className="cursor-not-allowed text-lg text-gray-700 bg-gray-100"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormControl>
        </div>

        <Button type="submit" disabled={mutation.isPending} className="">
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
          text="Aktualizácia údajov sa nepodarila. Skúste to znova neskôr."
        />
      </form>
    </FormProvider>
  )
}

export default SettingsUser
