import React from 'react'
import { Typography } from '@mui/material'
import Box from '@/components/box'

const SidebarNavigation = ({ children, setCurrentForm, userRole }) => {
  return (
    <div className="mx-10 h-[80vh]">
      <Box direction="row" className="gap-4 items-center">
        <button
          className="py-4"
          onClick={() => setCurrentForm(userRole === 'coach' ? 'coach' : 'athlete')}
        >
          <Typography variant="button" className="text-2xl! text-black/60 hover:text-black">
            Môj profil
          </Typography>
        </button>
        <div className="py-2 border-r-2 border-black/60 h-6" />
        <button className="py-4" onClick={() => setCurrentForm('password')}>
          <Typography variant="button" className="text-2xl! text-black/60 hover:text-black">
            Môj účet
          </Typography>
        </button>
      </Box>
      <Box direction="row" className="flex-1 bg-[#4E9CDE33] max-h-[40rem]">
        {children}
      </Box>
    </div>
  )
}

export default SidebarNavigation
