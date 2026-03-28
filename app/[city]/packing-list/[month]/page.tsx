import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CITIES, getCity } from '@/lib/cities'
import type { Metadata } from 'next'

export const revalidate = 86400

const MONTHS = [
  'january','february','march','april','may','june',
  'july','august','september','october','november','december'
]

const MONTH_TEMPS: Record<string, Record<string, { avgHighF: number; avgLowF: number }>> = {
  nyc: {
    january: { avgHighF: 38, avgLowF: 26 }, february: { avgHighF: 41, avgLowF: 28 },
    march: { avgHighF: 50, avgLowF: 35 }, april: { avgHighF: 61, avgLowF: 45 },
    may: { avgHighF: 72, avgLowF: 55 }, june: { avgHighF: 80, avgLowF: 64 },
    july: { avgHighF: 85, avgLowF: 70 }, august: { avgHighF: 84, avgLowF: 69 },
    september: { avgHighF: 76, avgLowF: 62 }, october: { avgHighF: 65, avgLowF: 50 },
    november: { avgHighF: 53, avgLowF: 40 }, december: { avgHighF: 43, avgLowF: 31 },
  },
  london: {
    january: { avgHighF: 46, avgLowF: 38 }, february: { avgHighF: 48, avgLowF: 38 },
    march: { avgHighF: 52, avgLowF: 41 }, april: { avgHighF: 57, avgLowF: 44 },
    may: { avgHighF: 64, avgLowF: 50 }, june: { avgHighF: 69, avgLowF: 55 },
    july: { avgHighF: 73, avgLowF: 59 }, august: { avgHighF: 72, avgLowF: 59 },
    september: { avgHighF: 66, avgLowF: 54 }, october: { avgHighF: 57, avgLowF: 47 },
    november: { avgHighF: 50, avgLowF: 42 }, december: { avgHighF: 46, avgLowF: 38 },
  },
  tokyo: {
    january: { avgHighF: 50, avgLowF: 37 }, february: { avgHighF: 52, avgLowF: 38 },
    march: { avgHighF: 58, avgLowF: 44 }, april: { avgHighF: 66, avgLowF: 51 },
    may: { avgHighF: 74, avgLowF: 58 }, june: { avgHighF: 79, avgLowF: 66 },
    july: { avgHighF: 86, avgLowF: 73 }, august: { avgHighF: 90, avgLowF: 76 },
    september: { avgHighF: 83, avgLowF: 70 }, october: { avgHighF: 72, avgLowF: 58 },
    november: { avgHighF: 62, avgLowF: 48 }, december: { avgHighF: 53, avgLowF: 40 },
  },
}

function getPackingList(avgHighF: number | null, avgLowF: number | null, cityName: string, monthName: string): string[] {
  const items: string[] = []

  if (avgHighF === null) {
    return [
      'Check the local forecast before packing',
      'Layers for variable conditions',
      'Comfortable walking shoes',
      'Light rain jacket or umbrella',
      'Sunscreen and sunglasses',
      'Portable phone charger',
      'Travel adapter (if international)',
      'Reusable water bottle',
    ]
  }

  if (avgHighF < 35) {
    items.push('Heavy winter coat (essential)', 'Thermal base layers', 'Insulated waterproof boots', 'Scarf, gloves, and warm hat', 'Thick wool socks', 'Waterproof outer layer')
  } else if (avgHighF < 50) {
    items.push('Heavy winter coat or parka', 'Warm sweaters and fleece', 'Waterproof boots', 'Gloves and scarf', 'Layering pieces for variable temps', 'Warm hat')
  } else if (avgHighF < 65) {
    items.push('Medium-weight jacket', 'Sweaters and long sleeves', 'Light rain jacket', 'Comfortable walking shoes or ankle boots', 'Scarf for evenings')
  } else if (avgHighF < 80) {
    items.push('Light jacket or cardigan for evenings', 'T-shirts and comfortable tops', 'Light pants or jeans', 'Comfortable walking shoes', 'Light layer for air conditioning')
  } else {
    items.push('Light, breathable clothing', 'Shorts and summer tops', 'Comfortable sandals or sneakers', 'Sunscreen (SPF 30+)', 'Sunglasses and hat', 'Portable fan or cooling towel')
  }

  if (avgLowF !== null && avgLowF < 32) {
    items.push('Extra warm layer for below-freezing nights')
  }

  // Universal additions
  items.push(
    'Umbrella or compact rain jacket',
    'Comfortable walking shoes (you\'ll walk a lot)',
    'Reusable water bottle',
    'Portable phone charger / power bank',
    'Travel adapter (if international)',
    'Medications and first aid essentials',
    'Copies of travel documents'
  )

  return items
}

export const dynamicParams = true

export const dynamicParams = true

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; month: string }>
}): Promise<Metadata> {
  const { city: citySlug, month: monthSlug } = await params
  const city = getCity(citySlug)
  if (!city || !MONTHS.includes(monthSlug)) return {}
  const monthName = monthSlug.charAt(0).toUpperCase() + monthSlug.slice(1)
  return {
    title: `What to Pack for ${city.name} in ${monthName} — Weather Packing Guide`,
    description: `Packing list for ${city.name} in ${monthName}: what to wear, what to bring, and how to prepare for the weather. Temperature-based clothing recommendations.`,
    alternates: { canonical: `https://cityweather.app/${city.slug}/packing-list/${monthSlug}` },
    openGraph: {
      title: `${city.name} ${monthName} Packing List | What to Pack`,
      description: `What to bring to ${city.name} in ${monthName}. Clothing recommendations based on actual average temperatures.`,
      url: `https://cityweather.app/${city.slug}/packing-list/${monthSlug}`,
    },
  }
}

export default async function PackingListPage({
  params,
}: {
  params: Promise<{ city: string; month: string }>
}) {
  const { city: citySlug, month: monthSlug } = await params
  const city = getCity(citySlug)
  if (!city || !MONTHS.includes(monthSlug)) notFound()

  const monthName = monthSlug.charAt(0).toUpperCase() + monthSlug.slice(1)
  const cityTemps = MONTH_TEMPS[citySlug]
  const monthTemps = cityTemps?.[monthSlug]
  const packingItems = getPackingList(monthTemps?.avgHighF ?? null, monthTemps?.avgLowF ?? null, city.name, monthName)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'City Weather', item: 'https://cityweather.app/' },
      { '@type': 'ListItem', position: 2, name: `${city.name} Weather`, item: `https://cityweather.app/${city.slug}` },
      { '@type': 'ListItem', position: 3, name: `Packing List for ${monthName}`, item: `https://cityweather.app/${city.slug}/packing-list/${monthSlug}` },
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
          <span className="text-white">Packing List — {monthName}</span>
        </nav>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{city.flag}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              What to Pack for {city.name} in {monthName}
            </h1>
          </div>
          <p className="text-blue-300 text-sm">{city.country} · Weather Packing Guide</p>
        </header>

        {monthTemps && (
          <section className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-blue-400 text-xs mb-1">Avg High</p>
                <p className="text-white text-2xl font-bold">{monthTemps.avgHighF}°F</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-blue-400 text-xs mb-1">Avg Low</p>
                <p className="text-white text-2xl font-bold">{monthTemps.avgLowF}°F</p>
              </div>
            </div>
          </section>
        )}

        <section className="mb-8">
          <h2 className="text-white font-semibold mb-4">
            {city.name} {monthName} Packing Checklist
          </h2>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
            <ul className="space-y-3">
              {packingItems.map((item, i) => (
                <li key={i} className="text-blue-200 text-sm flex gap-3 items-start">
                  <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-white font-semibold mb-3">Monthly Packing Guides for {city.name}</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {MONTHS.map((m) => (
              <Link
                key={m}
                href={`/${city.slug}/packing-list/${m}`}
                className={`rounded-xl p-2 text-center text-xs transition capitalize ${m === monthSlug ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20 text-blue-300 hover:text-white'}`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-6 flex gap-3 flex-wrap">
          <Link href={`/${city.slug}/weather/${monthSlug}`} className="text-blue-300 hover:text-white text-sm transition">
            {city.name} {monthName} Weather →
          </Link>
          <Link href={`/${city.slug}`} className="text-blue-300 hover:text-white text-sm transition">
            Live {city.name} Weather →
          </Link>
        </div>
      </main>
    </>
  )
}
