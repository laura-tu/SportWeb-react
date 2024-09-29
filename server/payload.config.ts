import { buildConfig } from 'payload/config';

//import dotenv from 'dotenv';
import path from 'path';
import { webpackBundler } from '@payloadcms/bundler-webpack';

import Users from './payload/collections/users';

//dotenv.config();

export default buildConfig({
  admin: {
    user: Users.slug,
    //css: path.resolve(__dirname, 'client/tailwind.css'), 
    bundler: webpackBundler(), 

    meta: {
      titleSuffix: 'Sport Web', 
    },
  },

  collections: [Users], 

  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'), 
  },

});
