export interface Sport {
  id: string
  name: string

  createdAt: string
  updatedAt: string
}

export interface Club {
  id: string
  name: string
  short_name: string
  sport: Sport[]

  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name?: string | null
  roles: ('admin' | 'user' | 'sportCoach')[] // Remove optional/nullability
  updatedAt: string
  createdAt: string
  email: string
  resetPasswordToken?: string | null
  resetPasswordExpiration?: string | null
  salt?: string | null
  hash?: string | null
  loginAttempts?: number | null
  lockUntil?: string | null
  password: string | null
}

export interface Athlete {
  id: string
  user: User | string
  name: string
  birth_date: string
  gender: string
  sport: Sport[]
  sport_club?: Club | null | string
  createdAt: string
  updatedAt: string
}

export interface Coach {
  id: string
  user: User | string
  sport: Sport[]
  sport_club?: Club | string | null
  athlete?: (string | Athlete)[] | null
  createdAt: string
  updatedAt: string
}
