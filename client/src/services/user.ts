import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const registerUser = async (userData: {
  name: string
  role: string
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
    throw new Error('No token found')
  }

  try {
    const response = await axios.get('http://localhost:3000/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
    // Return the first user in the docs array
    return response.data.docs[0]
  } catch (error) {
    throw new Error('Failed to fetch user data')
  }
}

export const useAuth = () => {
  const navigate = useNavigate()

  const signOut = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return {
    signOut,
  }
}
