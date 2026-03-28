import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CITIES, getCity, getDistrict } from '@/lib/cities'
import type { Metadata } from 'next'

export const revalidate = 86400

const MONTHS = [
  'january','february','march','april','may','june',
  'july','august','september','october','november','december'
]

export const dynamicParams = true

export const dynamicParams = true

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; district: string; month: string }>
}): Promise<Metadata> {
  const { city: citySlug, district: districtSlug, month: monthSlug } = await params
  const city = getCity(citySlug)
  const district = getDistrict(citySlug, districtSlug)
  if (!city || !district || !MONTHS.includes(monthSlug)) return {}
  const monthName = monthSlug.charAt(0).toUpperCase() + monthSlug.slice(1)
  return {
    title: `${district.name} Weather in ${monthName} | ${city.name}`,
    description: `What's the weather like in ${district.name}, ${city.name} in ${monthName}? Average temps, rainfall, and what to expect in this neighborhood.`,
    alternates: { canonical: `https://cityweather.app/${city.slug}/${district.slug}/weather/${monthSlug}` },
    openGraph: {
      title: `${district.name} Weather in ${monthName} | ${city.name}`,
      description: `${monthName} weather in ${district.name}, ${city.name}: conditions, temperatures, and neighborhood tips.`,
      url: `https://cityweather.app/${city.slug}/${district.slug}/weather/${monthSlug}`,
    },
  }
}

export default async function DistrictMonthPage({
  params,
}: {
  params: Promise<{ city: string; district: string; month: string }>
}) {
  const { city: citySlug, district: districtSlug, month: monthSlug } = await params
  const city = getCity(citySlug)
  const district = getDistrict(citySlug, districtSlug)
  if (!city || !district || !MONTHS.includes(monthSlug)) notFound()

  const monthName = monthSlug.charAt(0).toUpperCase() + monthSlug.slice(1)
  const monthIndex = MONTHS.indexOf(monthSlug)
  const prevMonth = MONTHS[(monthIndex + 11) % 12]
  const nextMonth = MONTHS[(monthIndex + 1) % 12]

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'City Weather', item: 'https://cityweather.app/' },
      { '@type': 'ListItem', position: 2, name: `${city.name} Weather`, item: `https://cityweather.app/${city.slug}` },
      { '@type': 'ListItem', position: 3, name: `${district.name} Weather`, item: `https://cityweather.app/${city.slug}/${district.slug}` },
      { '@type': 'ListItem', position: 4, name: `${district.name} in ${monthName}`, item: `https://cityweather.app/${city.slug}/${district.slug}/weather/${monthSlug}` },
    ],
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
          <Link href={`/${city.slug}/${district.slug}`} className="hover:text-white transition">{district.name}</Link>
          <span>›</span>
          <span className="text-white">{monthName} Weather</span>
        </nav>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{city.flag}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {district.name} Weather in {monthName}
            </h1>
          </div>
          <p className="text-blue-300 text-sm">{district.name}, {city.name}, {city.country}</p>
        </header>

        <section className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-8">
          <h2 className="text-white font-semibold mb-2">About {district.name} in {monthName}</h2>
          <p className="text-blue-200 text-sm leading-relaxed">
            {district.description ?? `${district.name} is a neighborhood in ${city.name}.`}
          </p>
          <p className="text-blue-300 text-sm mt-3">
            For detailed monthly temperature and rainfall data for {city.name} in {monthName}, see the{' '}
            <Link href={`/${city.slug}/weather/${monthSlug}`} className="text-blue-300 hover:text-white underline">
              {city.name} {monthName} weather guide
            </Link>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-white font-semibold mb-3">All Months in {district.name}</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {MONTHS.map((m) => (
              <Link
                key={m}
                href={`/${city.slug}/${district.slug}/weather/${m}`}
                className={`rounded-xl p-2 text-center text-xs transition capitalize ${m === monthSlug ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20 text-blue-300 hover:text-white'}`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </Link>
            ))}
          </div>
        </section>

        <div className="flex gap-4 pt-6 border-t border-white/10 mb-8">
          <Link
            href={`/${city.slug}/${district.slug}/weather/${prevMonth}`}
            className="flex-1 text-center bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white rounded-xl py-3 text-sm transition capitalize"
          >
            ← {prevMonth.charAt(0).toUpperCase() + prevMonth.slice(1)}
          </Link>
          <Link
            href={`/${city.slug}/${district.slug}`}
            className="flex-1 text-center bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3 text-sm font-medium transition"
          >
            Live Weather
          </Link>
          <Link
            href={`/${city.slug}/${district.slug}/weather/${nextMonth}`}
            className="flex-1 text-center bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white rounded-xl py-3 text-sm transition capitalize"
          >
            {nextMonth.charAt(0).toUpperCase() + nextMonth.slice(1)} →
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link href={`/${city.slug}/weather/${monthSlug}`} className="text-blue-300 hover:text-white text-sm transition">
            View all {city.name} neighborhoods in {monthName} →
          </Link>
        </div>
      </main>
    </>
  )
}
