import axios from 'axios'

export const fetchSportClubs = async () => {
  const response = await axios.get('http://localhost:3000/api/c_sport_club')
  return response.data.docs
}
