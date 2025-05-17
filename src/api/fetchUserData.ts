import axios from 'axios'

const BASE_URL = 'http://localhost:3000/api'
const URL = `${BASE_URL}/users`

export const fetchUserData = async () => {
  const token = localStorage.getItem('token')
  if (!token) throw new Error('Token sa nenšiel')

  try {
    const response = await axios.get(`${URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data.user
  } catch {
    throw new Error('Načítanie údajov o používateľovi zlyhalo')
  }
}
