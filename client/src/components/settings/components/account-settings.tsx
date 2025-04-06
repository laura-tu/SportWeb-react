import React from 'react'
import { Typography, Box } from '@mui/material'
import PasswordChange from './password-change'
import EmailChange from './email-change'

const AccountSettings = ({ userId }) => {
  return (
    <div className="box-border w-[60vw]">
      <div className="flex flex-col w-full py-2 px-2 mx-3 md:py-4 md:px-4 md:mx-0 lg:py-8 lg:px-8 lg:mx-3">
        <Box
          className="flex flex-wrap"
          sx={{ width: { xs: '80%', sm: '60%', md: 'auto', lg: 700 } }}
        >
          <div className="flex flex-col w-full">
            <Box>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Nastavenie účtu
              </Typography>

              <Box sx={{ mt: 2 }}>
                <div className="flex flex-col md:flex-row gap-4">
                  <EmailChange userId={userId} />
                </div>
                <div className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <PasswordChange userId={userId} />
                  </div>
                </div>
              </Box>
            </Box>
          </div>
        </Box>
      </div>
    </div>
  )
}

export default AccountSettings
