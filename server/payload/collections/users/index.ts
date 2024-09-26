import type { CollectionConfig } from 'payload/types'
import { idField } from '../../fields/id'

const Users: CollectionConfig = {
    slug: 'users',
    admin: {
      useAsTitle: 'email',
      defaultColumns: ['name', 'email'],
      //hidden: ({ user }) => !checkRole([Role.ADMIN], user as any),
    },
    labels: {
      singular: "Používateľ",//translate('labels.singular'),
     // plural: //translate('labels.plural'),
    },
    access: {
      read: () => true,
      create: () => true,
      update: () => true,
      delete: () => true,
      admin: () => true,
    },
    fields: [
        idField(),
        {
            name: 'name',
            label: "Meno",
            type: 'text',
            required: true,
        },
        {
            name: 'email',
            label: "Email",
            type: 'email',
            required: true,
        },
    ],
      timestamps: true,
}
    
export default Users


