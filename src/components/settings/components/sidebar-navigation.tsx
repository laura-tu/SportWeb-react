import React from 'react'
import { Typography } from '@mui/material'
import Box from '@/components/box'

const SidebarNavigation = ({ children, setCurrentForm }) => {
  return (
    <Box direction="row" className="mx-6 h-[80vh] border-[1px]">
      <Box
        direction="col"
        className="flex flex-col gap-4 bg-blue-400 w-[15rem] max-h-fit-content pt-6 border-r-[1px]"
      >
        <button
          className="p-2 underline hover:cursor-pointer"
          onClick={() => setCurrentForm('athlete')}
        >
          <Typography variant="button">Môj profil</Typography>
        </button>
        <button
          className="p-2 underline hover:cursor-pointer"
          onClick={() => setCurrentForm('password')}
        >
          <Typography variant="button">Môj účet</Typography>
        </button>
      </Box>
      <Box direction="col" className="flex-1">
        {children}
      </Box>
    </Box>
  )
}

export default SidebarNavigation
