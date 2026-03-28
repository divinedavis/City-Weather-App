import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CITIES, getCity } from '@/lib/cities'
import type { Metadata } from 'next'

export const revalidate = 86400

const POPULAR_SLUGS = ['nyc','london','tokyo','paris','dubai','sydney','los-angeles','chicago','miami','barcelona','rome','amsterdam','singapore','bangkok','istanbul']

export const dynamicParams = true

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = getCity(citySlug)
  if (!city) return {}
  return {
    title: `${city.name} Weather Compared to Other Cities`,
    description: `Compare ${city.name} weather side by side with other major cities worldwide. See temperature, climate, and seasonal differences.`,
    alternates: { canonical: `https://cityweather.app/${city.slug}/compare` },
    openGraph: {
      title: `${city.name} Weather vs Other Cities`,
      description: `How does ${city.name} weather compare to London, Tokyo, NYC and other major cities?`,
      url: `https://cityweather.app/${city.slug}/compare`,
    },
  }
}

export default async function CityCompareHub({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city: citySlug } = await params
  const city = getCity(citySlug)
  if (!city) notFound()

  const otherCities = CITIES.filter((c) => c.slug !== citySlug)

  const popularCompareCities = otherCities.filter((c) => POPULAR_SLUGS.includes(c.slug))
  const otherCompareCities = otherCities.filter((c) => !POPULAR_SLUGS.includes(c.slug))

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'City Weather', item: 'https://cityweather.app/' },
      { '@type': 'ListItem', position: 2, name: `${city.name} Weather`, item: `https://cityweather.app/${city.slug}` },
      { '@type': 'ListItem', position: 3, name: `${city.name} Compare`, item: `https://cityweather.app/${city.slug}/compare` },
    ],
  }

  function compareUrl(a: string, b: string) {
    const sorted = [a, b].sort()
    return `/compare/${sorted[0]}/${sorted[1]}`
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <nav className="flex gap-2 text-sm text-blue-300 mb-8 flex-wrap">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <span>›</span>
          <Link href={`/${city.slug}`} className="hover:text-white transition">{city.name}</Link>
          <span>›</span>
          <span className="text-white">Compare</span>
        </nav>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{city.flag}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {city.name} Weather Compared to Other Cities
            </h1>
          </div>
          <p className="text-blue-300 text-sm">{city.country} · Weather Comparisons</p>
        </header>

        <section className="mb-8">
          <h2 className="text-white font-semibold mb-3">Compare {city.name} with Popular Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {popularCompareCities.map((other) => (
              <Link
                key={other.slug}
                href={compareUrl(citySlug, other.slug)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-3 text-sm text-blue-200 hover:text-white transition"
              >
                {other.flag} {city.name} vs {other.name} →
              </Link>
            ))}
          </div>
        </section>

        {otherCompareCities.length > 0 && (
          <section className="mb-8">
            <h2 className="text-white font-semibold mb-3">More Comparisons</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {otherCompareCities.slice(0, 30).map((other) => (
                <Link
                  key={other.slug}
                  href={compareUrl(citySlug, other.slug)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-3 text-sm text-blue-200 hover:text-white transition"
                >
                  {other.flag} {city.name} vs {other.name} →
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 text-center">
          <Link href={`/${city.slug}`} className="text-blue-300 hover:text-white text-sm transition">
            ← Back to {city.name} Weather
          </Link>
        </div>
      </main>
    </>
  )
}
