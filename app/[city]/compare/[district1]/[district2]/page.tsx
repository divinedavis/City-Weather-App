import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CITIES, getCity, getDistrict } from '@/lib/cities'
import { getWeather } from '@/lib/weather'
import { Temp } from '@/components/Temp'
import type { Metadata } from 'next'

export const revalidate = 600

// Top 10 cities by district count
function getTopCities() {
  return [...CITIES].sort((a, b) => b.districts.length - a.districts.length).slice(0, 10)
}

export async function generateStaticParams() {
  const params: { city: string; district1: string; district2: string }[] = []
  for (const city of getTopCities()) {
    const top = city.districts.slice(0, 10)
    for (let i = 0; i < top.length; i++) {
      for (let j = i + 1; j < top.length; j++) {
        params.push({ city: city.slug, district1: top[i].slug, district2: top[j].slug })
      }
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; district1: string; district2: string }>
}): Promise<Metadata> {
  const { city: citySlug, district1: d1Slug, district2: d2Slug } = await params
  const city = getCity(citySlug)
  const d1 = getDistrict(citySlug, d1Slug)
  const d2 = getDistrict(citySlug, d2Slug)
  if (!city || !d1 || !d2) return {}
  const url = `https://cityweather.app/${city.slug}/compare/${d1.slug}/${d2.slug}`
  return {
    title: `${d1.name} vs ${d2.name} Weather | ${city.name} Neighborhood Comparison`,
    description: `Compare weather in ${d1.name} vs ${d2.name} in ${city.name}. Side-by-side current conditions, microclimate differences, and what makes each neighborhood unique.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${d1.name} vs ${d2.name} Weather — ${city.name}`,
      description: `Is ${d1.name} or ${d2.name} warmer? Compare hyperlocal weather side by side.`,
      url,
    },
  }
}

export default async function DistrictComparePage({
  params,
}: {
  params: Promise<{ city: string; district1: string; district2: string }>
}) {
  const { city: citySlug, district1: d1Slug, district2: d2Slug } = await params
  const city = getCity(citySlug)
  const d1 = getDistrict(citySlug, d1Slug)
  const d2 = getDistrict(citySlug, d2Slug)
  if (!city || !d1 || !d2) notFound()

  const [w1, w2] = await Promise.all([
    getWeather(d1.lat, d1.lon),
    getWeather(d2.lat, d2.lon),
  ])

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'City Weather', item: 'https://cityweather.app/' },
      { '@type': 'ListItem', position: 2, name: `${city.name} Weather`, item: `https://cityweather.app/${city.slug}` },
      { '@type': 'ListItem', position: 3, name: 'Compare', item: `https://cityweather.app/${city.slug}/compare/${d1.slug}/${d2.slug}` },
      { '@type': 'ListItem', position: 4, name: `${d1.name} vs ${d2.name}`, item: `https://cityweather.app/${city.slug}/compare/${d1.slug}/${d2.slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <nav className="text-sm text-blue-400 mb-8">
            <Link href="/" className="hover:text-blue-200">City Weather</Link>
            <span className="mx-2 text-slate-500">/</span>
            <Link href={`/${city.slug}`} className="hover:text-blue-200">{city.name}</Link>
            <span className="mx-2 text-slate-500">/</span>
            <span className="text-slate-300">{d1.name} vs {d2.name}</span>
          </nav>

          <h1 className="text-4xl font-bold mb-2">
            {d1.name} vs {d2.name}
          </h1>
          <p className="text-blue-300 text-lg mb-10">
            {city.flag} {city.name} neighborhood weather comparison
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {[{ d: d1, w: w1 }, { d: d2, w: w2 }].map(({ d, w }) => (
              <div key={d.slug} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <Link href={`/${city.slug}/${d.slug}`} className="hover:text-blue-300 transition-colors">
                  <h2 className="text-2xl font-bold mb-1">{d.name}</h2>
                </Link>
                <p className="text-slate-400 text-sm mb-4">{city.name}, {city.country}</p>
                {w ? (
                  <>
                    <div className="text-5xl font-bold mb-2">
                      <Temp value={w.temp} />
                    </div>
                    <div className="text-blue-300 capitalize mb-4">{w.description}</div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-slate-400">Feels like</div>
                        <div className="font-semibold"><Temp value={w.feels_like} /></div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-slate-400">Humidity</div>
                        <div className="font-semibold">{w.humidity}%</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-slate-400">Wind</div>
                        <div className="font-semibold">{Math.round(w.wind_speed)} mph</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-slate-400">Cloud cover</div>
                        <div className="font-semibold">{w.clouds}%</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-slate-400">Weather data unavailable</div>
                )}
                {d.description && (
                  <p className="text-slate-400 text-sm mt-4 leading-relaxed">{d.description}</p>
                )}
                <Link
                  href={`/${city.slug}/${d.slug}`}
                  className="inline-block mt-4 text-blue-400 hover:text-blue-200 text-sm"
                >
                  Full {d.name} weather →
                </Link>
              </div>
            ))}
          </div>

          {w1 && w2 && (
            <section className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Current Difference</h2>
              <div className="flex items-center gap-4">
                <span className="text-slate-300">
                  {d1.name} is{' '}
                  <strong className={`text-lg ${Math.abs(w1.temp - w2.temp) < 1 ? 'text-white' : w1.temp > w2.temp ? 'text-orange-400' : 'text-blue-400'}`}>
                    {w1.temp === w2.temp ? 'the same temperature as' :
                      `${Math.abs(Math.round(w1.temp - w2.temp))}°F ${w1.temp > w2.temp ? 'warmer' : 'cooler'} than`}
                  </strong>
                  {' '}{d2.name} right now.
                </span>
              </div>
            </section>
          )}

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">More {city.name} Comparisons</h2>
            <div className="flex flex-wrap gap-2">
              {city.districts.slice(0, 8).filter(d => d.slug !== d1.slug && d.slug !== d2.slug).map((d) => (
                <Link
                  key={d.slug}
                  href={`/${city.slug}/compare/${d1.slug}/${d.slug}`}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm transition-colors"
                >
                  {d1.name} vs {d.name}
                </Link>
              ))}
            </div>
          </section>

          <div className="border-t border-white/10 pt-6">
            <Link href={`/${city.slug}`} className="text-blue-400 hover:text-blue-200 text-sm">
              ← All {city.name} neighborhoods
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
