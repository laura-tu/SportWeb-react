import UserModel, { IUser, UserRole } from '../models/userModel'
import AthleteModel from '../models/athleteModel'
import bcrypt from 'bcrypt'

interface UserDetails {
  name: string
  surname: string
  role: UserRole //enum
  email: string
  password: string
  terms: boolean
}

interface LoginUserDetails {
  email: string
  password: string
}

export interface LoginUserResponse {
  //používa sa?,skontrolovat pri loginUserControllerFn
  status: boolean
  msg: string
  user?: {
    name: string
    surname: string
    email: string
    role: UserRole
  }
  athlete?: {
    user_id: string
    day: number
    month: number
    year: number
    gender: string
    sport?: string[]
    club: string
  } | null // Allowing null explicitly
}
// Number of salt rounds for bcrypt hashing
const saltRounds = 10

// Create User DB Service
export const createUserDBService = async (userDetails: UserDetails): Promise<string> => {
  try {
    // Check if the email already exists in the database
    const existingUser = await UserModel.findOne({ email: userDetails.email })

    if (existingUser) {
      throw new Error('Email already exists')
    } else {
      // If the email is unique, hash the password and create the new user
      const hash = await bcrypt.hash(userDetails.password, saltRounds)
      const userModelData = new UserModel({
        name: userDetails.name,
        surname: userDetails.surname,
        role: userDetails.role,
        email: userDetails.email,
        password: hash, // Store hashed password
        terms: userDetails.terms,
      })

      await userModelData.save()
      return userModelData._id.toString() // Return the user ID
    }
  } catch (error) {
    console.error('Error creating user:', error)
    throw new Error('Internal Server Error')
  }
}

// Login User DB Service
export const loginUserDBService = async (
  userDetails: LoginUserDetails,
): Promise<LoginUserResponse> => {
  try {
    const result = await UserModel.findOne({ email: userDetails.email })

    if (!result) {
      throw { status: false, msg: 'Invalid User Details' }
    }

    const valid = await bcrypt.compare(userDetails.password, result.password)

    if (!valid) {
      throw { status: false, msg: 'User Validation Failed' }
    }

    // User authenticated successfully, fetch athlete data
    const athleteResult = await AthleteModel.findOne({ user_id: result._id })

    return {
      status: true,
      msg: 'User Validated Successfully',
      user: {
        name: result.name,
        surname: result.surname,
        email: result.email,
        role: result.role,
      },
      athlete: athleteResult
        ? {
            user_id: athleteResult.user_id.toString(), // Convert ObjectId to string
            day: athleteResult.day,
            month: athleteResult.month,
            year: athleteResult.year,
            gender: athleteResult.gender,
            sport: athleteResult.sport,
            club: athleteResult.club,
          }
        : null, // Set to null if athleteResult is null
    }
  } catch (error) {
    console.error('Error during login:', error)
    throw error // Rethrow the error to be caught in the controller
  }
}

// Update User DB Service
export const updateUserDBService = async (userDetails: UserDetails): Promise<{ user: IUser }> => {
  try {
    // Update the user details
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: userDetails.email },
      userDetails,
      { new: true },
    )

    if (!updatedUser) {
      throw new Error('User not found')
    } else {
      return { user: updatedUser }
    }
  } catch (error) {
    console.error('Error updating user:', error)
    throw new Error('Internal Server Error')
  }
}
