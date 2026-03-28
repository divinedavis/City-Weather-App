import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CITIES, getCity } from '@/lib/cities'
import type { Metadata } from 'next'

export const revalidate = 86400

const SEASONS: Record<string, { months: string[]; monthNames: string[]; label: string; description: string }> = {
  spring: {
    months: ['march', 'april', 'may'],
    monthNames: ['March', 'April', 'May'],
    label: 'Spring',
    description: 'warming temperatures, blooming nature, and unpredictable weather',
  },
  summer: {
    months: ['june', 'july', 'august'],
    monthNames: ['June', 'July', 'August'],
    label: 'Summer',
    description: 'peak heat, long days, and outdoor activities',
  },
  fall: {
    months: ['september', 'october', 'november'],
    monthNames: ['September', 'October', 'November'],
    label: 'Fall',
    description: 'cooling temperatures, fall foliage, and crisp air',
  },
  winter: {
    months: ['december', 'january', 'february'],
    monthNames: ['December', 'January', 'February'],
    label: 'Winter',
    description: 'cold temperatures, shorter days, and potential snow or rain',
  },
}

const MONTH_TEMPS: Record<string, Record<string, { avgHighF: number; avgLowF: number; avgHighC: number; avgLowC: number }>> = {
  nyc: {
    january: { avgHighF: 38, avgLowF: 26, avgHighC: 3, avgLowC: -3 },
    february: { avgHighF: 41, avgLowF: 28, avgHighC: 5, avgLowC: -2 },
    march: { avgHighF: 50, avgLowF: 35, avgHighC: 10, avgLowC: 2 },
    april: { avgHighF: 61, avgLowF: 45, avgHighC: 16, avgLowC: 7 },
    may: { avgHighF: 72, avgLowF: 55, avgHighC: 22, avgLowC: 13 },
    june: { avgHighF: 80, avgLowF: 64, avgHighC: 27, avgLowC: 18 },
    july: { avgHighF: 85, avgLowF: 70, avgHighC: 29, avgLowC: 21 },
    august: { avgHighF: 84, avgLowF: 69, avgHighC: 29, avgLowC: 21 },
    september: { avgHighF: 76, avgLowF: 62, avgHighC: 24, avgLowC: 17 },
    october: { avgHighF: 65, avgLowF: 50, avgHighC: 18, avgLowC: 10 },
    november: { avgHighF: 53, avgLowF: 40, avgHighC: 12, avgLowC: 4 },
    december: { avgHighF: 43, avgLowF: 31, avgHighC: 6, avgLowC: -1 },
  },
  london: {
    january: { avgHighF: 46, avgLowF: 38, avgHighC: 8, avgLowC: 3 },
    february: { avgHighF: 48, avgLowF: 38, avgHighC: 9, avgLowC: 3 },
    march: { avgHighF: 52, avgLowF: 41, avgHighC: 11, avgLowC: 5 },
    april: { avgHighF: 57, avgLowF: 44, avgHighC: 14, avgLowC: 7 },
    may: { avgHighF: 64, avgLowF: 50, avgHighC: 18, avgLowC: 10 },
    june: { avgHighF: 69, avgLowF: 55, avgHighC: 21, avgLowC: 13 },
    july: { avgHighF: 73, avgLowF: 59, avgHighC: 23, avgLowC: 15 },
    august: { avgHighF: 72, avgLowF: 59, avgHighC: 22, avgLowC: 15 },
    september: { avgHighF: 66, avgLowF: 54, avgHighC: 19, avgLowC: 12 },
    october: { avgHighF: 57, avgLowF: 47, avgHighC: 14, avgLowC: 8 },
    november: { avgHighF: 50, avgLowF: 42, avgHighC: 10, avgLowC: 6 },
    december: { avgHighF: 46, avgLowF: 38, avgHighC: 8, avgLowC: 3 },
  },
  tokyo: {
    january: { avgHighF: 50, avgLowF: 37, avgHighC: 10, avgLowC: 3 },
    february: { avgHighF: 52, avgLowF: 38, avgHighC: 11, avgLowC: 3 },
    march: { avgHighF: 58, avgLowF: 44, avgHighC: 15, avgLowC: 7 },
    april: { avgHighF: 66, avgLowF: 51, avgHighC: 19, avgLowC: 11 },
    may: { avgHighF: 74, avgLowF: 58, avgHighC: 23, avgLowC: 15 },
    june: { avgHighF: 79, avgLowF: 66, avgHighC: 26, avgLowC: 19 },
    july: { avgHighF: 86, avgLowF: 73, avgHighC: 30, avgLowC: 23 },
    august: { avgHighF: 90, avgLowF: 76, avgHighC: 32, avgLowC: 24 },
    september: { avgHighF: 83, avgLowF: 70, avgHighC: 28, avgLowC: 21 },
    october: { avgHighF: 72, avgLowF: 58, avgHighC: 22, avgLowC: 14 },
    november: { avgHighF: 62, avgLowF: 48, avgHighC: 17, avgLowC: 9 },
    december: { avgHighF: 53, avgLowF: 40, avgHighC: 12, avgLowC: 4 },
  },
}

export async function generateStaticParams() {
  const seasons = Object.keys(SEASONS)
  return CITIES.flatMap((c) => seasons.map((season) => ({ city: c.slug, season })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; season: string }>
}): Promise<Metadata> {
  const { city: citySlug, season: seasonSlug } = await params
  const city = getCity(citySlug)
  const seasonData = SEASONS[seasonSlug]
  if (!city || !seasonData) return {}
  const seasonLabel = seasonData.label
  return {
    title: `${city.name} Weather in ${seasonLabel} — What to Expect`,
    description: `Complete guide to ${city.name} ${seasonLabel.toLowerCase()} weather: temperatures, rainfall, what to pack, and neighborhood tips. Covers ${seasonData.monthNames.join(', ')}.`,
    alternates: { canonical: `https://cityweather.app/${city.slug}/weather/season/${seasonSlug}` },
    openGraph: {
      title: `${city.name} ${seasonLabel} Weather Guide`,
      description: `${city.name} in ${seasonLabel.toLowerCase()}: average temperatures, what to expect, and packing tips for ${seasonData.monthNames.join(', ')}.`,
      url: `https://cityweather.app/${city.slug}/weather/season/${seasonSlug}`,
    },
  }
}

export default async function SeasonWeatherPage({
  params,
}: {
  params: Promise<{ city: string; season: string }>
}) {
  const { city: citySlug, season: seasonSlug } = await params
  const city = getCity(citySlug)
  const seasonData = SEASONS[seasonSlug]
  if (!city || !seasonData) notFound()

  const cityTemps = MONTH_TEMPS[citySlug]
  const seasonTemps = seasonData.months.map((m) => cityTemps?.[m])
  const hasTemps = seasonTemps.some(Boolean)

  const avgHighF = hasTemps
    ? Math.round(seasonTemps.filter(Boolean).reduce((s, t) => s + t!.avgHighF, 0) / seasonTemps.filter(Boolean).length)
    : null
  const avgLowF = hasTemps
    ? Math.round(seasonTemps.filter(Boolean).reduce((s, t) => s + t!.avgLowF, 0) / seasonTemps.filter(Boolean).length)
    : null
  const avgHighC = hasTemps
    ? Math.round(seasonTemps.filter(Boolean).reduce((s, t) => s + t!.avgHighC, 0) / seasonTemps.filter(Boolean).length)
    : null
  const avgLowC = hasTemps
    ? Math.round(seasonTemps.filter(Boolean).reduce((s, t) => s + t!.avgLowC, 0) / seasonTemps.filter(Boolean).length)
    : null

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${city.name} Weather in ${seasonData.label} — What to Expect`,
    description: `Guide to ${city.name} ${seasonData.label.toLowerCase()} weather covering ${seasonData.monthNames.join(', ')}.`,
    url: `https://cityweather.app/${city.slug}/weather/season/${seasonSlug}`,
    about: { '@type': 'City', name: city.name },
    datePublished: '2026-01-01T00:00:00Z',
    dateModified: '2026-01-01T00:00:00Z',
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'City Weather', item: 'https://cityweather.app/' },
      { '@type': 'ListItem', position: 2, name: `${city.name} Weather`, item: `https://cityweather.app/${city.slug}` },
      { '@type': 'ListItem', position: 3, name: `${city.name} ${seasonData.label} Weather`, item: `https://cityweather.app/${city.slug}/weather/season/${seasonSlug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <nav className="flex gap-2 text-sm text-blue-300 mb-8 flex-wrap">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <span>›</span>
          <Link href={`/${city.slug}`} className="hover:text-white transition">{city.name}</Link>
          <span>›</span>
          <span className="text-white">{seasonData.label} Weather</span>
        </nav>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{city.flag}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {city.name} Weather in {seasonData.label}
            </h1>
          </div>
          <p className="text-blue-300 text-sm">{city.country} · {seasonData.monthNames.join(', ')}</p>
        </header>

        <section className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-8">
          <p className="text-blue-200 text-sm leading-relaxed">
            {city.name} in {seasonData.label.toLowerCase()} brings {seasonData.description}. 
            {hasTemps && avgHighF && avgLowF
              ? ` Average temperatures range from ${avgLowF}°F (${avgLowC}°C) at night to ${avgHighF}°F (${avgHighC}°C) during the day.`
              : ` Check the monthly pages below for detailed temperature and rainfall data.`}
          </p>
        </section>

        {hasTemps && (
          <section className="mb-8">
            <h2 className="text-white font-semibold mb-3">Monthly Temperature Breakdown</h2>
            <div className="grid grid-cols-3 gap-3">
              {seasonData.months.map((month, i) => {
                const t = cityTemps?.[month]
                return (
                  <Link key={month} href={`/${city.slug}/weather/${month}`} className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-4 text-center transition">
                    <p className="text-blue-300 text-xs mb-1 capitalize">{seasonData.monthNames[i]}</p>
                    {t ? (
                      <>
                        <p className="text-white text-lg font-bold">{t.avgHighF}°F</p>
                        <p className="text-blue-300 text-xs">{t.avgHighC}°C high</p>
                        <p className="text-blue-200 text-xs mt-1">{t.avgLowF}°F low</p>
                      </>
                    ) : (
                      <p className="text-blue-200 text-xs mt-1">View details →</p>
                    )}
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        <section className="mb-8">
          <h2 className="text-white font-semibold mb-3">Monthly Guides for {city.name} {seasonData.label}</h2>
          <div className="grid grid-cols-3 gap-3">
            {seasonData.months.map((month, i) => (
              <Link
                key={month}
                href={`/${city.slug}/weather/${month}`}
                className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-4 text-center text-blue-200 hover:text-white transition capitalize"
              >
                {seasonData.monthNames[i]} Weather →
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-white font-semibold mb-3">Other Seasons in {city.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(SEASONS).filter(([s]) => s !== seasonSlug).map(([s, data]) => (
              <Link
                key={s}
                href={`/${city.slug}/weather/season/${s}`}
                className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-3 text-center text-blue-200 hover:text-white transition capitalize text-sm"
              >
                {data.label}
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link href={`/${city.slug}`} className="text-blue-300 hover:text-white text-sm transition">
            ← Live {city.name} Weather
          </Link>
        </div>
      </main>
    </>
  )
}
