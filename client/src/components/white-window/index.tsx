import React, { useState, useEffect } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  IconButton,
  Box,
  Typography,
  Link,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import * as XLSX from 'xlsx'
import ParsedInbodyTest from './parsed-inbody/index'
import { useNavigate } from 'react-router-dom'
import params from '../../data/inbody-params.json'

const TestDetailWindow: React.FC<{ result: any }> = ({ result }) => {
  const [parsedData, setParsedData] = useState<any[]>([])
  const [showDetails, setShowDetails] = useState(true)
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
        setShowDetails(false)
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

  const bodyCompositionMetrics = [
    {
      key: '18. TBW (Total Body Water)',
      label: 'Celková telesná voda',
      unit: 'L',
      lower: '19. Lower Limit (TBW Normal Range)',
      upper: '20. Upper Limit (TBW Normal Range)',
    },
    {
      key: '21. Protein',
      label: 'Proteín',
      unit: 'kg',
      lower: '22. Lower Limit (Protein Normal Range)',
      upper: '23. Upper Limit (Protein Normal Range)',
    },
    {
      key: '24. Minerals',
      label: 'Minerály',
      unit: 'kg',
      lower: '25. Lower Limit (Minerals Normal Range)',
      upper: '26. Upper Limit (Minerals Normal Range)',
    },
    {
      key: '27. BFM (Body Fat Mass)',
      label: 'Telesný tuk',
      unit: 'kg',
      lower: '28. Lower Limit (BFM Normal Range)',
      upper: '29. Upper Limit (BFM Normal Range)',
    },
    {
      key: '15. Weight',
      label: 'Hmotnosť',
      unit: 'kg',
      lower: '16. Lower Limit (Weight Normal Range)',
      upper: '17. Upper Limit (Weight Normal Range)',
    },
  ]

  return (
    <div className="flex items-center justify-center ">
      <div className="relative bg-blue-100/20 p-8 rounded shadow-md w-full max-w-[75vw] max-h-[86vh] my-8 overflow-auto">
        <Box className="absolute top-4 left-4">
          <IconButton onClick={() => navigate(-1)} color="primary" aria-label="go back">
            <ArrowBackIcon />
          </IconButton>
        </Box>

        <Typography variant="h6" gutterBottom className="pt-4 pl-6 !font-bold">
          Detail výsledku športového testu
        </Typography>

        {showDetails && (
          <Box className="pl-6">
            <Typography variant="body1">
              Dátum: {new Date(result?.date).toLocaleDateString()}
            </Typography>
            <Typography variant="body1">Typ testu: {result.testType?.name || 'N/A'}</Typography>
            <Typography variant="body1">Poznámky: {result.notes || 'Žiadne poznámky'}</Typography>
            {result.resultData?.url && (
              <Typography>
                Súbor:{' '}
                <Link href={result.resultData.url} target="_blank">
                  {result.resultData.title || 'Stiahnuť'}
                </Link>
              </Typography>
            )}
          </Box>
        )}

        {parsedData.length > 0 && (
          <Box className="p-6 flex flex-row gap-6 flex-wrap">
            <Box className="flex flex-col gap-2">
              {['Name', 'Group', 'Age', 'Test Date'].map(key => {
                const paramKey = Object.keys(params).find(k => k.includes(key))
                const label = paramKey ? params[paramKey] : key
                const value = paramKey ? parsedData[0][paramKey] : 'N/A'

                return (
                  <Card key={key} className="w-52 p-4">
                    <Typography variant="body1" className="font-bold">
                      {label}: {value} {key === 'Age' ? 'rokov' : ''}
                    </Typography>
                  </Card>
                )
              })}
            </Box>
            <Box className="flex flex-col gap-2">
              {['Height', 'Weight'].map(key => {
                const paramKey = Object.keys(params).find(k => k.includes(key))
                const label = paramKey ? params[paramKey] : key
                const value = paramKey ? parsedData[0][paramKey] : 'N/A'

                return (
                  <Card key={key} className="w-52 p-4">
                    <Typography variant="body1" className="font-bold">
                      {label}: {value} {key === 'Height' ? 'cm' : key === 'Weight' ? 'kg' : ''}
                    </Typography>
                  </Card>
                )
              })}
            </Box>

            <Box className="flex flex-col gap-2 ">
              <Typography variant="h6" className="mt-6 mb-4 !font-bold">
                Analýza telesného zloženia
              </Typography>
              <TableContainer component={Paper} className="mb-6">
                <Table>
                  <TableHead className="border-b-2 border-b-blue-300">
                    <TableRow>
                      <TableCell>
                        <strong>Parameter</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Hodnota</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Normálny Rozsah</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Jednotka</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bodyCompositionMetrics.map(({ key, unit, lower, upper }) => {
                      const paramKey = Object.keys(params).find(k => k.startsWith(key))
                      const label = paramKey ? params[paramKey] : key
                      const value = paramKey ? parsedData[0][paramKey] : 'N/A'
                      const lowerLimit = parsedData[0]?.[lower] || 'N/A'
                      const upperLimit = parsedData[0]?.[upper] || 'N/A'

                      return (
                        <TableRow key={key}>
                          <TableCell>{label}</TableCell>
                          <TableCell>{value}</TableCell>
                          <TableCell>
                            {lowerLimit} - {upperLimit}
                          </TableCell>
                          <TableCell>{unit}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
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
