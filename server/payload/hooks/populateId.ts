import { createId } from '@paralleldrive/cuid2'
import type { FieldHook } from 'payload/types'

// Hook to populate a unique ID for a field
export const populateId: FieldHook = async ({ operation, value }) => (
  operation === 'create' && (!value || process.env.PAYLOAD_SEED !== 'true') 
    ? createId() 
    : value
)

// Hook to populate a sibling field's ID
export const populateSiblingId =
  (field: string): FieldHook =>
  ({ siblingData, operation, value }) => (
    operation === 'create' 
      ? siblingData?.[field]?.id || siblingData?.[field] 
      : value
  )

// Hook to validate a sibling field's ID
export const validateSiblingId =
  (field: string, collection: string): FieldHook =>
  async ({ siblingData, req: { payload }, operation, value }) => {
    if (operation === 'create') {
      const id = siblingData?.[field]?.id || siblingData?.[field]

      const res = await payload.find({
        collection,
        limit: 1,
        depth: 0,
        where: { id: { equals: id } },
      })

      if (res.totalDocs > 0) {
        throw new Error('Conflict error: ID already exists')
      }

      return id
    }

    return value
  }
