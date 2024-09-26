import { buildConfig } from 'payload/config'
import dotenv from 'dotenv'
import path from 'path'
import { webpackBundler } from '@payloadcms/bundler-webpack'

import Users from './payload/collections/users'

dotenv.config()

export default buildConfig({
  admin: {
    user: Users.slug,
    css: path.resolve(__dirname, './global-overrides.scss'),
    bundler: webpackBundler(),
    /*components: {
      beforeLogin: [BeforeLogin],
      afterDashboard: [AfterDashboard],
      graphics: {
        Logo: Logo, // Login logo
        Icon: Logo,// Navbar logo
      },
      //providers: [QueryProvider, LoggerProvider],*/
    meta: {
      titleSuffix: 'sport web',
    },
  },
  collections: [Users],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
})
