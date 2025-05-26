import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { Typography } from '@mui/material'
import Box from '@/components/box'
import SelectableHeaderList from '../selectable-header'
import ComparisonChart from '../comparison-chart'

interface ComparisonPanelProps {
  results: any[]
}

const PnoeComparisonPanel: React.FC<ComparisonPanelProps> = ({ results }) => {
  const [headers, setHeaders] = useState<string[]>([])
  const [selectedHeader, setSelectedHeader] = useState<string | null>(null)
  const [parsedResults, setParsedResults] = useState<{ date: string; value: number | null }[]>([])

  const chartData = parsedResults.map(r => ({
    date: r.date,
    value: r.value,
  }))

  useEffect(() => {
    const fetchHeaders = async () => {
      const res = await fetch(results[0].resultData.url)
      const arrayBuffer = await res.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

      const rawHeaders = jsonData[0] as string[]

      const excluded = ['phase', 'T(sec)'].map(h => h.toLowerCase())

      const cleaned = rawHeaders
        .map(header => (typeof header === 'string' ? header.replace(/^\d+\.\s*/, '').trim() : ''))
        .filter(header => {
          const h = header.trim().toLowerCase()
          return h && !excluded.includes(h)
        })

      const numericalHeaders = [
        'HR(bpm)',
        'VO2(ml/min)',
        'VCO2(ml/min)',
        'RER',
        'VE(l/min)',
        'VT(l)',
        'BF(bpm)',
        'EE(kcal/day)',
        'EE(kcal/min)',
        'CARBS(kcal)',
        'FAT(kcal)',
        'MET',
        'Watts',
        'Speed',
      ]

      const expandedHeaders = cleaned.flatMap(header =>
        numericalHeaders.includes(header)
          ? [`Average ${header}`, `Min ${header}`, `Max ${header}`]
          : [header],
      )

      setHeaders(expandedHeaders)
    }

    if (results.length > 0) fetchHeaders()
  }, [results])

  const fetchAllSelectedValues = async () => {
    if (!selectedHeader) return

    let operation: 'avg' | 'min' | 'max' = 'avg'
    let baseHeader = selectedHeader

    if (selectedHeader.startsWith('Average ')) {
      operation = 'avg'
      baseHeader = selectedHeader.replace('Average ', '')
    } else if (selectedHeader.startsWith('Min ')) {
      operation = 'min'
      baseHeader = selectedHeader.replace('Min ', '')
    } else if (selectedHeader.startsWith('Max ')) {
      operation = 'max'
      baseHeader = selectedHeader.replace('Max ', '')
    }

    const parsed = await Promise.all(
      results.map(async result => {
        try {
          const res = await fetch(result.resultData.url)
          const arrayBuffer = await res.arrayBuffer()
          const workbook = XLSX.read(arrayBuffer, { type: 'array' })
          const worksheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

          const rawHeaders = jsonData[0] as string[]
          const cleanedHeaders = rawHeaders.map(h =>
            typeof h === 'string' ? h.replace(/^\d+\.\s*/, '').trim() : '',
          )

          const rows = jsonData.slice(1) as any[][]

          const headerIndex = cleanedHeaders.findIndex(h => h === baseHeader)
          const values: number[] = []

          if (headerIndex !== -1) {
            for (const row of rows) {
              const raw = row[headerIndex]
              const value =
                typeof raw === 'string'
                  ? parseFloat(raw.replace(',', '.'))
                  : typeof raw === 'number'
                    ? raw
                    : null

              if (!isNaN(value as number) && value !== null) {
                values.push(value as number)
              }
            }
          }

          let value: number | null = null
          if (values.length > 0) {
            if (operation === 'avg') value = values.reduce((a, b) => a + b, 0) / values.length
            else if (operation === 'min') value = Math.min(...values)
            else if (operation === 'max') value = Math.max(...values)

            if (value !== null) {
              value = Number(value.toFixed(2))
            }
          }

          return {
            date: new Date(result.date).toLocaleDateString(),
            value,
          }
        } catch (err) {
          console.error('Error parsing Excel:', err)
          return {
            date: new Date(result.date).toLocaleDateString(),
            value: null,
          }
        }
      }),
    )

    setParsedResults(parsed)
  }

  useEffect(() => {
    if (selectedHeader && results.length > 0) {
      fetchAllSelectedValues()
    } else {
      setParsedResults([])
    }
  }, [selectedHeader, results])

  return (
    <Box direction="row" className="gap-6 flex flex-wrap mt-6 border-t pt-6">
      {/* Comparison Cards */}
      <div className="flex flex-wrap gap-4 flex-1">
        {selectedHeader && chartData.length > 0 ? (
          <ComparisonChart data={chartData} label={selectedHeader} />
        ) : (
          <Typography variant="body2" color="textSecondary" className="mt-2">
            Na zobrazenie porovnania hodnôt z viacerých testov si zvoľte položku napravo...
          </Typography>
        )}
      </div>

      {/* Selectable Header Filter */}
      <Box
        direction="col"
        className="w-full md:w-[20rem] bg-[#0983DB]/50! p-3 rounded-xl shadow-sm"
      >
        <Typography variant="subtitle2" className="mb-2 font-semibold">
          Vyber položky na porovnanie
        </Typography>
        <SelectableHeaderList
          headers={headers}
          selected={selectedHeader}
          setSelected={setSelectedHeader}
        />
      </Box>
    </Box>
  )
}

export default PnoeComparisonPanel
