import React from 'react'
import { toast } from 'sonner'
import { cva } from 'class-variance-authority'

export const toastVariants = cva('group flex justify-center rounded-xl p-2 shadow-lg z-50', {
  variants: {
    variant: {
      default: 'border bg-background text-foreground',
      error: 'bg-red-300! border-0!',
      success: 'bg-green-300! ',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export const showSuccessToast = (message?: string) => {
  toast(
    <div className="flex flex-col space-y-2">
      <h3 className=" flex justify-center font-bold text-lg tracking-tight">Hotovo!</h3>
      <p className=" flex justify-center font-normal text-base tracking-tight leading-6">
        {message ? message : 'Akcia bola úspešne vykonaná!'}
      </p>
    </div>,
    {
      className: toastVariants({ variant: 'success' }),
      duration: 5000,
    },
  )
}

export const showErrorToast = (message?: string) => {
  toast(
    <div className="flex flex-col space-y-2">
      <h3 className=" flex justify-center font-bold text-lg tracking-tight">Chyba!</h3>
      <p className="flex justify-center font-normal text-base tracking-tight leading-6">
        {message ? message : 'Niečo sa pokazilo. Skúste to znova neskôr.'}
      </p>
    </div>,
    {
      className: toastVariants({ variant: 'error' }),
      duration: 5000,
    },
  )
}
