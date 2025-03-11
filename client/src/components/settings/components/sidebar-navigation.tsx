import React, { useState } from 'react'
import { Typography } from '@mui/material'

const SidebarNavigation = ({ children }) => {
  const [currentForm, setCurrentForm] = useState('athlete')

  return (
    <div className="mx-6 flex h-[80vh] border-[1px]">
      <div className="flex flex-col gap-4 bg-blue-400 w-[15rem] max-h-fit-content pt-6 border-r-[1px]">
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
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default SidebarNavigation
