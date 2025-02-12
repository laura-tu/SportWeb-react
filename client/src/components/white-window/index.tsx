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
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import BodyCompositionTable from './body-composition-table'
import SegmentalAnalysisImage from './segmental-analysis'
import SmallBox from './small-box'

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

  const bodyComposition = [
    {
      key: '27. BFM (Body Fat Mass)',
      label: 'Telesný tuk',
      unit: 'kg',
      lower: '28. Lower Limit (BFM Normal Range)',
      upper: '29. Upper Limit (BFM Normal Range)',
    },
    {
      key: '30. SLM (Soft Lean Mass)',
      label: 'Mäkká bez-tuková hmota',
      unit: 'kg',
      lower: '31. Lower Limit (SLM Normal Range)',
      upper: '32. Upper Limit (SLM Normal Range)',
    },
    {
      key: '33. FFM (Fat Free Mass)',
      label: 'Bez-tuková telesná hmota',
      unit: 'kg',
      lower: '34. Lower Limit (FFM Normal Range)',
      upper: '35. Upper Limit (FFM Normal Range)',
    },
    {
      key: '36. SMM (Skeletal Muscle Mass)',
      label: 'Kostrová svalová hmota',
      unit: 'kg',
      lower: '37. Lower Limit (SMM Normal Range)',
      upper: '38. Upper Limit (SMM Normal Range)',
    },
    {
      key: '15. Weight',
      label: 'Hmotnosť',
      unit: 'kg',
      lower: '16. Lower Limit (Weight Normal Range)',
      upper: '17. Upper Limit (Weight Normal Range)',
    },
  ]

  const chartData = bodyComposition.map(({ key, label }) => ({
    name: label,
    value: Number((parsedData[0]?.[key] || '0').replace(',', '.')), // Convert to number
  }))

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
          <>
            <Box className="p-6 flex flex-row gap-16 flex-wrap">
              <Box className="flex flex-row gap-4 justify-self-center mx-auto">
                {['Name', 'Group', 'Age', 'Test Date'].map(key => {
                  const paramKey = Object.keys(params).find(k => k.includes(key))
                  const label = paramKey ? params[paramKey] : key
                  const value = paramKey ? parsedData[0][paramKey] : 'N/A'

                  return (
                    <Paper key={key} className="flex p-4 space-x-1!" elevation={4}>
                      <Typography variant="body1" className="font-bold!">
                        {label}:{' '}
                      </Typography>
                      <Typography variant="body1">
                        {value} {key === 'Age' ? 'rokov' : ''}
                      </Typography>
                    </Paper>
                  )
                })}
              </Box>

              <div className="flex gap-2 justify-between w-full">
                <div className="flex flex-col gap-2">
                  <SmallBox
                    title={'Výsledok InBody'}
                    parsedData={parsedData}
                    params={params}
                    mapData={['InBody Score']}
                  >
                    <Typography variant="h5">/ 100 bodov</Typography>
                  </SmallBox>

                  <SmallBox
                    title={'Bazálny metabolizmus'}
                    parsedData={parsedData}
                    params={params}
                    mapData={['BMR']}
                  >
                    <Typography variant="h5">kcal</Typography>
                  </SmallBox>

                  <SmallBox
                    title={'Pomer obvodu pásu a bokov'}
                    parsedData={parsedData}
                    params={params}
                    mapData={['WHR']}
                  >
                    <Typography variant="h5">(x-y)</Typography>
                  </SmallBox>
                  <SmallBox
                    title={'Obsah minerálov v kostiach'}
                    parsedData={parsedData}
                    params={params}
                    mapData={['BMC']}
                  >
                    <Typography variant="h5">kg</Typography>
                  </SmallBox>
                </div>

                <BodyCompositionTable
                  parsedData={parsedData}
                  params={params}
                  mapData={[
                    'TBW (Total Body Water)',
                    'Protein',
                    'Minerals',
                    'BFM (Body Fat Mass)',
                    'Weight',
                  ]}
                />
              </div>
              <Box className="flex flex-row flex-wrap justify-between gap-4 ">
                <SegmentalAnalysisImage
                  title={'Segmentálna analýza svalov'}
                  parsedData={parsedData}
                  params={params}
                  mapData={[
                    'FFM of Left Arm',
                    'FFM of Right Arm',
                    'FFM of Trunk',
                    'FFM of Left Leg',
                    'FFM of Right Leg',
                  ]}
                />
                <SegmentalAnalysisImage
                  title={'Segmentálna analýza tuku'}
                  parsedData={parsedData}
                  params={params}
                  mapData={[
                    'BFM of Left Arm',
                    'BFM of Right Arm',
                    'BFM of Trunk',
                    'BFM of Left Leg',
                    'BFM of Right Leg',
                  ]}
                />
              </Box>
            </Box>

            <Box className="p-6 flex flex-row gap-16 flex-wrap">
              <Typography variant="h6" className="mt-6 mb-4 font-bold">
                Graf telesného zloženia
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 30, right: 30 }}>
                  <Bar
                    dataKey="value"
                    fill="#8884d8"
                    minPointSize={5}
                    background={{ fill: '#eee' }}
                  />
                  <CartesianGrid strokeDasharray="6 6" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </>
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
