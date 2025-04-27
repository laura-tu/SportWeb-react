import React from 'react'
import { Paper, Typography } from '@mui/material'
import Box from '../box'
import SmallBox from './components/small-box'
import BodyCompositionTable from './components/body-composition-table'
import SegmentalAnalysisImage from './components/segmental-analysis'
import LargeTable from './components/large-table'
import { mapParsedData } from '@/utils/dataUtils'

const InbodyTest: React.FC<{ parsedData: any[]; params: any }> = ({ parsedData, params }) => {
  return (
    <>
      <Box direction="row" className="p-6 gap-16 flex-wrap">
        {/* Displaying basic parsed data like Name, Age, etc. */}
        <Box direction="row" className="gap-4 justify-self-center mx-auto">
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

        {/* Small data boxes (InBody Score, BMR, BMI, PBF) */}
        <Box direction="row" className="gap-2 justify-between w-full">
          <Box direction="col" className="gap-2 my-5">
            {['InBody Score', 'BMR', 'BMI', 'PBF'].map((mapData, index) => (
              <SmallBox
                key={index}
                title={mapData}
                parsedData={parsedData}
                params={params}
                mapData={[mapData]}
              >
                <Typography variant="h6">
                  {mapData === 'BMR' ? 'kcal' : mapData === 'BMI' ? 'kg/m²' : '%'}
                </Typography>
              </SmallBox>
            ))}
          </Box>

          {/* Body Composition Table */}
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

        {/* Segmental Analysis Images */}
        <Box direction="row" className="flex-wrap justify-center gap-18 w-full">
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

        {/* Large Data Table */}
        <LargeTable
          parsedData={parsedData}
          params={params}
          mapData={['SLM', 'FFM', 'SMM', 'BMC', 'WHR']}
          units={['kg', 'kg', 'kg', 'kg', '']}
        />
      </Box>
    </>
  )
}

export default InbodyTest
