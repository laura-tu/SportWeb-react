'use client'

import React, { useState, useEffect } from 'react'
import { FormProvider } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUpdatePasswordForm } from '../hooks/usePasswordMutation'
import ErrorModal from '@/components/error-modal'
import SuccessModal from '@/components/success-modal'
import { Box, CircularProgress } from '@mui/material'

interface PasswordChangeProps {
  userId: string
}

const PasswordChange: React.FC<PasswordChangeProps> = ({ userId }) => {
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)

  const { form, onSubmit, isError, isSuccess, isPending, error } = useUpdatePasswordForm(userId)

  useEffect(() => {
    if (isError) {
      setErrorModalOpen(true)
    }

    if (isSuccess) {
      setSuccessModalOpen(true)
    }
    form.reset({
      password: '',
      confirmPassword: '',
    })
  }, [isError, isSuccess])

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4 py-4">
        <div className="flex flex-col md:flex-row gap-4">
          <FormControl>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-[20rem]">
                  <FormLabel>Nové heslo</FormLabel>
                  <Input type="password" placeholder="Zadajte nové heslo" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormControl>

          <FormControl>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="w-[20rem]">
                  <FormLabel>Potvrdenie hesla</FormLabel>
                  <Input type="password" placeholder="Zadajte nové heslo znova" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormControl>
        </div>

        <Button type="submit" disabled={isPending} className="w-[10.5rem]">
          {isPending ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Ukladám...
            </Box>
          ) : (
            'Aktualizovať heslo'
          )}
        </Button>

        <ErrorModal
          open={errorModalOpen}
          onClose={() => setErrorModalOpen(false)}
          text={error?.message || 'Nepodarilo sa aktualizovať heslo.'}
        />

        <SuccessModal
          open={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          text="Údaje boli úspešne aktualizované!"
        />
      </form>
    </FormProvider>
  )
}

export default PasswordChange
