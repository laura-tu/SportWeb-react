import React from 'react'
import { Paper, Typography, Box } from '@mui/material'

interface BodyCompositionTableProps {
  title: string
  parsedData: any
  params: any
  mapData: string[]
}

const findPercentageKey = (params: any, key: string) => {
  // Find the corresponding percentage key based on the body part
  const percentageKey = key.replace(' of', '% of')
  return Object.keys(params).find(paramKey => paramKey.includes(percentageKey))
}

const SegmentalAnalysisImage: React.FC<BodyCompositionTableProps> = ({
  title,
  parsedData,
  params,
  mapData,
}) => {
  return (
    <Box className="flex flex-col gap-2 w-[28rem] ">
      <Typography variant="h6" className="mt-6 mb-4 !font-bold">
        {title}
      </Typography>

      <Paper
        className="relative z-10 py-4 min-h-[30rem] max-h-[35rem]! flex flex-col justify-between bg-white!"
        sx={{
          backgroundImage: 'url(/body-figure.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundBlendMode: 'multiply',
        }}
      >
        <div className="absolute top-[50%] left-4 uppercase rotate-270">ľavá</div>
        <div className="absolute top-[50%] right-4 uppercase rotate-90">pravá</div>
        {/* First Row: First and Second Div */}
        <div className="flex justify-between  p-8 z-30">
          {mapData.slice(0, 2).map((key, index) => {
            const paramKey = Object.keys(params).find(k => k.includes(key))
            const value = paramKey ? parsedData[0]?.[paramKey] : 'N/A'
            const percentageKey = findPercentageKey(params, key)
            const percentageValue = percentageKey ? parsedData[0]?.[percentageKey] : 'N/A'

            return (
              <div
                key={key}
                className={`flex flex-col space-y-3 justify-center items-center bg-blue-300/30 rounded-lg p-2 ${index === 0 ? '' : 'ml-auto'}`}
              >
                <Typography variant="h6" className="flex decoration-dotted underline">
                  {value} kg
                </Typography>
                <Typography variant="h6" className="flex decoration-dotted underline">
                  {percentageValue} %
                </Typography>
              </div>
            )
          })}
        </div>

        {/* Second Row: Third Div (centered) */}
        <div className="flex absolute top-[30%]! left-[40%]">
          {mapData.slice(2, 3).map(key => {
            const paramKey = Object.keys(params).find(k => k.includes(key))
            const value = paramKey ? parsedData[0]?.[paramKey] : 'N/A'
            const percentageKey = findPercentageKey(params, key)
            const percentageValue = percentageKey ? parsedData[0]?.[percentageKey] : 'N/A'

            return (
              <div
                key={key}
                className="flex flex-col space-y-3 justify-center items-center bg-blue-300/30 rounded-lg p-2 ml-1"
              >
                <Typography variant="h6" className="flex decoration-dotted underline">
                  {value} kg
                </Typography>
                <Typography variant="h6" className="flex decoration-dotted underline">
                  {percentageValue} %
                </Typography>
              </div>
            )
          })}
        </div>

        {/* Third Row: Fourth and Fifth Div */}
        <div className="flex justify-between  p-12">
          {mapData.slice(3, 5).map((key, index) => {
            const paramKey = Object.keys(params).find(k => k.includes(key))
            const value = paramKey ? parsedData[0]?.[paramKey] : 'N/A'
            const percentageKey = findPercentageKey(params, key)
            const percentageValue = percentageKey ? parsedData[0]?.[percentageKey] : 'N/A'

            return (
              <div
                key={key}
                className={`flex flex-col space-y-3justify-center items-center bg-blue-300/30 rounded-lg p-2 ${index === 1 ? 'ml-auto' : ''}`}
              >
                <Typography variant="h6" className="flex decoration-dotted underline">
                  {value} kg
                </Typography>
                <Typography variant="h6" className="flex decoration-dotted underline">
                  {percentageValue} %
                </Typography>
              </div>
            )
          })}
        </div>
      </Paper>
    </Box>
  )
}

export default SegmentalAnalysisImage
