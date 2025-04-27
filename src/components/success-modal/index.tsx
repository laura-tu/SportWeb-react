import React from 'react'
import { showSuccessToast } from '@/components/ui/sonner'

interface SuccessModalProps {
  onClose: () => void
  text?: string
  open: boolean
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose, text, open }) => {
  React.useEffect(() => {
    if (open) {
      showSuccessToast(text)

      onClose()
    }
  }, [open, text, onClose])

  return <>{/* The Toaster component renders the toast notifications */}</>
}

export default SuccessModal
