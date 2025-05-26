import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { Typography } from '@mui/material'
import Box from '@/components/box'
import SelectableHeaderList from '../selectable-header'
import ComparisonChart from '../comparison-chart'

interface ComparisonPanelProps {
  results: any[]
}

const getSelectedDataFromSheet = (headers: string[], values: any[], selectedHeaders: string[]) => {
  const data: Record<string, any> = {}

  selectedHeaders.forEach(header => {
    const index = headers.findIndex(h => h === header)
    if (index !== -1) {
      data[header] = values[index]
    }
  })

  return data
}

const InbodyComparisonPanel: React.FC<ComparisonPanelProps> = ({ results }) => {
  const [headers, setHeaders] = useState<string[]>([])
  const [selectedHeader, setSelectedHeader] = useState<string | null>(null)
  const [parsedResults, setParsedResults] = useState<
    { date: string; values: Record<string, any> }[]
  >([])

  useEffect(() => {
    const fetchHeaders = async () => {
      const res = await fetch(results[0].resultData.url)
      const arrayBuffer = await res.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

      const rawHeaders = jsonData[0] as string[]
      const cleaned = rawHeaders
        .map(header => (typeof header === 'string' ? header.replace(/^\d+\.\s*/, '').trim() : ''))
        .filter(
          header =>
            header &&
            ![
              'User',
              'Name',
              'Age',
              'Gender',
              'Mobile Number',
              'Phone Number',
              'Zip Code',
              'Address',
              'E-mail',
              'Memo',
              'Group',
              'Medical History',
            ].includes(header) &&
            !/id/i.test(header) && // filters out anything with "id"
            !/range/i.test(header) &&
            !/kHz/i.test(header) &&
            !/circumference/i.test(header) &&
            !/date/i.test(header),
        )
      setHeaders(cleaned)
    }

    if (results.length > 0) fetchHeaders()
  }, [results])

  useEffect(() => {
    const fetchAllSelectedValues = async () => {
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
            const values = jsonData[1] as any[]

            const selectedData = getSelectedDataFromSheet(
              cleanedHeaders,
              values,
              selectedHeader ? [selectedHeader] : [],
            )

            return {
              date: new Date(result.date).toLocaleDateString(),
              values: selectedData,
            }
          } catch (err) {
            console.error('Error parsing Excel:', err)
            return {
              date: new Date(result.date).toLocaleDateString(),
              values: {},
            }
          }
        }),
      )

      setParsedResults(parsed)
    }

    if (selectedHeader?.length > 0 && results.length > 0) {
      fetchAllSelectedValues()
    } else {
      setParsedResults([]) // clear if nothing selected
    }
  }, [selectedHeader, results])

  const chartData = parsedResults
    .map(r => {
      const rawValue = r.values[selectedHeader ?? '']
      let value = null

      if (typeof rawValue === 'string') {
        // Replace comma with dot and try to parse
        const normalized = parseFloat(rawValue.replace(',', '.'))
        value = isNaN(normalized) ? null : normalized
      } else if (typeof rawValue === 'number') {
        value = rawValue
      }

      return {
        date: r.date,
        value,
      }
    })
    .filter(d => d.value !== null)

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

export default InbodyComparisonPanel
