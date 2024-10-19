import React from 'react'

interface SuccessModalProps {
  onClose: () => void
  text: string
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose, text }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-60">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold">Len tak ďalej...</h2>
        <p>{text}</p>
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Zatvoriť
        </button>
      </div>
    </div>
  )
}

export default SuccessModal
