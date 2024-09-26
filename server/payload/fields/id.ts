import type { Field } from 'payload/types'
import { populateId } from '../hooks/populateId'

export const idField = (): Field => ({
  name: 'id',
  type: 'text',
  admin: { hidden: true },
  hooks: {
    beforeChange: [populateId],
  },
})