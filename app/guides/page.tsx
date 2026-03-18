import Link from 'next/link'
import { CITIES } from '@/lib/cities'
import { CITY_GUIDES } from '@/lib/guides'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'City Weather Guides — Best Time to Visit Every City Worldwide',
  description: 'Weather guides for 44+ cities worldwide. Best time to visit, seasonal breakdowns, what to pack, and hyperlocal neighborhood climate tips for NYC, London, Tokyo, Paris, Dubai, Sydney and more.',
  alternates: { canonical: 'https://cityweather.app/guides' },
  openGraph: {
    title: 'City Weather Guides | Best Time to Visit Every Major City',
    description: 'Seasonal weather guides with packing tips and neighborhood climate insights for top cities worldwide.',
    url: 'https://cityweather.app/guides',
  },
}

const FEATURED_SLUGS = ['nyc', 'london', 'tokyo', 'paris', 'dubai', 'sydney', 'los-angeles', 'chicago', 'miami', 'barcelona', 'rome', 'amsterdam']

export default function GuidesPage() {
  const featured = CITIES.filter((c) => FEATURED_SLUGS.includes(c.slug))
  const rest = CITIES.filter((c) => !FEATURED_SLUGS.includes(c.slug))

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/" className="text-blue-300 hover:text-white text-sm mb-8 inline-block transition">
        ← Home
      </Link>

      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-3">City Weather Guides</h1>
        <p className="text-blue-200 text-lg">Best time to visit, seasonal tips & neighborhood climate guides</p>
        <p className="text-blue-300 text-sm mt-2">{CITIES.length} cities covered worldwide</p>
      </header>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-5">Featured City Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featured.map((city) => {
            const guide = CITY_GUIDES[city.slug]
            return (
              <Link
                key={city.slug}
                href={`/guides/${city.slug}`}
                className="bg-white/10 hover:bg-white/15 backdrop-blur rounded-2xl p-5 transition group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{city.flag}</span>
                  <div>
                    <h3 className="text-white font-semibold group-hover:text-blue-200 transition">{city.name} Weather Guide</h3>
                    <p className="text-blue-400 text-xs">{city.country}</p>
                  </div>
                </div>
                {guide ? (
                  <>
                    <p className="text-blue-200 text-xs leading-relaxed mb-3 line-clamp-2">{guide.overview}</p>
                    <div className="flex gap-4 text-xs">
                      <span className="text-green-400">✓ Best: {guide.bestMonths.split(',')[0].trim()}</span>
                      <span className="text-blue-400">{city.districts.length} neighborhoods</span>
                    </div>
                  </>
                ) : (
                  <p className="text-blue-300 text-xs">{city.description.slice(0, 120)}...</p>
                )}
              </Link>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-5">All City Weather Guides</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {rest.map((city) => {
            const guide = CITY_GUIDES[city.slug]
            return (
              <Link
                key={city.slug}
                href={`/guides/${city.slug}`}
                className="bg-white/10 hover:bg-white/15 backdrop-blur rounded-xl p-4 transition group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{city.flag}</span>
                  <h3 className="text-white text-sm font-medium group-hover:text-blue-200 transition">{city.name}</h3>
                </div>
                <p className="text-blue-400 text-xs">{city.country}</p>
                {guide && (
                  <p className="text-green-400 text-xs mt-1">Best: {guide.bestMonths.split(',')[0].trim()}</p>
                )}
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mt-12 bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
        <h2 className="text-white font-semibold mb-2">Real-Time Neighborhood Weather</h2>
        <p className="text-blue-200 text-sm mb-4">
          Each city guide links to live hyperlocal weather for every neighborhood — updated every 10 minutes.
        </p>
        <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-sm transition">
          See Live Weather →
        </Link>
      </section>
    </main>
  )
}
