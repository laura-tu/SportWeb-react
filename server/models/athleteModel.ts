import mongoose, { Document, Schema } from 'mongoose'

export enum Gender {
  Male = 'Muž',
  Female = 'Žena',
}

export interface IAthlete extends Document {
  user_id: mongoose.Types.ObjectId // Reference to the user model
  day: number // Day of birth
  month: number // Month of birth
  year: number // Year of birth
  gender: Gender // Gender of the athlete
  sport: string[] // Array of strings representing different sports
  club: string // Club name
}

const athleteSchema = new Schema<IAthlete>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: Object.values(Gender), // Use the enum values
    required: true,
  },
  sport: [
    {
      type: String, // Array of strings representing different sports
    },
  ],
  club: {
    type: String,
    required: true,
  },
})

// Export the model
const AthleteModel = mongoose.model<IAthlete>('Athlete', athleteSchema, 'athleteInfo')

export default AthleteModel
