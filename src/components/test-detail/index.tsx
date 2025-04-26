import React, { useState, useEffect } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { IconButton, Typography, Link, Paper, Divider } from '@mui/material'
import Box from '@/components/box'
import * as XLSX from 'xlsx'
//import ParsedTest from './parsed-inbody/index'
import { useNavigate } from 'react-router-dom'
import params from '../../data/inbody-params.json'
import BodyCompositionTable from './components/body-composition-table'
import SegmentalAnalysisImage from './components/segmental-analysis'
import SmallBox from './components/small-box'
import LargeTable from './components/large-table'
import { mapParsedData } from '@/utils/dataUtils'

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
            <Box direction="row" className="p-6 gap-16 flex-wrap">
              <Box direction="row" className=" gap-4 justify-self-center mx-auto">
                {mapParsedData(['Name', 'Group', 'Age', 'Test Date'], parsedData, params).map(
                  ({ key, label, value }) => (
                    <Paper key={key} className="flex p-4 space-x-1!" elevation={4}>
                      <Typography variant="body1" className="font-bold!">
                        {label}:
                      </Typography>
                      <Typography variant="body1">
                        {value} {key === 'Age' ? 'rokov' : ''}
                      </Typography>
                    </Paper>
                  ),
                )}
              </Box>

              <Box direction="col" className="gap-2 justify-between w-full">
                <Box direction="col" className=" gap-2 my-5">
                  <SmallBox
                    title={'Výsledok InBody'}
                    parsedData={parsedData}
                    params={params}
                    mapData={['InBody Score']}
                  >
                    <Typography variant="h6">/ 100 bodov</Typography>
                  </SmallBox>

                  <SmallBox
                    title={'Bazálny metabolický pomer (BMR)'}
                    parsedData={parsedData}
                    params={params}
                    mapData={['BMR']}
                  >
                    <Typography variant="h6">kcal</Typography>
                  </SmallBox>
                  <SmallBox
                    title={'Index telesnej hmotnosti (BMI)'}
                    parsedData={parsedData}
                    params={params}
                    mapData={['BMI']}
                  >
                    <Typography variant="h6">kg/m²</Typography>
                  </SmallBox>
                  <SmallBox
                    title={'Percento telesného tuku'}
                    parsedData={parsedData}
                    params={params}
                    mapData={['PBF']}
                  >
                    <Typography variant="h6">%</Typography>
                  </SmallBox>
                </Box>

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
                  units={['L', 'kg', 'kg', 'kg', 'kg']}
                />
              </Box>
              <Box direction="row" className=" flex-wrap justify-center gap-18 w-full">
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

              <LargeTable
                parsedData={parsedData}
                params={params}
                mapData={['SLM', 'FFM', 'SMM', 'BMC', 'WHR']}
                units={['kg', 'kg', 'kg', 'kg', '']}
              />
            </Box>
          </>
        )}
        <Divider />
        {/*{parsedData.length > 0 && result.testType?.name === 'INBODY' ? (
          <ParsedTest parsedData={parsedData} />
        ) : (
          <div>nic</div>
        )}*/}
      </div>
    </Box>
  )
}

export default TestDetailWindow
