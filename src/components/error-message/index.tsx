import React from 'react'

interface ErrorMessageProps {
  message: string
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <p className="text-center mt-4 text-red-600 text-lg font-medium">{message}</p>
)
