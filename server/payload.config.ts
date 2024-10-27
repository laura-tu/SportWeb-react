import { buildConfig } from 'payload/config'
import dotenv from 'dotenv'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { slateEditor } from '@payloadcms/richtext-slate'
import bcrypt from 'bcrypt'
import { webpackBundler } from '@payloadcms/bundler-webpack'

dotenv.config()

export default buildConfig({
  admin: {
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGO_URI as string,
  }),
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:5000',
  // Required: Collections configuration (Example: Users collection)
  collections: [
    {
      slug: 'users',
      auth: true, // Enable authentication for this collection
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'password',
          type: 'text',
          required: true,
        },
      ],
      hooks: {
        beforeChange: [
          async ({ data }) => {
            if (data.password) {
              data.password = await bcrypt.hash(data.password, 10) // Hash the password
            }
            return data
          },
        ],
      },
    },
  ],
})
