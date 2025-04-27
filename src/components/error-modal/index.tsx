import React from 'react'
import { showErrorToast } from '@/components/ui/sonner'

interface ErrorModalProps {
  onClose: () => void
  text: string
  open: boolean
}

const ErrorModal: React.FC<ErrorModalProps> = ({ onClose, text, open }) => {
  React.useEffect(() => {
    if (open) {
      showErrorToast(text || 'Niečo sa pokazilo. Skúste to znova neskôr.')

      onClose()
    }
  }, [open, text, onClose])

  return <>{/* The Toaster component renders the toast notifications */}</>
}

export default ErrorModal
