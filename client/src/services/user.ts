import axios from 'axios'

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
