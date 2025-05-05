import React from 'react'
//import { Typography } from '@mui/material'
import Box from '@/components/box'
import PasswordChange from './password-change'
import EmailChange from './email-change'

const WIDTH = 'w-[23rem]'

const AccountSettings = ({ userId }) => {
  return (
    <div className="box-border w-[60vw] my-14 ml-10">
      <div className="flex flex-col w-full">
        <Box direction="row" className="flex flex-wrap">
          <Box direction="col" className="w-full">
            <Box direction="col">
              {/*<Typography variant="h5" className="mb-2">
                Nastavenie účtu
              </Typography>*/}

              <Box direction="col">
                <Box direction="col" className=" md:flex-row gap-4">
                  <EmailChange userId={userId} width={WIDTH} />
                </Box>
                <div className="pt-6">
                  <Box direction="col" className=" md:flex-row gap-4">
                    <PasswordChange userId={userId} width={WIDTH} />
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
