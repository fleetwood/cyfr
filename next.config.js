/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    swcPlugins: [
      [
        'next-superjson-plugin',
        {
          excluded: [],
        },
      ],
    ],
  },
  images: {
    domains: ['res.cloudinary.com']
  }
}