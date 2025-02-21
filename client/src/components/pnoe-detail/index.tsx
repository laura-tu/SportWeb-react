import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IconButton, Box, Typography, Link, Paper, Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import ParsedInbodyTest from '../white-window/parsed-inbody'
import pnoe from '../../data/pnoe-params.json'
import HRGraph from './hr-graph'
import VO2VCO2Graph from './vo2-vco2-graph'
import RERGraph from './rer-graph'

const SpiroergometryDetail: React.FC<{ result: any }> = ({ result }) => {
  const { resultId } = useParams()

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
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' }) // Ensure empty cells are included
        setParsedData(jsonData)
        setShowDetails(false) //JUST for now
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

  const hrData = parsedData
    .map(row => ({
      time: row['T(sec)'] ? Number(row['T(sec)']) : null,
      HR: row['HR(bpm)'] ? Number(row['HR(bpm)']) : null,
    }))
    .filter(row => row.time !== null && row.HR !== null)

  const vo2Vco2Data = parsedData
    .map(row => ({
      time: row['T(sec)'] ? Number(row['T(sec)']) : null,
      VO2: row['VO2(ml/min)'] ? Number(row['VO2(ml/min)']) : null,
      VCO2: row['VCO2(ml/min)'] ? Number(row['VCO2(ml/min)']) : null,
    }))
    .filter(row => row.time !== null && row.VO2 !== null && row.VCO2 !== null)

  const rerData = parsedData
    .map(row => ({
      time: row['T(sec)'] ? Number(row['T(sec)']) : null,
      RER: row['RER'] ? Number(row['RER']) : null, // Ensure you're mapping the correct field for RER
    }))
    .filter(row => row.time !== null && row.RER !== null)

  if (!result) {
    return (
      <Typography variant="h6">Nie sú dostupné žiadne údaje pre test ID: {resultId}</Typography>
    )
  }

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
            <VO2VCO2Graph data={vo2Vco2Data} />
            <HRGraph data={hrData} />
            <RERGraph data={rerData} />
          </>
        )}

        {parsedData.length > 0 && result.testType?.name === 'Pnoe' ? (
          <ParsedInbodyTest parsedData={parsedData} />
        ) : (
          <div>nic</div>
        )}
      </div>
    </div>
  )
}

export default SpiroergometryDetail
