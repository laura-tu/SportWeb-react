import AthleteModel, { IAthlete } from '../models/athleteModel' // Import the IAthlete interface
import UserModel from '../models/userModel'

export interface AthleteDetails {
  user_id: string // Adjust the type based on your actual user ID type
  day: number
  month: number
  year: number
  gender: string // Consider using an enum for gender
  sport: string
  club: string
}


export const createAthleteDBService = async (
  athleteDetails: AthleteDetails,
): Promise<{ athlete: IAthlete }> => {
  // Change the return type
  try {
    const newAthlete = await AthleteModel.create({
      user_id: athleteDetails.user_id,
      day: athleteDetails.day,
      month: athleteDetails.month,
      year: athleteDetails.year,
      gender: athleteDetails.gender,
      sport: athleteDetails.sport,
      club: athleteDetails.club,
    })

    return { athlete: newAthlete }
  } catch (error) {
    console.error('Error creating athlete:', error)
    throw new Error('Internal Server Error')
  }
}

export const updateAthleteDBService = async (
  userEmail: string,
  athleteDetails: Partial<AthleteDetails>,
): Promise<{ athlete: IAthlete } | null> => {
  // Change the return type
  try {
    // Find the user by email
    const user = await UserModel.findOne({ email: userEmail })

    if (!user) {
      throw new Error('User not found')
    }

    // Update the athlete details using the found user's ID
    const updatedAthlete = (await AthleteModel.findOneAndUpdate(
      { user_id: user._id },
      athleteDetails,
      { new: true },
    )) as IAthlete // Assert type as IAthlete

    if (!updatedAthlete) {
      throw new Error('Athlete not found')
    } else {
      return { athlete: updatedAthlete } 
    }
  } catch (error) {
    console.error('Error updating athlete:', error)
    throw new Error('Internal Server Error')
  }
}
