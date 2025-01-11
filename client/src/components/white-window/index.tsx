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
} from '@mui/material'
import * as XLSX from 'xlsx'
import ParsedInbodyTest from './parsed-inbody/index.tsx'

const WhiteWindow: React.FC<{ result: any; onBack: () => void }> = ({ result, onBack }) => {
  const [parsedData, setParsedData] = useState<any[]>([])

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
      <div className="relative bg-blue-100/70 p-8 rounded shadow-md w-full max-w-7xl max-h-[80vh] mb-14 overflow-hidden">
        <Box className="absolute top-4 left-4">
          <IconButton onClick={onBack} color="primary" aria-label="go back">
            <ArrowBackIcon />
          </IconButton>
        </Box>

        <Box className="pl-6">
          <Typography variant="h6" gutterBottom className="pt-4">
            Detail výsledku športového testu
          </Typography>
          <Typography variant="body1">
            Dátum: {new Date(result.date).toLocaleDateString()}
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

        {/* Conditionally render ParsedInbodyTest or default table */}
        {parsedData.length > 0 && result.testType?.name === 'INBODY' ? (
          <ParsedInbodyTest parsedData={parsedData} />
        ) : (
          <Box className="my-8 max-h-[50vh]">
            <Typography variant="h6" gutterBottom>
              Výsledok testu:
            </Typography>
            {parsedData.length > 0 && (
              <TableContainer component={Paper} className="overflow-auto max-h-[45vh]">
                <Table>
                  <TableHead>
                    <TableRow>
                      {Object.keys(parsedData[0]).map(key => (
                        <TableCell key={key}>{key}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {parsedData.map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value, cellIndex) => (
                          <TableCell key={cellIndex}>{String(value)}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </div>
    </div>
  )
}

export default WhiteWindow
