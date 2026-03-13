import { notFound } from 'next/navigation'
import Link from 'next/link'
import { NEIGHBORHOODS, getNeighborhoodsByBorough } from '@/lib/neighborhoods'
import { getWeather, windDirection, capitalize } from '@/lib/weather'
import type { Metadata } from 'next'

export const revalidate = 600

export async function generateStaticParams() {
  return NEIGHBORHOODS.map((n) => ({
    borough: n.boroughSlug,
    neighborhood: n.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ borough: string; neighborhood: string }>
}): Promise<Metadata> {
  const { borough: boroughSlug, neighborhood: neighborhoodSlug } = await params
  const n = NEIGHBORHOODS.find(
    (n) => n.boroughSlug === boroughSlug && n.slug === neighborhoodSlug
  )
  if (!n) return {}
  return {
    title: `${n.name} Weather Today | ${n.borough}, NYC`,
    description: `Current weather in ${n.name}, ${n.borough}, New York City. Real-time temperature, humidity, wind, and forecast.`,
    alternates: { canonical: `https://nycweather.app/${n.boroughSlug}/${n.slug}` },
    openGraph: {
      title: `${n.name} Weather Today`,
      description: `Real-time weather for ${n.name}, ${n.borough}, NYC`,
      url: `https://nycweather.app/${n.boroughSlug}/${n.slug}`,
    },
  }
}

export default async function NeighborhoodPage({
  params,
}: {
  params: Promise<{ borough: string; neighborhood: string }>
}) {
  const { borough: boroughSlug, neighborhood: neighborhoodSlug } = await params
  const n = NEIGHBORHOODS.find(
    (n) => n.boroughSlug === boroughSlug && n.slug === neighborhoodSlug
  )
  if (!n) notFound()

  const w = await getWeather(n.lat, n.lon)
  const updated = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    dateStyle: 'full',
    timeStyle: 'short',
  })
  const nearby = getNeighborhoodsByBorough(boroughSlug)
    .filter((nb) => nb.slug !== neighborhoodSlug)
    .slice(0, 6)

  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${n.name} Weather Today`,
    description: `Current weather and forecast for ${n.name}, ${n.borough}, New York City.`,
    url: `https://nycweather.app/${n.boroughSlug}/${n.slug}`,
    about: {
      '@type': 'Place',
      name: `${n.name}, ${n.borough}, New York City`,
      geo: { '@type': 'GeoCoordinates', latitude: n.lat, longitude: n.lon },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex gap-3 text-sm text-blue-300 mb-8">
          <Link href="/" className="hover:text-white transition">NYC</Link>
          <span>/</span>
          <Link href={`/${n.boroughSlug}`} className="hover:text-white transition">{n.borough}</Link>
          <span>/</span>
          <span className="text-white">{n.name}</span>
        </div>

        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-1">{n.name} Weather</h1>
          <p className="text-blue-300 text-sm">{n.borough}, New York City · Updated {updated} ET</p>
        </header>

        {!w ? (
          <div className="text-center text-blue-200 py-20">
            <p>Weather data unavailable.</p>
          </div>
        ) : (
          <>
            <div className="bg-white/10 backdrop-blur rounded-3xl p-8 text-center mb-6">
              <img
                src={`https://openweathermap.org/img/wn/${w.icon}@4x.png`}
                alt={w.description}
                width={100}
                height={100}
                className="mx-auto"
              />
              <p className="text-8xl font-light text-white mb-2">{w.temp}°F</p>
              <p className="text-2xl text-blue-200 capitalize mb-1">{capitalize(w.description)}</p>
              <p className="text-blue-300">Feels like {w.feels_like}°F · H {w.temp_max}° / L {w.temp_min}°</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
                <p className="text-blue-300 text-sm mb-1">Humidity</p>
                <p className="text-white text-3xl font-light">{w.humidity}%</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
                <p className="text-blue-300 text-sm mb-1">Wind</p>
                <p className="text-white text-3xl font-light">{w.wind_speed} mph</p>
                <p className="text-blue-300 text-sm">{windDirection(w.wind_deg)}</p>
              </div>
            </div>
            <section className="bg-white/5 rounded-2xl p-6 text-blue-200 text-sm leading-relaxed">
              <h2 className="text-white font-semibold mb-2">{n.name} Weather Summary</h2>
              <p>
                {n.name} weather today is {w.temp}°F with {w.description}. The high will reach {w.temp_max}°F
                and the low will drop to {w.temp_min}°F. It feels like {w.feels_like}°F outside.
                Humidity is at {w.humidity}% with winds from the {windDirection(w.wind_deg)} at {w.wind_speed} mph.
              </p>
            </section>
          </>
        )}

        <nav className="mt-10">
          <p className="text-blue-300 text-sm mb-3">More {n.borough} Neighborhoods</p>
          <div className="flex flex-wrap gap-2">
            {nearby.map((nb) => (
              <Link
                key={nb.slug}
                href={`/${nb.boroughSlug}/${nb.slug}`}
                className="text-blue-200 hover:text-white text-sm px-3 py-1 bg-white/10 rounded-full hover:bg-white/20 transition"
              >
                {nb.name}
              </Link>
            ))}
          </div>
        </nav>
      </main>
    </>
  )
}
