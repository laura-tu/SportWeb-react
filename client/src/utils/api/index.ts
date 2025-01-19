import qs from 'qs'
import { camelCase } from 'lodash'
import { runsOnServerSide } from '../index.ts'
import {
  Config,
  Post,
  Category,
  User,
  UAthlete,
  UCoach,
  Media,
  CSport,
  CSportClub,
  CSportTest,
  TestResult,
} from '../payload/payload-types.ts'

export type CollectionKey = keyof Config['collections']
export type Collection =
  | Post
  | Category
  | User
  | UAthlete
  | UCoach
  | Media
  | CSport
  | CSportClub
  | CSportTest
  | TestResult

export interface ApiGetList<T> {
  docs: T[]
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
  nextPage: number | null
  page: number
  pagingCounter: number
  prevPage: number | null
  totalDocs: number
  totalPages: number
}

export interface ApiResponse<T> {
  message: string
  doc: T
}

export class AjaxError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

type AjaxMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export const ajax = async <T>(method: AjaxMethod, url: string, data?: object): Promise<T> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, {
    method,
    credentials: runsOnServerSide() ? undefined : 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  })
  const body = await response.json()
  if (response.ok) {
    return body as T
  }
  const message = body?.message || response.statusText
  throw new AjaxError(response.status, camelCase(message))
}

export declare const VALID_OPERATORS: readonly [
  'equals',
  'contains',
  'not_equals',
  'in',
  'all',
  'not_in',
  'exists',
  'greater_than',
  'greater_than_equal',
  'less_than',
  'less_than_equal',
  'like',
  'within',
  'intersects',
  'near',
]

export type Operator = (typeof VALID_OPERATORS)[number]

export type WhereField = {
  [key in Operator]?: unknown
}
export type Where = {
  [key: string]: Where[] | WhereField | undefined | string | string[] | boolean
  and?: Where[]
  or?: Where[]
}

export interface URLParams {
  [key: string]: string | string[] | number | boolean | Where | undefined
}

export interface URLInfiniteParams extends Omit<URLParams, 'page'> {
  pagination: boolean
}

export type BaseParams = URLParams | URLInfiniteParams

export type ParamsWithId = { id: Id; depth?: number }

type Id = number | string

export const NO_LIMIT = 10_000

export const constructUrlWithParams = (url: string, params: BaseParams = {}): string => {
  const adjustedParams = { ...params }
  if ('pagination' in params && !params.pagination) {
    adjustedParams.limit = NO_LIMIT
  }
  const queryParams = qs.stringify(adjustedParams)
  const queryString = queryParams ? `?${queryParams}` : ''
  return `${url}${queryString}`
}

export const constructUrlWithId = (url: CollectionKey, params: ParamsWithId): string => {
  const { id, depth = 1 } = params
  return `${url}/${id}?${qs.stringify({ depth })}`
}
