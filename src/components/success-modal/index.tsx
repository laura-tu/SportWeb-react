import React from 'react'
import { Modal, Box, IconButton } from '@mui/material'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'

interface SuccessModalProps {
  onClose: () => void
  text?: string
  open: boolean
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose, text, open }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="success-modal-title"
      aria-describedby="success-modal-description"
    >
      <Box className="bg-white rounded-lg p-4 max-w-sm text-center mx-auto border-4 border-green-400 relative">
        <IconButton
          onClick={onClose}
          aria-label="close"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'red',
          }}
        >
          <CloseOutlinedIcon />
        </IconButton>

        <h2 className="text-xl font-bold">Hotovo!</h2>
        <p className="pb-4">{text}</p>
      </Box>
    </Modal>
  )
}

export default SuccessModal
