// ErrorModal.tsx

import React from 'react'

interface ErrorModalProps {
  onClose: () => void
  text: string
  label?: string
}

const ErrorModal: React.FC<ErrorModalProps> = ({ onClose, label, text }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-60">
      <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg max-w-md w-full">
        {label ? (
          <h3 className="text-md font-semibold">{label}</h3>
        ) : (
          <h2 className="text-lg font-semibold">Error!</h2>
        )}
        <p>Vyskytol sa problém pri {text}. Prosím, skúste to znova neskôr.</p>
        <button
          className="mt-4 bg-red-700 text-white py-2 px-4 rounded hover:bg-red-800"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default ErrorModal
