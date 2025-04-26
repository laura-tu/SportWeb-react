export const calculateVSlopeThreshold = (
  data: { VO2: number; VCO2: number }[],
  maxVO2: number,
): number | null => {
  if (data.length < 10) return null // Ensure enough data points

  let thresholdVO2 = null

  // Určujeme bod anaeróbneho prahu na základe zmeny sklony a hodnoty VO2
  for (let i = 1; i < data.length; i++) {
    // Prvý segment (od začiatku po i)
    const segment1 = data.slice(0, i)
    const slope1 = linearRegressionSlope(segment1)

    // Druhý segment (od i po koniec)
    const segment2 = data.slice(i)
    const slope2 = linearRegressionSlope(segment2)

    // Ak je sklon druhého segmentu vyšší ako sklon prvého segmentu a hodnota VO2 presiahne 60%-80% maximálnej hodnoty VO2
    if (
      slope2 > slope1 &&
      data[i]['VO2(ml/min)'] >= maxVO2 * 0.6 &&
      data[i]['VO2(ml/min)'] <= maxVO2 * 0.8
    ) {
      thresholdVO2 = data[i]['VO2(ml/min)']
      break // Konečne nájdeme bod anaeróbneho prahu
    }
  }

  return thresholdVO2
}

const linearRegressionSlope = (points: { VO2: number; VCO2: number }[]): number => {
  const n = points.length
  if (n < 2) return 0 // Avoid division by zero

  const sumX = points.reduce((sum, p) => sum + p['VO2(ml/min)'], 0)
  const sumY = points.reduce((sum, p) => sum + p['VCO2(ml/min)'], 0)
  const sumXY = points.reduce((sum, p) => sum + p['VO2(ml/min)'] * p['VCO2(ml/min)'], 0)
  const sumX2 = points.reduce((sum, p) => sum + p['VCO2(ml/min)'] ** 2, 0)

  return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2)
}

export const convertToVO2ANPPerKg = (vo2ANP: number, bodyWeightKg: number) => {
  return vo2ANP / bodyWeightKg
}
