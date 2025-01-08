import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const registerUser = async (userData: {
  name: string
  roles: string[]
  email: string
  password: string
}) => {
  const response = await axios.post('http://localhost:3000/api/users', userData)
  return response.data
}

export const loginUser = async (user: { email: string; password: string }) => {
  const response = await axios.post('http://localhost:3000/api/users/login', user)
  return response.data
}

export const fetchUserData = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('Token sa nenšiel')
  }

  try {
    const response = await axios.get('http://localhost:3000/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
    // Return the first user in the docs array
    return response.data.docs[0]
  } catch (error) {
    throw new Error('Načítanie údajov o používateľovi zlyhalo')
  }
}

export const fetchUser = async (userId: string) => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('Token sa nenašiel')
  }

  try {
    const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data // Adjust according to your API's response structure
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Načítanie údajov o používateľovi zlyhalo')
  }
}

export const useAuth = () => {
  const navigate = useNavigate()

  const signOut = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const signIn = () => {
    navigate('/')
  }

  return {
    signOut,
    signIn,
  }
}

export const updateUserData = async (userId: string, updateData: Record<string, any>) => {
  try {
    const response = await axios.patch(`http://localhost:3000/api/users/${userId}`, updateData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Nepodarilo sa načítať údaje o používateľovi')
  }
}
