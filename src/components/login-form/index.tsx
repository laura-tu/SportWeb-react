import React, { useState } from 'react'
import axios from 'axios'
import ErrorModal from '../error-modal/index'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { useNavigate } from 'react-router-dom'
import CustomTextField from '../custom-textfield/index'
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined'
import KeyIcon from '@mui/icons-material/Key'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import Button from '@mui/material/Button'
import { loginUser } from '../../services/user'
import { showErrorToast } from '../ui/sonner'

interface User {
  email: string
  password: string
}

interface LoginFormProps {
  onClose: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const [user, setUser] = useState<User>({ email: '', password: '' })
  const [passwordVisible, setPasswordVisible] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  const loginAthlete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  
    try {
      const data = await loginUser(user)
  
      if (data.token) {
        localStorage.setItem('token', data.token)
  
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        onClose()
  
        navigate('/dashboard')
        window.location.reload()
      } else {
        console.error('Prihlasovanie zlyhalo')
        showErrorToast() 
      }
    } catch (error) {
      //console.log('Chyba počas prihlasovania:', error)
  
      if (axios.isAxiosError(error) && error.response) {
        showErrorToast(error.response.data.message || 'Niečo sa pokazilo. Skúste to znova neskôr!')
        console.error('Chyba:', error.response.data)
      } else {
        showErrorToast('Niečo sa pokazilo. Skúste to znova neskôr!')
      }
    }
  }


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg border border-black max-w-md w-full text-black">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold ">Prihlásenie</h1>
          <button className="text-red-600 text-2xl hover:cursor-pointer" onClick={onClose}>
            <CloseOutlinedIcon />
          </button>
        </div>

        <form onSubmit={loginAthlete}>
          <div className="mb-5">
            <CustomTextField
              name="email"
              label="E-mail"
              value={user.email}
              onChange={handleChange}
              icon={<AlternateEmailOutlinedIcon />}
            />
          </div>

          <div className="mb-8 relative">
            <CustomTextField
              name="password"
              label="Heslo"
              value={user.password}
              onChange={handleChange}
              type={passwordVisible ? 'text' : 'password'}
              icon={<KeyIcon />}
            />
            <button
              type="button"
              className="absolute right-2 top-3 text-gray-500"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
            </button>
          </div>

          <Button
            variant="contained"
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
          >
            PRIHLÁSIŤ SA
          </Button>
        </form>
      </div>

    </div>
  )
}

export default LoginForm
