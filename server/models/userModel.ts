import mongoose, { Document, Schema } from 'mongoose'

export enum UserRole {
  Athlete = 'athlete',
  Coach = 'coach',
  Tester = 'tester',
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  surname: string
  role: UserRole
  email: string
  password: string
  terms: boolean
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  terms: {
    type: Boolean,
    required: true,
  },
})

// Export the model
const UserModel = mongoose.model<IUser>('User', userSchema, 'registrationUser')

export default UserModel
