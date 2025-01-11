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

const WhiteWindow: React.FC<{ result: any; onBack: () => void }> = ({ result, onBack }) => {
  const [parsedData, setParsedData] = useState<any[]>([])

  const parseFile = async (url: string) => {
    try {
      // Fetch the file as a Blob
      const response = await fetch(url)
      const blob = await response.blob()

      // Read the file using FileReader
      const reader = new FileReader()
      reader.onload = (event: any) => {
        const data = new Uint8Array(event.target.result)
        const workbook = XLSX.read(data, { type: 'array' })

        // Parse the first sheet
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        console.log('jsonData:', jsonData)

        // Update the state with parsed data
        setParsedData(jsonData)
      }
      reader.readAsArrayBuffer(blob)
    } catch (error) {
      console.error('Error parsing file:', error)
    }
  }

  return (
    <div className="flex items-center justify-center h-full bg-white">
      <div className="relative bg-blue-100/70 p-8 rounded shadow-md w-full max-w-4xl">
        {/* Back Button */}
        <Box className="absolute top-4 left-4">
          <IconButton onClick={onBack} color="primary" aria-label="go back">
            <ArrowBackIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box className="pl-6">
          <Typography variant="h6" gutterBottom className="pt-4">
            Test Result Details
          </Typography>
          <Typography variant="body1">
            Dátum: {new Date(result.date).toLocaleDateString() || 'N/A'}
          </Typography>
          <Typography variant="body1">Typ testu: {result.testType?.name || 'N/A'}</Typography>
          <Typography variant="body1">Poznámky: {result.notes || 'Žiadne poznámky'}</Typography>
          {result.resultData?.url && (
            <>
              <Typography>
                Result File:{' '}
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
                Parse File
              </Button>
            </>
          )}
        </Box>

        {/* Display Parsed Data */}
        {parsedData.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Parsed Data:
            </Typography>
            <TableContainer component={Paper}>
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
          </Box>
        )}
      </div>
    </div>
  )
}

export default WhiteWindow
