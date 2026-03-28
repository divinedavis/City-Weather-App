import Link from 'next/link'
import { getWeather, capitalize } from '@/lib/weather'
import { Temp } from '@/components/Temp'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 600

const AIRPORTS: Record<string, { name: string; city: string; country: string; lat: number; lon: number; citySlug?: string }> = {
  jfk: { name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', lat: 40.6413, lon: -73.7781, citySlug: 'nyc' },
  lax: { name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', lat: 33.9425, lon: -118.4081, citySlug: 'los-angeles' },
  lhr: { name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom', lat: 51.4700, lon: -0.4543, citySlug: 'london' },
  cdg: { name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', lat: 49.0097, lon: 2.5479, citySlug: 'paris' },
  hnd: { name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan', lat: 35.5494, lon: 139.7798, citySlug: 'tokyo' },
  dxb: { name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', lat: 25.2532, lon: 55.3657, citySlug: 'dubai' },
  syd: { name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia', lat: -33.9399, lon: 151.1753, citySlug: 'sydney' },
  ord: { name: "O'Hare International Airport", city: 'Chicago', country: 'United States', lat: 41.9742, lon: -87.9073, citySlug: 'chicago' },
  mia: { name: 'Miami International Airport', city: 'Miami', country: 'United States', lat: 25.7959, lon: -80.2870, citySlug: 'miami' },
  sin: { name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', lat: 1.3644, lon: 103.9915, citySlug: 'singapore' },
}

export async function generateStaticParams() {
  return Object.keys(AIRPORTS).map((airport) => ({ airport }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ airport: string }>
}): Promise<Metadata> {
  const { airport: airportCode } = await params
  const airport = AIRPORTS[airportCode.toLowerCase()]
  if (!airport) return {}
  const code = airportCode.toUpperCase()
  return {
    title: `${code} Airport Weather Today | ${airport.name} Current Conditions`,
    description: `Live weather at ${airport.name} (${code}). Current temperature, wind speed, visibility and conditions for pilots and travelers.`,
    alternates: { canonical: `https://cityweather.app/weather/${airportCode.toLowerCase()}` },
    openGraph: {
      title: `${code} Airport Weather | ${airport.city} Airport Conditions`,
      description: `Current weather conditions at ${airport.name}: temperature, wind, visibility. Updated every 10 minutes.`,
      url: `https://cityweather.app/weather/${airportCode.toLowerCase()}`,
    },
  }
}

export default async function AirportWeatherPage({
  params,
}: {
  params: Promise<{ airport: string }>
}) {
  const { airport: airportParam } = await params
  const airportCode = airportParam.toLowerCase()
  const airport = AIRPORTS[airportCode]
  if (!airport) notFound()

  const code = airportParam.toUpperCase()
  const w = await getWeather(airport.lat, airport.lon)

  const airportSchema = {
    '@context': 'https://schema.org',
    '@type': 'Airport',
    name: airport.name,
    iataCode: code,
    address: { '@type': 'PostalAddress', addressLocality: airport.city, addressCountry: airport.country },
    geo: { '@type': 'GeoCoordinates', latitude: airport.lat, longitude: airport.lon },
    url: `https://cityweather.app/weather/${airportCode}`,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'City Weather', item: 'https://cityweather.app/' },
      { '@type': 'ListItem', position: 2, name: `${code} Airport Weather`, item: `https://cityweather.app/weather/${airportCode}` },
    ],
  }

  const updated = new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(airportSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <nav className="flex gap-2 text-sm text-blue-300 mb-8">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <span>›</span>
          <span className="text-white">{code} Airport Weather</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {code} Airport Weather Today
          </h1>
          <p className="text-blue-300 text-sm">{airport.name} · {airport.city}, {airport.country}</p>
          <p className="text-blue-400 text-xs mt-1">Updated: {updated}</p>
        </header>

        {w ? (
          <>
            <div className="bg-white/10 backdrop-blur rounded-3xl p-8 text-center mb-6">
              <img src={`https://openweathermap.org/img/wn/${w.icon}@4x.png`} alt={w.description} width={100} height={100} className="mx-auto" />
              <p className="text-8xl font-light text-white mb-2"><Temp value={w.temp} /></p>
              <p className="text-2xl text-blue-200 capitalize mb-1">{capitalize(w.description)}</p>
              <p className="text-blue-300">Feels like <Temp value={w.feels_like} /> · H <Temp value={w.temp_max} /> / L <Temp value={w.temp_min} /></p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
                <p className="text-blue-300 text-sm mb-1">Wind</p>
                <p className="text-white text-2xl font-light">{w.wind_speed} mph</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
                <p className="text-blue-300 text-sm mb-1">Visibility</p>
                <p className="text-white text-2xl font-light">{w.visibility} mi</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
                <p className="text-blue-300 text-sm mb-1">Humidity</p>
                <p className="text-white text-2xl font-light">{w.humidity}%</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
                <p className="text-blue-300 text-sm mb-1">Pressure</p>
                <p className="text-white text-2xl font-light">{w.pressure} hPa</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
                <p className="text-blue-300 text-sm mb-1">Cloud Cover</p>
                <p className="text-white text-2xl font-light">{w.clouds}%</p>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center mb-8">
            <p className="text-blue-200">Weather data temporarily unavailable.</p>
          </div>
        )}

        {airport.citySlug && (
          <div className="mt-6 text-center">
            <Link href={`/${airport.citySlug}`} className="text-blue-300 hover:text-white text-sm transition">
              View all {airport.city} neighborhood weather →
            </Link>
          </div>
        )}

        <section className="mt-10">
          <h2 className="text-white font-semibold mb-3">Other Airport Weather</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(AIRPORTS).filter(([k]) => k !== airportCode).map(([k, a]) => (
              <Link key={k} href={`/weather/${k}`} className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-3 text-sm text-blue-200 hover:text-white transition">
                {k.toUpperCase()} — {a.city}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
