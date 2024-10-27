import React, { useState } from 'react'
import axios from 'axios'
import ErrorModal from '../error-modal/index.tsx'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { useNavigate } from 'react-router-dom'

const LoginForm: React.FC = () => {
  const [user, setUser] = useState({ email: '', password: '' })
  const [showErrorLoginModal, setShowErrorLoginModal] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  const LoginAthlete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const { data } = await axios.post('http://localhost:3000/api/users/login', user)

      if (data.token) {
        console.log('Login successful')

        localStorage.setItem('token', data.token)

        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

        navigate('/dashboard')
      } else {
        console.error('Login failed')
        setShowErrorLoginModal(true)
      }
    } catch (error) {
      console.log('Error during login:', error)

      // Check if the error response exists and show appropriate message
      if (axios.isAxiosError(error) && error.response) {
        setShowErrorLoginModal(true)
        console.error('Error response:', error.response.data)
      } else {
        setShowErrorLoginModal(true)
      }
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg border border-black max-w-md w-full text-black">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Prihlásenie</h1>
          <button className="text-red-600 text-2xl" onClick={() => setShowErrorLoginModal(false)}>
            <CloseOutlinedIcon />
          </button>
        </div>

        <form onSubmit={LoginAthlete}>
          <div className="mb-4">
            <input
              className="w-full p-2 border border-gray-300 rounded-md"
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="E-mail"
              required
            />
          </div>

          <div className="mb-4 relative">
            <input
              className="w-full p-2 border border-gray-300 rounded-md"
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Heslo"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? 'Hide' : 'Show'}
            </button>
          </div>

          <button className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600">
            PRIHLÁSIŤ SA
          </button>
        </form>
      </div>

      {/* Modal for login failure */}
      {
        showErrorLoginModal && (
          <ErrorModal
            onClose={() => setShowErrorLoginModal(false)}
            label={'Prihlasovanie zlyhalo'}
            text={'prihlasovaní'}
          />
        )
        /*(
        <p className="mt-2">
            Váš pokus o prihlásenie bol neúspešný. Skontrolujte svoje prihlasovacie údaje a skúste
            to znova. (chyba prihlasovacích údajov alebo servera)
        </p>
      )*/
      }
    </div>
  )
}

export default LoginForm
