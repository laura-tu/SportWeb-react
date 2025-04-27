import React, { useState, useEffect } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { IconButton, Typography } from '@mui/material'
import Box from '@/components/box'
import * as XLSX from 'xlsx'
import { useNavigate } from 'react-router-dom'
import params from '../../data/inbody-params.json'
import InbodyTest from './inbody-test'

const TestDetailWindow: React.FC<{ result: any }> = ({ result }) => {
  const [parsedData, setParsedData] = useState<any[]>([])
  const navigate = useNavigate()

  const parseFile = async (url: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()

      const reader = new FileReader()
      reader.onload = (event: any) => {
        const data = new Uint8Array(event.target.result)
        const workbook = XLSX.read(data, { type: 'array' })

        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        setParsedData(jsonData)
      }
      reader.readAsArrayBuffer(blob)
    } catch (error) {
      console.error('Chyba pri parsovaní súboru:', error)
    }
  }

  // Automatically parse file when resultData.url is available
  useEffect(() => {
    if (result.resultData?.url) {
      parseFile(result.resultData.url)
    }
  }, [result.resultData?.url])

  return (
    <Box direction="col" className="items-center justify-center ">
      <div className="relative bg-blue-100/20 p-8 rounded shadow-md w-full max-w-[75vw] max-h-[86vh] my-8 overflow-auto">
        <div className="absolute top-4 left-4">
          <IconButton onClick={() => navigate(-1)} color="primary" aria-label="go back">
            <ArrowBackIcon />
          </IconButton>
        </div>

        <Typography variant="h6" gutterBottom className="pt-4 pl-6 !font-bold">
          Detail výsledku športového testu
        </Typography>

        {parsedData.length > 0 && <InbodyTest parsedData={parsedData} params={params} />}

        {/*Table Data parsed from XLSX file*/}
        {/*<Divider />
        {parsedData.length > 0 && result.testType?.name === 'INBODY' ? (
          <ParsedTest parsedData={parsedData} />
        ) : (
          <div>nic</div>
        )}*/}
      </div>
    </Box>
  )
}

export default TestDetailWindow
