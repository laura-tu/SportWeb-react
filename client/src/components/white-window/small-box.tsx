import React from 'react'
import { Divider, Typography } from '@mui/material'

interface BoxProps {
  title: string
  parsedData: any
  params: any
  mapData: string[]
  children?: React.ReactNode
}

const SmallBox: React.FC<BoxProps> = ({ title, parsedData, params, mapData, children }) => {
  return (
    <div>
      <Typography variant="h6" className="mt-2 font-semibold!">
        {title}
      </Typography>
      <div className="flex">
        {mapData.map(key => {
          const paramKey = Object.keys(params).find(k => k.includes(key))
          const value = paramKey ? parsedData[0][paramKey] : 'N/A'

          return (
            <div key={key} className="flex flex-col p-2 space-x-3! w-78">
              <div className="flex flex-row gap-4 justify-self-center mx-auto">
                <Typography variant="h5" className="font-bold!">
                  {value}
                </Typography>
                {children}
              </div>
              <Divider />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SmallBox
