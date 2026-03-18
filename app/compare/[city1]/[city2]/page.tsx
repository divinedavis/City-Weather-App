import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CITIES, getCity } from '@/lib/cities'
import { getWeather, capitalize } from '@/lib/weather'
import { Temp } from '@/components/Temp'
import { CITY_GUIDES } from '@/lib/guides'
import type { Metadata } from 'next'

export const revalidate = 600

// Generate the top comparison pairs by popularity
export async function generateStaticParams() {
  const popularSlugs = ['nyc', 'london', 'tokyo', 'paris', 'dubai', 'sydney', 'los-angeles', 'chicago', 'miami', 'barcelona', 'rome', 'amsterdam', 'singapore', 'bangkok', 'istanbul']
  const pairs: { city1: string; city2: string }[] = []
  for (let i = 0; i < popularSlugs.length; i++) {
    for (let j = i + 1; j < popularSlugs.length; j++) {
      pairs.push({ city1: popularSlugs[i], city2: popularSlugs[j] })
    }
  }
  // Also add all city vs nyc/london/tokyo pairs
  for (const city of CITIES) {
    if (!popularSlugs.includes(city.slug)) {
      pairs.push({ city1: 'nyc', city2: city.slug })
      pairs.push({ city1: 'london', city2: city.slug })
    }
  }
  return pairs
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city1: string; city2: string }>
}): Promise<Metadata> {
  const { city1: slug1, city2: slug2 } = await params
  const city1 = getCity(slug1)
  const city2 = getCity(slug2)
  if (!city1 || !city2) return {}
  return {
    title: `${city1.name} vs ${city2.name} Weather — Side-by-Side Climate Comparison`,
    description: `Compare weather in ${city1.name} vs ${city2.name}: current conditions, seasonal temperatures, climate differences, and which city has better weather.`,
    alternates: { canonical: `https://cityweather.app/compare/${slug1}/${slug2}` },
    openGraph: {
      title: `${city1.name} vs ${city2.name} Weather Comparison`,
      description: `Is ${city1.name} or ${city2.name} better for weather? Compare climates, seasons, and current conditions.`,
      url: `https://cityweather.app/compare/${slug1}/${slug2}`,
    },
  }
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ city1: string; city2: string }>
}) {
  const { city1: slug1, city2: slug2 } = await params
  const city1 = getCity(slug1)
  const city2 = getCity(slug2)
  if (!city1 || !city2 || slug1 === slug2) notFound()

  const [w1, w2] = await Promise.all([
    getWeather(city1.lat, city1.lon),
    getWeather(city2.lat, city2.lon),
  ])

  const guide1 = CITY_GUIDES[slug1]
  const guide2 = CITY_GUIDES[slug2]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Does ${city1.name} or ${city2.name} have better weather?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${city1.name} and ${city2.name} have very different climates. ${guide1?.climate ?? city1.description.slice(0, 100)} ${city2.name}: ${guide2?.climate ?? city2.description.slice(0, 100)}. The best city depends on your preferred season and temperature range.`,
        },
      },
      {
        '@type': 'Question',
        name: `When is the best time to visit ${city1.name} vs ${city2.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Best time for ${city1.name}: ${guide1?.bestMonths ?? 'spring and fall'}. Best time for ${city2.name}: ${guide2?.bestMonths ?? 'spring and fall'}.`,
        },
      },
    ],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'City Weather', item: 'https://cityweather.app/' },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: 'https://cityweather.app/compare' },
      { '@type': 'ListItem', position: 3, name: `${city1.name} vs ${city2.name}`, item: `https://cityweather.app/compare/${slug1}/${slug2}` },
    ],
  }

  // Popular comparison links
  const relatedComparisons = CITIES
    .filter((c) => c.slug !== slug1 && c.slug !== slug2)
    .slice(0, 8)
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      flag: c.flag,
      href1: `/compare/${slug1}/${c.slug}`,
      href2: `/compare/${slug2}/${c.slug}`,
    }))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <nav className="flex gap-2 text-sm text-blue-300 mb-8">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <span>›</span>
          <span className="text-white">{city1.name} vs {city2.name}</span>
        </nav>

        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {city1.flag} {city1.name} vs {city2.flag} {city2.name}
          </h1>
          <p className="text-blue-200 text-lg">Weather Comparison</p>
        </header>

        {(w1 || w2) && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">Current Weather Right Now</h2>
            <div className="grid grid-cols-2 gap-4">
              {[{ city: city1, w: w1 }, { city: city2, w: w2 }].map(({ city, w }) => (
                <div key={city.slug} className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center">
                  <p className="text-2xl mb-2">{city.flag}</p>
                  <h3 className="text-white font-bold mb-2">{city.name}</h3>
                  {w ? (
                    <>
                      <img src={`https://openweathermap.org/img/wn/${w.icon}@2x.png`} alt={w.description} width={60} height={60} className="mx-auto" />
                      <p className="text-white text-4xl font-light my-1"><Temp value={w.temp} /></p>
                      <p className="text-blue-200 capitalize text-sm">{capitalize(w.description)}</p>
                      <p className="text-blue-300 text-xs mt-1">Feels like <Temp value={w.feels_like} /></p>
                      <p className="text-blue-300 text-xs">H <Temp value={w.temp_max} /> / L <Temp value={w.temp_min} /></p>
                      <p className="text-blue-400 text-xs mt-1">Humidity: {w.humidity}%</p>
                    </>
                  ) : (
                    <p className="text-blue-300 text-sm">Weather unavailable</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Climate Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[{ city: city1, guide: guide1 }, { city: city2, guide: guide2 }].map(({ city, guide }) => (
              <div key={city.slug} className="bg-white/10 backdrop-blur rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{city.flag}</span>
                  <h3 className="text-white font-bold">{city.name}</h3>
                </div>
                {guide ? (
                  <>
                    <p className="text-blue-300 text-xs mb-3">{guide.climate}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-400">Best months</span>
                        <span className="text-green-300">{guide.bestMonths}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-400">Avoid</span>
                        <span className="text-red-300">{guide.avoidMonths}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-400">Annual rain</span>
                        <span className="text-blue-200">{guide.annualRainfall}</span>
                      </div>
                    </div>
                    <p className="text-blue-200 text-xs mt-3 leading-relaxed">{guide.overview}</p>
                  </>
                ) : (
                  <p className="text-blue-200 text-sm leading-relaxed">{city.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {(guide1 || guide2) && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">Seasonal Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-blue-400 text-xs">
                    <th className="text-left py-2 pr-4">Season</th>
                    <th className="text-center py-2 px-2">{city1.flag} {city1.name}</th>
                    <th className="text-center py-2 px-2">{city2.flag} {city2.name}</th>
                  </tr>
                </thead>
                <tbody className="text-blue-200">
                  {['Spring', 'Summer', 'Fall', 'Winter'].map((season) => {
                    const s1 = guide1?.seasons.find((s) => s.season.toLowerCase().includes(season.toLowerCase()))
                    const s2 = guide2?.seasons.find((s) => s.season.toLowerCase().includes(season.toLowerCase()))
                    if (!s1 && !s2) return null
                    return (
                      <tr key={season} className="border-t border-white/10">
                        <td className="py-3 pr-4 text-white font-medium">{season}</td>
                        <td className="py-3 px-2 text-center">
                          {s1 ? (
                            <div>
                              <p className="font-medium">{s1.avgTempF}</p>
                              <p className="text-xs text-blue-400">{s1.months}</p>
                            </div>
                          ) : <span className="text-blue-500">—</span>}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {s2 ? (
                            <div>
                              <p className="font-medium">{s2.avgTempF}</p>
                              <p className="text-xs text-blue-400">{s2.months}</p>
                            </div>
                          ) : <span className="text-blue-500">—</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">
            {city1.name} vs {city2.name}: Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-2xl p-5">
                <h3 className="text-white font-semibold text-sm mb-2">{faq.name}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">More Comparisons</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {relatedComparisons.map((c) => (
              <div key={c.slug} className="space-y-1">
                <Link
                  href={c.href1}
                  className="block bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl px-3 py-2 text-xs text-blue-200 hover:text-white transition"
                >
                  {city1.flag} vs {c.flag} {c.name}
                </Link>
                <Link
                  href={c.href2}
                  className="block bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl px-3 py-2 text-xs text-blue-200 hover:text-white transition"
                >
                  {city2.flag} vs {c.flag} {c.name}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
          <Link href={`/${city1.slug}`} className="text-center bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3 text-sm font-medium transition">
            {city1.flag} {city1.name} Weather →
          </Link>
          <Link href={`/${city2.slug}`} className="text-center bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3 text-sm font-medium transition">
            {city2.flag} {city2.name} Weather →
          </Link>
        </div>
      </main>
    </>
  )
}
