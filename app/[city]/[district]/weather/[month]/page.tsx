import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CITIES, getCity, getDistrict } from '@/lib/cities'
import { getWeather, capitalize } from '@/lib/weather'
import { Temp } from '@/components/Temp'
import type { Metadata } from 'next'

export const dynamic = "force-dynamic"

export const revalidate = 3600

const MONTHS = [
  'january','february','march','april','may','june',
  'july','august','september','october','november','december'
]

// City-level monthly climate data (re-used from city monthly page)
const CITY_MONTH_DATA: Record<string, Record<string, {
  avgHighF: number; avgLowF: number; avgHighC: number; avgLowC: number;
  description: string; rainfall: string; sunshine: string;
}>> = {
  nyc: {
    january:   { avgHighF: 38, avgLowF: 26, avgHighC: 3,  avgLowC: -3, description: 'Cold and sometimes snowy. Wind chill near the waterfront can be brutal. Pack heavy winter gear.', rainfall: '3.5 in (89mm)', sunshine: '4.5 hrs/day' },
    february:  { avgHighF: 41, avgLowF: 28, avgHighC: 5,  avgLowC: -2, description: 'Still cold with occasional nor\'easters. Daylight slowly increasing.', rainfall: '3.0 in (76mm)', sunshine: '5.5 hrs/day' },
    march:     { avgHighF: 50, avgLowF: 35, avgHighC: 10, avgLowC: 2,  description: 'Transition month — unpredictable. Can see snow early and 60°F days late.', rainfall: '4.0 in (102mm)', sunshine: '6.5 hrs/day' },
    april:     { avgHighF: 61, avgLowF: 45, avgHighC: 16, avgLowC: 7,  description: 'Spring arrives. Cherry blossoms peak in Central Park mid-April. Jackets still needed.', rainfall: '4.3 in (109mm)', sunshine: '7.5 hrs/day' },
    may:       { avgHighF: 72, avgLowF: 55, avgHighC: 22, avgLowC: 13, description: 'Excellent weather. Warm enough for outdoor dining. Low humidity.', rainfall: '4.0 in (102mm)', sunshine: '8.5 hrs/day' },
    june:      { avgHighF: 80, avgLowF: 64, avgHighC: 27, avgLowC: 18, description: 'Warm and humid. Summer beaches open. Afternoon thunderstorms possible.', rainfall: '3.8 in (97mm)', sunshine: '9.5 hrs/day' },
    july:      { avgHighF: 85, avgLowF: 70, avgHighC: 29, avgLowC: 21, description: 'Peak summer heat. Humid and hot. Coastal areas are 5-10°F cooler.', rainfall: '4.5 in (114mm)', sunshine: '9.5 hrs/day' },
    august:    { avgHighF: 84, avgLowF: 69, avgHighC: 29, avgLowC: 21, description: 'Still hot and humid. Best beach month for the Rockaways and Coney Island.', rainfall: '4.3 in (109mm)', sunshine: '9.0 hrs/day' },
    september: { avgHighF: 76, avgLowF: 62, avgHighC: 24, avgLowC: 17, description: 'NYC\'s golden month. Warm, less humid, and energetic. Perfect for everything.', rainfall: '3.9 in (99mm)', sunshine: '8.0 hrs/day' },
    october:   { avgHighF: 65, avgLowF: 50, avgHighC: 18, avgLowC: 10, description: 'Fall foliage peaks mid-late October. Crisp and beautiful. Light jacket needed.', rainfall: '3.4 in (86mm)', sunshine: '7.0 hrs/day' },
    november:  { avgHighF: 53, avgLowF: 40, avgHighC: 12, avgLowC: 4,  description: 'Turning cold and grey. Holiday lights appear mid-month. Pack a real coat.', rainfall: '3.8 in (97mm)', sunshine: '5.5 hrs/day' },
    december:  { avgHighF: 43, avgLowF: 31, avgHighC: 6,  avgLowC: -1, description: 'Cold but magical with holiday lights and markets. Occasional snow.', rainfall: '3.6 in (91mm)', sunshine: '4.5 hrs/day' },
  },
  london: {
    january:   { avgHighF: 46, avgLowF: 38, avgHighC: 8,  avgLowC: 3,  description: 'Grey and cold. Occasional frost. Museums are a great refuge.', rainfall: '2.1 in (54mm)', sunshine: '1.5 hrs/day' },
    february:  { avgHighF: 48, avgLowF: 38, avgHighC: 9,  avgLowC: 3,  description: 'Still cold. Gradually improving. Some sunny days appear.', rainfall: '1.6 in (41mm)', sunshine: '2.5 hrs/day' },
    march:     { avgHighF: 52, avgLowF: 41, avgHighC: 11, avgLowC: 5,  description: 'Early signs of spring. Daffodils in the parks. Unpredictable.', rainfall: '1.7 in (43mm)', sunshine: '3.5 hrs/day' },
    april:     { avgHighF: 57, avgLowF: 44, avgHighC: 14, avgLowC: 7,  description: 'April showers. Warming but still cool. Parks are beautiful.', rainfall: '1.9 in (48mm)', sunshine: '5.0 hrs/day' },
    may:       { avgHighF: 64, avgLowF: 50, avgHighC: 18, avgLowC: 10, description: 'Lovely mild weather. Long days, outdoor dining season begins.', rainfall: '1.8 in (46mm)', sunshine: '6.5 hrs/day' },
    june:      { avgHighF: 69, avgLowF: 55, avgHighC: 21, avgLowC: 13, description: 'London\'s summer starts. Wimbledon, outdoor theatre, long evenings.', rainfall: '1.9 in (48mm)', sunshine: '7.5 hrs/day' },
    july:      { avgHighF: 73, avgLowF: 59, avgHighC: 23, avgLowC: 15, description: 'Warmest month. Outdoor pubs, parks, and occasional heat waves.', rainfall: '1.8 in (46mm)', sunshine: '7.5 hrs/day' },
    august:    { avgHighF: 72, avgLowF: 59, avgHighC: 22, avgLowC: 15, description: 'Still warm. Bank holiday weekend. Notting Hill Carnival.', rainfall: '2.2 in (56mm)', sunshine: '7.0 hrs/day' },
    september: { avgHighF: 66, avgLowF: 54, avgHighC: 19, avgLowC: 12, description: 'Warm September. Crowds thin. Perfect for walking and parks.', rainfall: '1.9 in (48mm)', sunshine: '5.5 hrs/day' },
    october:   { avgHighF: 57, avgLowF: 47, avgHighC: 14, avgLowC: 8,  description: 'Autumn colours. Cooler and wetter. Layers essential.', rainfall: '2.7 in (69mm)', sunshine: '4.0 hrs/day' },
    november:  { avgHighF: 50, avgLowF: 42, avgHighC: 10, avgLowC: 6,  description: 'Grey and wet. Bonfire Night (5th). Dark evenings.', rainfall: '2.5 in (64mm)', sunshine: '2.5 hrs/day' },
    december:  { avgHighF: 46, avgLowF: 38, avgHighC: 8,  avgLowC: 3,  description: 'Cold with Christmas cheer. Markets and lights. Rarely snows.', rainfall: '2.3 in (58mm)', sunshine: '1.5 hrs/day' },
  },
  tokyo: {
    january:   { avgHighF: 50, avgLowF: 37, avgHighC: 10, avgLowC: 3,  description: 'Dry and cold. Clear skies with excellent Mt. Fuji views. Low crowds.', rainfall: '2.1 in (53mm)', sunshine: '6.0 hrs/day' },
    february:  { avgHighF: 52, avgLowF: 38, avgHighC: 11, avgLowC: 3,  description: 'Cold but increasingly sunny. Plum blossoms (ume) begin mid-February.', rainfall: '2.3 in (58mm)', sunshine: '5.5 hrs/day' },
    march:     { avgHighF: 58, avgLowF: 44, avgHighC: 15, avgLowC: 7,  description: 'Cherry blossoms begin late March. Unpredictable — can be warm or cold.', rainfall: '4.3 in (109mm)', sunshine: '5.5 hrs/day' },
    april:     { avgHighF: 66, avgLowF: 51, avgHighC: 19, avgLowC: 11, description: 'Cherry blossom peak early April. Mild and beautiful. Peak tourist season.', rainfall: '5.3 in (135mm)', sunshine: '6.0 hrs/day' },
    may:       { avgHighF: 74, avgLowF: 58, avgHighC: 23, avgLowC: 15, description: 'Warm and golden. Best month after April. Pre-rainy season.', rainfall: '5.8 in (147mm)', sunshine: '6.5 hrs/day' },
    june:      { avgHighF: 79, avgLowF: 66, avgHighC: 26, avgLowC: 19, description: 'Rainy season (tsuyu). Humid and overcast. Hydrangea season.', rainfall: '6.5 in (165mm)', sunshine: '4.5 hrs/day' },
    july:      { avgHighF: 86, avgLowF: 73, avgHighC: 30, avgLowC: 23, description: 'Hot and humid post-tsuyu. Typhoon season begins. Fireworks festivals.', rainfall: '5.6 in (142mm)', sunshine: '5.5 hrs/day' },
    august:    { avgHighF: 90, avgLowF: 76, avgHighC: 32, avgLowC: 24, description: 'Brutally hot. Peak typhoon season. O-Bon festival (mid-August).', rainfall: '5.9 in (150mm)', sunshine: '6.0 hrs/day' },
    september: { avgHighF: 83, avgLowF: 70, avgHighC: 28, avgLowC: 21, description: 'Still hot with typhoon risk. Gradually cooling toward month end.', rainfall: '8.5 in (216mm)', sunshine: '5.0 hrs/day' },
    october:   { avgHighF: 72, avgLowF: 58, avgHighC: 22, avgLowC: 14, description: 'Perfect autumn weather. Best month with foliage starting late October.', rainfall: '7.4 in (188mm)', sunshine: '5.5 hrs/day' },
    november:  { avgHighF: 62, avgLowF: 48, avgHighC: 17, avgLowC: 9,  description: 'Peak autumn foliage. Cool and dry. Excellent sightseeing conditions.', rainfall: '3.8 in (97mm)', sunshine: '5.5 hrs/day' },
    december:  { avgHighF: 53, avgLowF: 40, avgHighC: 12, avgLowC: 4,  description: 'Cold and dry. Clear views of Mt. Fuji. Christmas illuminations.', rainfall: '2.1 in (53mm)', sunshine: '6.0 hrs/day' },
  },
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; district: string; month: string }>
}): Promise<Metadata> {
  const { city: citySlug, district: districtSlug, month: monthParam } = await params
  const city = getCity(citySlug)
  const district = getDistrict(citySlug, districtSlug)
  if (!city || !district || !MONTHS.includes(monthParam)) return {}
  const monthName = monthParam.charAt(0).toUpperCase() + monthParam.slice(1)
  return {
    title: `${district.name} Weather in ${monthName} — ${city.name} Neighborhood Monthly Climate`,
    description: `What is the weather like in ${district.name}, ${city.name} in ${monthName}? Average temperatures, local microclimate conditions, and what to expect in this neighborhood.`,
    alternates: { canonical: `https://cityweather.app/${city.slug}/${district.slug}/weather/${monthParam}` },
    openGraph: {
      title: `${district.name} Weather in ${monthName} | ${city.name}`,
      description: `${monthName} weather in ${district.name}, ${city.name}: local conditions, temperature averages, and neighborhood-specific climate notes.`,
      url: `https://cityweather.app/${city.slug}/${district.slug}/weather/${monthParam}`,
    },
    other: {
      'geo.placename': `${district.name}, ${city.name}, ${city.country}`,
      'geo.position': `${district.lat};${district.lon}`,
      'ICBM': `${district.lat}, ${district.lon}`,
    },
  }
}

export default async function DistrictMonthlyPage({
  params,
}: {
  params: Promise<{ city: string; district: string; month: string }>
}) {
  const { city: citySlug, district: districtSlug, month: monthParam } = await params
  const city = getCity(citySlug)
  const district = getDistrict(citySlug, districtSlug)
  if (!city || !district || !MONTHS.includes(monthParam)) notFound()

  const monthName = monthParam.charAt(0).toUpperCase() + monthParam.slice(1)
  const monthIndex = MONTHS.indexOf(monthParam)
  const prevMonth = MONTHS[(monthIndex + 11) % 12]
  const nextMonth = MONTHS[(monthIndex + 1) % 12]

  const cityMonthData = CITY_MONTH_DATA[citySlug]?.[monthParam]
  const w = await getWeather(district.lat, district.lon)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'City Weather', item: 'https://cityweather.app/' },
      { '@type': 'ListItem', position: 2, name: `${city.name} Weather`, item: `https://cityweather.app/${city.slug}` },
      { '@type': 'ListItem', position: 3, name: `${district.name} Weather`, item: `https://cityweather.app/${city.slug}/${district.slug}` },
      { '@type': 'ListItem', position: 4, name: `${district.name} Weather in ${monthName}`, item: `https://cityweather.app/${city.slug}/${district.slug}/weather/${monthParam}` },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the weather like in ${district.name} in ${monthName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: cityMonthData
            ? `In ${monthName}, ${district.name} in ${city.name} has average highs around ${cityMonthData.avgHighF}°F (${cityMonthData.avgHighC}°C) and lows around ${cityMonthData.avgLowF}°F (${cityMonthData.avgLowC}°C). ${district.description ?? cityMonthData.description}`
            : `${district.name} in ${monthName} follows the general ${city.name} climate pattern. ${district.description ?? ''}`,
        },
      },
      {
        '@type': 'Question',
        name: `How does ${district.name} weather in ${monthName} differ from the rest of ${city.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: district.description ?? `${district.name} is one of ${city.name}'s distinct neighborhoods with its own microclimate influenced by local geography, proximity to water, and urban density.`,
        },
      },
      {
        '@type': 'Question',
        name: `What should I wear in ${district.name} in ${monthName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: cityMonthData
            ? `For ${monthName} in ${district.name}: ${cityMonthData.description} Expect highs of ${cityMonthData.avgHighF}°F and lows of ${cityMonthData.avgLowF}°F.`
            : `Check the current conditions and dress for the season. ${district.description ?? ''}`,
        },
      },
      {
        '@type': 'Question',
        name: `How much rain does ${district.name} get in ${monthName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: cityMonthData
            ? `${city.name} averages ${cityMonthData.rainfall} of rainfall in ${monthName} with about ${cityMonthData.sunshine} of sunshine. Local conditions in ${district.name} may vary slightly based on its microclimate.`
            : `Rainfall varies by neighborhood. Check the ${city.name} weather guide for detailed monthly precipitation data.`,
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <nav className="flex gap-2 text-sm text-blue-300 mb-8 flex-wrap">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <span>›</span>
          <Link href={`/${city.slug}`} className="hover:text-white transition">{city.flag} {city.name}</Link>
          <span>›</span>
          <Link href={`/${city.slug}/${district.slug}`} className="hover:text-white transition">{district.name}</Link>
          <span>›</span>
          <span className="text-white">Weather in {monthName}</span>
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

        {cityMonthData && (
          <section className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-blue-400 text-xs mb-1">Avg High</p>
                <p className="text-white text-2xl font-bold">{cityMonthData.avgHighF}°F</p>
                <p className="text-blue-300 text-xs">{cityMonthData.avgHighC}°C</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-blue-400 text-xs mb-1">Avg Low</p>
                <p className="text-white text-2xl font-bold">{cityMonthData.avgLowF}°F</p>
                <p className="text-blue-300 text-xs">{cityMonthData.avgLowC}°C</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-blue-400 text-xs mb-1">Rainfall</p>
                <p className="text-white text-lg font-bold">{cityMonthData.rainfall}</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-blue-400 text-xs mb-1">Sunshine</p>
                <p className="text-white text-lg font-bold">{cityMonthData.sunshine}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 mb-4">
              <h2 className="text-white font-semibold mb-2">{city.name} in {monthName}</h2>
              <p className="text-blue-200 text-sm leading-relaxed">{cityMonthData.description}</p>
            </div>
          </section>
        )}

        {district.description && (
          <section className="bg-white/5 rounded-2xl p-6 text-blue-200 text-sm leading-relaxed mb-8">
            <h2 className="text-white font-semibold mb-2">{district.name} Microclimate</h2>
            <p>{district.description}</p>
          </section>
        )}

        {w && (
          <section className="mb-8">
            <h2 className="text-white font-semibold mb-3">Current Weather in {district.name} Right Now</h2>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-5 flex items-center gap-5">
              <img src={`https://openweathermap.org/img/wn/${w.icon}@2x.png`} alt={w.description} width={64} height={64} />
              <div>
                <p className="text-white text-4xl font-light"><Temp value={w.temp} /></p>
                <p className="text-blue-200 capitalize text-sm">{capitalize(w.description)}</p>
                <p className="text-blue-300 text-xs mt-1">Feels like <Temp value={w.feels_like} /> · H <Temp value={w.temp_max} /> / L <Temp value={w.temp_min} /></p>
              </div>
            </div>
          </section>
        )}

        <section className="mb-8">
          <h2 className="text-white font-semibold mb-3">Other Months in {district.name}</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {MONTHS.map((m) => (
              <Link
                key={m}
                href={`/${city.slug}/${district.slug}/weather/${m}`}
                className={`rounded-xl p-2 text-center text-xs transition capitalize ${m === monthParam ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20 text-blue-300 hover:text-white'}`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-white font-semibold mb-3">Other Neighborhoods in {monthName}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {city.districts
              .filter((d) => d.slug !== districtSlug && d.group === district.group)
              .slice(0, 6)
              .map((d) => (
                <Link
                  key={d.slug}
                  href={`/${city.slug}/${d.slug}/weather/${monthParam}`}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-3 text-sm text-blue-200 hover:text-white transition"
                >
                  {d.name} in {monthName}
                </Link>
              ))}
          </div>
        </section>

        <div className="flex gap-4 pt-6 border-t border-white/10">
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
      </main>
    </>
  )
}
