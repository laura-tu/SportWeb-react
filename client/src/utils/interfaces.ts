export interface Sport {
  id: string
  name: string

  createdAt: string
  updatedAt: string
}

export interface ClubSport {
  id: string
  name: string
  info: string

  createdAt: string
  updatedAt: string
}

export interface Club {
  id: string
  name: string
  short_name: string
  sport: ClubSport

  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  role: string

  createdAt: string
  updatedAt: string
}

export interface Athlete {
  id: string
  user: User | string
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

  createdAt: string
  updatedAt: string
}
