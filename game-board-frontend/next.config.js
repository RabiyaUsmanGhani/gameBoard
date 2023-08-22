/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },

  env: {
    // declare here all your variables
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  }
}

module.exports = nextConfig

 
