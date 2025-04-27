import React, { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { IconButton, Typography, Link } from '@mui/material'
import Box from '@/components/box'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import ParsedTest from '../test-detail/parsed-test'
import pnoe from '../../data/pnoe-params.json'
import HRGraph from './components/hr-graph'
import VO2VCO2Graph from './components/vo2-vco2-graph'
import RERGraph from './components/rer-graph'
import FATCarbsGraph from './components/fat-carbs-graph'
import TableBox from './components/table-box'
import { calculateVSlopeThreshold, convertToVO2ANPPerKg } from './helpers/calculateV2SlopeThreshold'
import WattsGraph from './components/watts-graph'

const SpiroergometryDetail: React.FC<{ result: any }> = ({ result }) => {
  const bodyWeightKg = 60 //for now

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

  useEffect(() => {
    if (result.resultData?.url) {
      parseFile(result.resultData.url)
    }
  }, [result.resultData?.url, parsedData.length])

  const parsedDataMapped = useMemo(() => {
    return parsedData.map(row => {
      const mappedRow: any = {}
      Object.keys(pnoe).forEach(key => {
        if (row[key] !== undefined) {
          mappedRow[pnoe[key] || key] = isNaN(row[key]) ? row[key] : Number(row[key])
        }
      })
      return mappedRow
    })
  }, [parsedData])

  const extractedData = useMemo(() => {
    const hrData = []
    const vo2Vco2Data = []
    const rerData = []
    const fatCarbsData = []
    const energyData = []
    const wattsData = []
    const speedData = []

    parsedDataMapped.forEach(row => {
      if (row[pnoe['T(sec)']] !== null) {
        hrData.push({ time: row[pnoe['T(sec)']], 'HR(bpm)': row[pnoe['HR(bpm)']] || null })
        vo2Vco2Data.push({
          time: row[pnoe['T(sec)']],
          'VO2(ml/min)': row[pnoe['VO2(ml/min)']] || null,
          'VCO2(ml/min)': row[pnoe['VCO2(ml/min)']] || null,
        })
        rerData.push({ time: row[pnoe['T(sec)']], RER: row[pnoe['RER']] || null })
        fatCarbsData.push({
          time: row[pnoe['T(sec)']],
          'FAT(kcal)': row[pnoe['FAT(kcal)']] || null,
          'CARBS(kcal)': row[pnoe['CARBS(kcal)']] || null,
        })
        energyData.push({
          time: row[pnoe['T(sec)']],
          'EE(kcal/day)': row[pnoe['EE(kcal/day)']] || null,
          'EE(kcal/min)': row[pnoe['EE(kcal/min)']] || null,
        })
        wattsData.push({ time: row[pnoe['T(sec)']], Watts: row[pnoe['Watts']] || null })
        speedData.push({ time: row[pnoe['T(sec)']], Speed: row[pnoe['Speed']] || null })
      }
    })

    return { hrData, vo2Vco2Data, rerData, fatCarbsData, energyData, wattsData, speedData }
  }, [parsedDataMapped])

  //___________________________________________________________________________________________

  const { maxHR, averageHR } = useMemo(() => {
    if (extractedData?.hrData.length === 0) return { maxHR: null, averageHR: null }
    const hrValues = extractedData.hrData.map(row => row['HR(bpm)'])
    return {
      maxHR: Math.max(...hrValues),
      averageHR: hrValues.reduce((sum, hr) => sum + hr, 0) / hrValues.length,
    }
  }, [extractedData.hrData])
  //___________________________________________________________________________________________

  const { maxVO2, meanVO2, maxVCO2, meanVCO2, vo2ANP } = useMemo(() => {
    if (extractedData?.vo2Vco2Data.length === 0) {
      return { maxVO2: null, meanVO2: null, maxVCO2: null, meanVCO2: null, vo2ANP: null }
    }

    const vo2Values = extractedData.vo2Vco2Data.map(row => row['VO2(ml/min)'])
    const vco2Values = extractedData.vo2Vco2Data.map(row => row['VCO2(ml/min)'])

    return {
      maxVO2: Math.max(...vo2Values),
      meanVO2: vo2Values.reduce((sum, v) => sum + v, 0) / vo2Values.length,
      maxVCO2: Math.max(...vco2Values),
      meanVCO2: vco2Values.reduce((sum, v) => sum + v, 0) / vco2Values.length,
      vo2ANP: calculateVSlopeThreshold(extractedData.vo2Vco2Data, Math.max(...vo2Values)),
    }
  }, [extractedData.vo2Vco2Data])

  //__________________________________________________________________________________________

  const maxRER =
    extractedData?.rerData.length > 0
      ? Math.max(...extractedData.rerData.map(row => row['RER']))
      : null
  //__________________________________________________________________________________________

  const totalFat = extractedData.fatCarbsData.reduce((sum, row) => sum + row['FAT(kcal)'], 0)
  const totalCarbs = extractedData.fatCarbsData.reduce((sum, row) => sum + row['CARBS(kcal)'], 0)
  //__________________________________________________________________________________________
  const maxWatts =
    extractedData?.wattsData.length > 0
      ? Math.max(...extractedData.wattsData.map(row => row['Watts']))
      : null
  const avgWatts =
    extractedData?.wattsData.length > 0
      ? extractedData.wattsData.reduce((sum, row) => sum + row['Watts'], 0) /
        extractedData?.wattsData.length
      : null
  //__________________________________________________________________________________________
  const maxSpeed =
    extractedData?.speedData.length > 0
      ? Math.max(...extractedData.speedData.map(row => row['Speed']))
      : null
  const avgSpeed =
    extractedData?.speedData.length > 0
      ? extractedData.speedData.reduce((sum, row) => sum + row['Speed'], 0) /
        extractedData?.speedData.length
      : null

  if (!result) {
    return (
      <Typography variant="h6">Nie sú dostupné žiadne údaje pre test ID: {resultId}</Typography>
    )
  }

  return (
    <div className="flex  items-center justify-center ">
      <div className="relative bg-blue-100/20 p-8 rounded shadow-md w-full max-w-[75vw] max-h-[86vh] my-8 overflow-auto">
        <div className="absolute top-4 left-4">
          <IconButton onClick={() => navigate(-1)} color="primary" aria-label="go back">
            <ArrowBackIcon />
          </IconButton>
        </div>

        <Typography variant="h6" gutterBottom className="pt-4 pl-6 !font-bold">
          Detail výsledku športového testu
        </Typography>
        {showDetails && (
          <div className="pl-6">
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
          </div>
        )}
        {parsedData.length > 0 && (
          <>
            <Box direction="row" className="pl-6 my-4 flex-wrap gap-4">
              <TableBox
                title="Parameter"
                data={[
                  { label: 'Max HR', value: maxHR ? `${maxHR} bpm` : 'N/A' },
                  { label: 'Average HR', value: averageHR ? `${averageHR.toFixed(0)} bpm` : 'N/A' },
                  { label: 'Max RER', value: maxRER },
                ]}
              />

              <TableBox
                title="Parameter"
                data={[
                  {
                    label: 'Max VO2',
                    value: maxVO2
                      ? `${convertToVO2ANPPerKg(maxVO2, bodyWeightKg).toFixed(2)} ml/kg/min`
                      : 'N/A',
                  },
                  /*{ label: 'Max VCO2', value: maxVCO2 ? `${maxVCO2} ml/min` : 'N/A' },}*/
                  {
                    label: 'VO2 ANP',
                    value: vo2ANP
                      ? `${convertToVO2ANPPerKg(vo2ANP, bodyWeightKg).toFixed(2)} ml/kg/min`
                      : 'N/A',
                  },
                  {
                    label: 'Mean VO2',
                    value: meanVO2
                      ? `${convertToVO2ANPPerKg(meanVO2, bodyWeightKg).toFixed(2)} ml/kg/min`
                      : 'N/A',
                  },
                  /*{{ label: 'Mean VCO2', value: meanVCO2 ? `${meanVCO2.toFixed(2)} ml/min` : 'N/A' },}*/
                ]}
              />
              <TableBox
                title="Parameter"
                data={[
                  { label: 'Max VCO2', value: maxVCO2 ? `${maxVCO2} ml/min` : 'N/A' },
                  /*{{
                    label: 'VO2 ANP',
                    value: vo2ANP
                      ? `${convertToVO2ANPPerKg(vo2ANP, bodyWeightKg).toFixed(2)} ml/kg/min`
                      : 'N/A',
                  },}*/

                  { label: 'Mean VCO2', value: meanVCO2 ? `${meanVCO2.toFixed(2)} ml/min` : 'N/A' },
                ]}
              />

              <TableBox
                title="Parameter"
                data={[
                  { label: 'Max Watts', value: maxWatts ? `${maxWatts} W` : 'N/A' },
                  { label: 'Average Watts', value: avgWatts ? `${avgWatts.toFixed(2)} W` : 'N/A' },
                  { label: 'Max Speed', value: maxSpeed ? `${maxSpeed} km/h` : 'N/A' },
                  {
                    label: 'Average Speed',
                    value: avgSpeed ? `${avgSpeed.toFixed(2)} km/h` : 'N/A',
                  },
                ]}
              />

              <TableBox
                title="Parameter"
                data={[
                  { label: 'Total FAT', value: totalFat ? `${totalFat.toFixed(2)} kcal` : 'N/A' },
                  {
                    label: 'Total CARBS',
                    value: totalCarbs ? `${totalCarbs.toFixed(2)} kcal` : 'N/A',
                  },
                  {
                    label: 'Total Energy',
                    value: totalCarbs ? `${(totalCarbs + totalFat).toFixed(2)} kcal` : 'N/A',
                  },
                ]}
              />
            </Box>
            <VO2VCO2Graph data={extractedData.vo2Vco2Data} />
            <HRGraph data={extractedData.hrData} />
            <RERGraph data={extractedData.rerData} />
            <FATCarbsGraph data={extractedData.fatCarbsData} />
            <WattsGraph data={extractedData.wattsData} />
          </>
        )}

        {parsedData.length > 0 && result.testType?.name === 'Pnoe' ? (
          <ParsedTest parsedData={parsedData} />
        ) : (
          <div>nic</div>
        )}
      </div>
    </div>
  )
}

export default SpiroergometryDetail
