import React from 'react'
import { Modal, IconButton } from '@mui/material'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'

interface ErrorModalProps {
  onClose: () => void
  text: string
  label?: string
  open: boolean
  errorModalMessage?: string | null
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  onClose,
  label,
  text,
  open,
  errorModalMessage,
}) => {
  if (!open) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="error-modal-title"
      aria-describedby="error-modal-description"
    >
      <div
        className="bg-red-500 text-white p-6 rounded-lg shadow-lg max-w-md w-full mx-auto mt-20 relative"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <IconButton
          onClick={onClose}
          aria-label="close"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white',
          }}
        >
          <CloseOutlinedIcon />
        </IconButton>

        {label ? (
          <h3 className="text-md font-semibold" id="error-modal-title">
            {label}
          </h3>
        ) : (
          <h2 className="text-lg font-semibold" id="error-modal-title">
            Chyba!
          </h2>
        )}
        <br />
        {errorModalMessage ? (
          <p id="error-modal-description">{errorModalMessage}</p>
        ) : (
          <p id="error-modal-description">Vyskytol sa problém pri {text}.</p>
        )}
        <p>Prosím, skúste to znova.</p>
      </div>
    </Modal>
  )
}

export default ErrorModal
