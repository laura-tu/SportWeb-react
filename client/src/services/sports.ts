import axios from 'axios'

export const fetchSports = async () => {
  const response = await axios.get('http://localhost:3000/api/c_sport')
  return response.data.docs
}
