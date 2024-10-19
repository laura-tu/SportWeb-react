import { Request, Response } from 'express'
import dotenv from 'dotenv'
import CryptoJS from 'crypto-js'
import * as UserService from '../service/userService'
import jwt from 'jsonwebtoken'
import { LoginUserResponse } from '../service/userService'
import { Gender } from '../models/athleteModel'

// Load environment variables from .env file
dotenv.config()

const secretKey = process.env.JWT_SECRET // Use environment variable or replace with your secret key

// Create User Controller Function
export const createUserControllerFn = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.body)
    const userId = await UserService.createUserDBService(req.body) // Adjusted variable name to reflect returned value

    res.status(201).json({ userId, status: true, message: 'User created successfully' })
  } catch (err) {
    console.error(err) // Log the error
    res.status(500).send({ status: false, message: err.message }) // "Internal Server Error"
  }
}

// Login User Controller Function
export const loginUserControllerFn = async (req: Request, res: Response): Promise<void> => {
  try {
    const result: LoginUserResponse = await UserService.loginUserDBService(req.body) // Explicitly define type

    // Check if the login was successful
    if (result.status) {
      // Generate JWT token
      if (!secretKey) {
        throw new Error('Missing JWT_SECRET environment variable')
      }

      const token = jwt.sign({ email: req.body.email }, secretKey, { expiresIn: '20s' })
      res.cookie('token', token, { httpOnly: true }) // Set the JWT as a cookie

      // Construct the response data
      const responseData = {
        status: true,
        message: result.msg,
        user: {
          name: result.user?.name,
          surname: result.user?.surname,
          email: result.user?.email,
          role: result.user?.role,
        },
        athlete: {
          user_id: result.athlete?.user_id.toString(),
          day: result.athlete?.day,
          month: result.athlete?.month,
          year: result.athlete?.year,
          gender: result.athlete?.gender,
          sport: result.athlete?.sport,
          club: result.athlete?.club,
        },
      }

      // Include athlete data in the response if available
      if (result.athlete) {
        responseData.athlete = {
          user_id: result.athlete.user_id.toString(), // Ensure user_id is a string
          day: result.athlete.day,
          month: result.athlete.month,
          year: result.athlete.year,
          gender: result.athlete.gender,
          sport: result.athlete.sport,
          club: result.athlete.club,
        }
      }

      res.send(responseData)
    } else {
      res.send({ status: false, message: result.msg })
    }
  } catch (error) {
    console.error(error)
    res.send({ status: false, message: error.message })
  }
}

// Update User Controller Function
export const updateUserControllerFn = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.body)
    const { email, ...updateDetails } = req.body // Destructure to get email and other details
    const status = await UserService.updateUserDBService(updateDetails)

    res.send({ status: true, message: 'User updated successfully', user: status.user })
  } catch (err) {
    console.error(err)
    res.status(500).send({ status: false, message: err.message })
  }
}
