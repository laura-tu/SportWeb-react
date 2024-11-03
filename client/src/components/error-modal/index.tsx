import React from 'react'
import { Modal, Box, IconButton } from '@mui/material'
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
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="error-modal-title"
      aria-describedby="error-modal-description"
    >
      <Box
        className="bg-red-500 text-white p-6 rounded-lg shadow-lg max-w-md w-full mx-auto mt-20 relative"
        sx={{
          bgcolor: 'red.main',
          color: 'white',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <IconButton
          onClick={onClose}
          aria-label="close"
          sx={{
            position: 'absolute', // Positioned absolutely within the Box
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
        <p>Prosím, skúste to znova neskôr.</p>
      </Box>
    </Modal>
  )
}

export default ErrorModal
