'use client'

import React, { useState, useEffect } from 'react'
import { FormProvider } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useUpdatePasswordForm } from '../hooks/usePasswordMutation'
import ErrorModal from '@/components/error-modal'
import SuccessModal from '@/components/success-modal'
import LoadingSpinner from '@/components/loading/loading-spinner'
import Box from '@/components/box'
import { cn } from '@/utils/cn'

interface PasswordChangeProps {
  userId: string
  width?: string
}

const PasswordChange: React.FC<PasswordChangeProps> = ({ userId, width }) => {
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
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4 py-4">
          <Box direction="row" className="gap-4">
            <FormControl>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className={cn(width)}>
                    <FormLabel className="text-lg">Nové heslo</FormLabel>
                    <Input
                      type="password"
                      placeholder="Zadajte nové heslo"
                      className="text-lg"
                      {...field}
                    />
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
                  <FormItem className={cn(width)}>
                    <FormLabel className="text-lg">Potvrdenie hesla</FormLabel>
                    <Input
                      type="password"
                      placeholder="Zadajte nové heslo znova"
                      className="text-lg"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormControl>
          </Box>

          <Button type="submit" disabled={isPending} className="w-[10.5rem]">
            {isPending ? <LoadingSpinner small /> : 'Aktualizovať heslo'}
          </Button>
        </form>
      </FormProvider>

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
    </>
  )
}

export default PasswordChange
