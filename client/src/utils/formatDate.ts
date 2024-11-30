export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0]
}
