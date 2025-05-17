import React from 'react'
import { Loader } from 'lucide-react'

interface LoadingSpinnerProps {
  height?: string | number
  small?: boolean
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ height = '100vh', small = false }) => {
  if (small) {
    return (
      <Loader className="animate-spin text-blue-500" size={20} />
    )
  }

  return (
    <div
      className="flex justify-center items-center"
      style={{
        height: typeof height === 'string' ? height : `${height}px`,
      }}
    >
      <div className="absolute inset-0 bg-white opacity-80 z-50" style={{ height }} />
      <Loader className="animate-spin text-blue-400 z-50" size={48} />
    </div>
  )
}

export default LoadingSpinner
