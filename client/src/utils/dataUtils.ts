interface ChartData {
  name: string
  value: number
  color: string
}

interface ParsedData {
  key: string
  label: string
  value: string | number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFE', '#F882C2']

export const findLimitKey = (params: any, key: string, type: 'Lower' | 'Upper') => {
  return Object.keys(params).find(paramKey => {
    return (
      paramKey.includes(type) && // Must include "Lower" or "Upper"
      paramKey.includes(key.split(' ')[0]) // Match first word (e.g., TBW, BFM)
    )
  })
}

const findParamKey = (params: Record<string, string>, key: string) =>
  Object.keys(params).find(k => k.includes(key)) || null

export const mapChartData = (
  mapData: string[],
  parsedData: Record<string, string>[],
  params: Record<string, string>,
): ChartData[] => {
  if (!parsedData.length) return []

  return mapData
    .map((key, index) => {
      const paramKey = findParamKey(params, key)
      const label = paramKey ? params[paramKey] : key
      const rawValue = paramKey ? parsedData[0]?.[paramKey] : '0'
      const value = parseFloat(rawValue.replace(',', '.')) || 0

      return label !== 'Váha' ? { name: label, value, color: COLORS[index % COLORS.length] } : null
    })
    .filter(Boolean) as ChartData[]
}

export const mapParsedData = (
  mapData: string[],
  parsedData: Record<string, string>[],
  params: Record<string, string>,
): ParsedData[] => {
  if (!parsedData.length) return []

  return mapData.map(key => {
    const paramKey = findParamKey(params, key)
    return {
      key,
      label: paramKey ? params[paramKey] : key,
      value: paramKey ? (parsedData[0]?.[paramKey] ?? 'N/A') : 'N/A',
    }
  })
}
