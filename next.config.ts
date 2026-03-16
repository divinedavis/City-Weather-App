import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Redirect old nycweather.app borough pages → /nyc
      {
        source: '/:borough(manhattan|brooklyn|queens|bronx|staten-island)',
        destination: '/nyc',
        permanent: true,
      },
      // Redirect old nycweather.app neighborhood pages → /nyc/:neighborhood
      {
        source: '/:borough(manhattan|brooklyn|queens|bronx|staten-island)/:neighborhood',
        destination: '/nyc/:neighborhood',
        permanent: true,
      },
    ]
  },
}

export default nextConfig;
