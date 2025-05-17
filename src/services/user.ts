import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const BASE_URL = 'http://localhost:3000/api'
const URL = `${BASE_URL}/users`

export const registerUser = async (userData: {
  name: string
  roles: string[]
  email: string
  password: string
}) => {
  const response = await axios.post(URL, userData)
  return response.data
}
//______________________________________________________________________________
export const loginUser = async (user: { email: string; password: string }) => {
  const response = await axios.post(`${URL}/login`, user)
  return response.data
}

export const handleLoginSuccess = (token: string) => {
  localStorage.setItem('token', token)
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
//______________________________________________________________________________

export const fetchUser = async (userId: string) => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('Token sa nenašiel')

  try {
    const response = await axios.get(`${URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
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
    const response = await axios.patch(`${URL}/${userId}`, updateData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    return response.data.user
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Nepodarilo sa načítať údaje o používateľovi')
  }
}

export interface UserPasswordData {
  password: string
}

/*export const updatePassword = async (userId: string, data: UserPasswordData): Promise<any> => {
  return ajax<any>('PUT', constructUrlWithParams(`${URL}/${userId}`, {}), data)
}*/ //CORS issue

export const updateUserPassword = async (userId: string, data: UserPasswordData) => {
  try {
    const response = await axios.patch(`${URL}/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Nepodarilo sa načítať údaje o používateľovi')
  }
}
