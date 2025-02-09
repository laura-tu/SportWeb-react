import React, { useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  IconButton,
  Box,
  Typography,
  Link,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
} from '@mui/material'
import * as XLSX from 'xlsx'
import ParsedInbodyTest from './parsed-inbody/index'
import { useNavigate } from 'react-router-dom'
import params from '../../data/inbody-params.json'

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

  return (
    <div className="flex items-center justify-center max-h-[80vh] my-auto  bg-white">
      <div className="relative bg-blue-100/70 p-8 rounded shadow-md w-full max-w-[75vw] max-h-[80vh] mb-14 overflow-hidden">
        <Box className="absolute top-4 left-4">
          <IconButton onClick={() => navigate(-1)} color="primary" aria-label="go back">
            <ArrowBackIcon />
          </IconButton>
        </Box>

        <Box className="pl-6">
          <Typography variant="h6" gutterBottom className="pt-4 !font-bold">
            Detail výsledku športového testu
          </Typography>
          <Typography variant="body1">
            Dátum: {new Date(result?.date).toLocaleDateString()}
          </Typography>
          <Typography variant="body1">Typ testu: {result.testType?.name || 'N/A'}</Typography>
          <Typography variant="body1">Poznámky: {result.notes || 'Žiadne poznámky'}</Typography>
          {result.resultData?.url && (
            <>
              <Typography>
                Súbor:{' '}
                <Link href={result.resultData.url} target="_blank">
                  {result.resultData.title || 'Stiahnuť'}
                </Link>
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => parseFile(result.resultData.url)}
                sx={{ mt: 2 }}
              >
                Zobraziť dáta zo súboru
              </Button>
            </>
          )}
        </Box>

        {parsedData.length > 0 && (
          <Box className="pl-6">
            <Box>
              {['Name', 'Age', 'Height'].map(key => {
                const paramKey = Object.keys(params).find(k => k.includes(key))
                const label = paramKey ? params[paramKey] : key
                const value = paramKey ? parsedData[0][paramKey] : 'N/A'

                return (
                  <Card key={key} className="w-52 my-2 p-4">
                    <Typography variant="body1" className="font-bold">
                      {label}: {value} {key === 'Age' ? 'rokov' : key === 'Height' ? 'cm' : ''}
                    </Typography>
                  </Card>
                )
              })}
            </Box>
          </Box>
        )}

        {parsedData.length > 0 && result.testType?.name === 'INBODY' ? (
          <ParsedInbodyTest parsedData={parsedData} />
        ) : (
          <div>nic</div>
        )}
      </div>
    </div>
  )
}

export default TestDetailWindow
