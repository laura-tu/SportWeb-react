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
  name: string | null
  birth_date: string
  gender: string
  sport: Sport[]
  club?: Club | null | string
  createdAt: string
  updatedAt: string
}

export interface Coach {
  id: string
  user: User | string
  name: string | null
  sport: Sport[]
  sport_club?: Club | string | null
  athletes?: (string | Athlete)[] | null
  createdAt: string
  updatedAt: string
}

export interface Media {
  id: string
  title: string
  date: string
  user?: (string | null) | User
  alt?: string | null
  caption?:
    | {
        [k: string]: unknown
      }[]
    | null
  updatedAt: string
  createdAt: string
  url?: string | null
  filename?: string | null
  mimeType?: string | null
  filesize?: number | null
  width?: number | null
  height?: number | null
  focalX?: number | null
  focalY?: number | null
}

export interface CSportTest {
  id: string
  name: string
  short_name: string
  description?: string | null
  updatedAt: string
  createdAt: string
}

export interface TestResult {
  id: string
  athlete: string | Athlete
  coach?: (string | null) | Coach
  testType: string | CSportTest
  resultData: string | Media
  date: string
  notes?: string | null
  updatedAt: string
  createdAt: string
}
