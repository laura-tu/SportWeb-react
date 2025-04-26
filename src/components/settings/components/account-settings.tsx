import React from 'react'
import { Typography } from '@mui/material'
import Box from '@/components/box'
import PasswordChange from './password-change'
import EmailChange from './email-change'

const AccountSettings = ({ userId }) => {
  return (
    <div className="box-border w-[60vw]">
      <div className="flex flex-col w-full py-2 px-2 mx-3 md:py-4 md:px-4 md:mx-0 lg:py-8 lg:px-8 lg:mx-3">
        <Box direction="row" className="flex flex-wrap">
          <Box direction="col" className="w-full">
            <Box direction="col">
              <Typography variant="h5" className="mb-2">
                Nastavenie účtu
              </Typography>

              <Box direction="col" className="mt-2">
                <Box direction="col" className=" md:flex-row gap-4">
                  <EmailChange userId={userId} />
                </Box>
                <div className="pt-6">
                  <Box direction="col" className=" md:flex-row gap-4">
                    <PasswordChange userId={userId} />
                  </Box>
                </div>
              </Box>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  )
}

export default AccountSettings
