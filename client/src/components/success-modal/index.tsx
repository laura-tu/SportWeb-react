import React from 'react'
import { Modal, Box, IconButton } from '@mui/material'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'

interface SuccessModalProps {
  onClose: () => void
  text: string
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
      <Box
        className=" bg-white text-black p-6 rounded-lg shadow-lg max-w-md w-full mx-auto mt-20 relative top-64"
        sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}
      >
        <IconButton
          onClick={onClose}
          aria-label="close"
          sx={{
            position: 'absolute',
            top: 5,
            right: -380,
            color: 'white',
          }}
        >
          <CloseOutlinedIcon />
        </IconButton>

        <h2 className="text-lg font-semibold">Len tak ďalej...</h2>
        <p>{text}</p>
      </Box>
    </Modal>
  )
}

export default SuccessModal
