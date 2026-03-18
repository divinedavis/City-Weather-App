import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CITIES, getCity } from '@/lib/cities'
import { getWeather, capitalize } from '@/lib/weather'
import { Temp } from '@/components/Temp'
import { CITY_GUIDES } from '@/lib/guides'
import type { Metadata } from 'next'

export const revalidate = 3600

const MONTHS = [
  'january','february','march','april','may','june',
  'july','august','september','october','november','december'
]

const MONTH_DATA: Record<string, Record<string, {
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

const GENERIC_MONTH_DATA: Record<string, { season: string; generalTip: string }> = {
  january:   { season: 'winter in the Northern Hemisphere / summer in Southern Hemisphere', generalTip: 'Pack according to the city\'s specific climate.' },
  february:  { season: 'late winter in Northern Hemisphere / late summer in Southern Hemisphere', generalTip: 'Check the seasonal guide for this city for specific conditions.' },
  march:     { season: 'early spring in Northern Hemisphere / early fall in Southern Hemisphere', generalTip: 'Shoulder season — often good value with pleasant weather.' },
  april:     { season: 'spring in Northern Hemisphere / fall in Southern Hemisphere', generalTip: 'Spring or fall conditions — often among the best months to visit.' },
  may:       { season: 'late spring in Northern Hemisphere', generalTip: 'One of the most popular travel months worldwide for good reason.' },
  june:      { season: 'early summer in Northern Hemisphere / early winter in Southern Hemisphere', generalTip: 'Long days in the Northern Hemisphere. Best weather for many destinations.' },
  july:      { season: 'peak summer in Northern Hemisphere', generalTip: 'Peak tourist season in many Northern Hemisphere cities. Book ahead.' },
  august:    { season: 'late summer in Northern Hemisphere', generalTip: 'Hot in many cities. Beach and outdoor destinations are at their peak.' },
  september: { season: 'early fall in Northern Hemisphere', generalTip: 'Excellent shoulder season — warm with fewer tourists in many destinations.' },
  october:   { season: 'mid-fall in Northern Hemisphere / mid-spring in Southern Hemisphere', generalTip: 'Foliage season in temperate cities. Often the best month to visit Europe.' },
  november:  { season: 'late fall in Northern Hemisphere', generalTip: 'Cooling down. Low season for many destinations — great value.' },
  december:  { season: 'early winter in Northern Hemisphere / early summer in Southern Hemisphere', generalTip: 'Holiday season. Many cities decorate beautifully. Book ahead for December travel.' },
}

export async function generateStaticParams() {
  return CITIES.flatMap((c) =>
    MONTHS.map((month) => ({ city: c.slug, month: month }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; month: string }>
}): Promise<Metadata> {
  const { city: citySlug, month: monthParam } = await params
  const city = getCity(citySlug)
  const monthSlug = monthParam
  if (!city || !MONTHS.includes(monthSlug)) return {}
  const monthName = monthSlug.charAt(0).toUpperCase() + monthSlug.slice(1)
  return {
    title: `${city.name} Weather in ${monthName} — Temperature, Rain & What to Expect`,
    description: `What is the weather like in ${city.name} in ${monthName}? Average temperatures, rainfall, sunshine hours, and what to pack for ${monthName} in ${city.name}.`,
    alternates: { canonical: `https://cityweather.app/${city.slug}/weather/${monthSlug}` },
    openGraph: {
      title: `${city.name} Weather in ${monthName} | Temperatures & Travel Tips`,
      description: `${monthName} weather in ${city.name}: average highs, lows, rainfall, and what to expect.`,
      url: `https://cityweather.app/${city.slug}/weather/${monthSlug}`,
    },
  }
}

export default async function MonthlyWeatherPage({
  params,
}: {
  params: Promise<{ city: string; month: string }>
}) {
  const { city: citySlug, month: monthParam } = await params
  const city = getCity(citySlug)
  const monthSlug = monthParam
  if (!city || !MONTHS.includes(monthSlug)) notFound()

  const monthName = monthSlug.charAt(0).toUpperCase() + monthSlug.slice(1)
  const monthIndex = MONTHS.indexOf(monthSlug)
  const prevMonth = MONTHS[(monthIndex + 11) % 12]
  const nextMonth = MONTHS[(monthIndex + 1) % 12]

  const cityData = MONTH_DATA[citySlug]
  const monthData = cityData?.[monthSlug]
  const guide = CITY_GUIDES[citySlug]
  const generic = GENERIC_MONTH_DATA[monthSlug]

  const w = await getWeather(city.lat, city.lon)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the weather like in ${city.name} in ${monthName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: monthData
            ? `In ${monthName}, ${city.name} has average highs of ${monthData.avgHighF}°F (${monthData.avgHighC}°C) and lows of ${monthData.avgLowF}°F (${monthData.avgLowC}°C). ${monthData.description}`
            : `${city.name} in ${monthName} — check the seasonal guide for detailed conditions. ${generic.generalTip}`,
        },
      },
      {
        '@type': 'Question',
        name: `Is ${monthName} a good time to visit ${city.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: guide
            ? `${guide.bestMonths.toLowerCase().includes(monthSlug.slice(0,3)) ? `Yes — ${monthSlug.charAt(0).toUpperCase() + monthSlug.slice(1)} is one of the best months to visit ${city.name}. ` : ''}${guide.overview}`
            : `${city.description}`,
        },
      },
      {
        '@type': 'Question',
        name: `What should I pack for ${city.name} in ${monthName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: guide?.packingTips?.join('. ') ?? `Pack appropriately for ${generic.season} conditions in ${city.name}.`,
        },
      },
    ],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'City Weather', item: 'https://cityweather.app/' },
      { '@type': 'ListItem', position: 2, name: `${city.name} Weather`, item: `https://cityweather.app/${city.slug}` },
      { '@type': 'ListItem', position: 3, name: `${city.name} Weather in ${monthName}`, item: `https://cityweather.app/${city.slug}/weather/${monthSlug}` },
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
          <Link href={`/${city.slug}`} className="hover:text-white transition">{city.name}</Link>
          <span>›</span>
          <span className="text-white">Weather in {monthName}</span>
        </nav>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{city.flag}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {city.name} Weather in {monthName}
            </h1>
          </div>
          <p className="text-blue-300 text-sm">{city.country} · {generic.season}</p>
        </header>

        {monthData ? (
          <section className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-blue-400 text-xs mb-1">Avg High</p>
                <p className="text-white text-2xl font-bold">{monthData.avgHighF}°F</p>
                <p className="text-blue-300 text-xs">{monthData.avgHighC}°C</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-blue-400 text-xs mb-1">Avg Low</p>
                <p className="text-white text-2xl font-bold">{monthData.avgLowF}°F</p>
                <p className="text-blue-300 text-xs">{monthData.avgLowC}°C</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-blue-400 text-xs mb-1">Rainfall</p>
                <p className="text-white text-lg font-bold">{monthData.rainfall}</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-blue-400 text-xs mb-1">Sunshine</p>
                <p className="text-white text-lg font-bold">{monthData.sunshine}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
              <h2 className="text-white font-semibold mb-2">What to Expect</h2>
              <p className="text-blue-200 text-sm leading-relaxed">{monthData.description}</p>
            </div>
          </section>
        ) : (
          <section className="mb-8">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
              <p className="text-blue-200 text-sm leading-relaxed">{city.description}</p>
              <p className="text-blue-300 text-sm mt-3">{generic.generalTip}</p>
            </div>
          </section>
        )}

        {w && (
          <section className="mb-8">
            <h2 className="text-white font-semibold mb-3">Current Weather in {city.name} Right Now</h2>
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

        {guide && (
          <section className="mb-8">
            <h2 className="text-white font-semibold mb-3">Is {monthName} a Good Time to Visit {city.name}?</h2>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
              <p className="text-blue-200 text-sm leading-relaxed mb-3">{guide.overview}</p>
              <div className="flex gap-4 text-xs">
                <div>
                  <span className="text-green-400 mr-1">✓ Best months:</span>
                  <span className="text-blue-200">{guide.bestMonths}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {guide && (
          <section className="mb-8">
            <h2 className="text-white font-semibold mb-3">What to Pack for {city.name} in {monthName}</h2>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
              <ul className="space-y-2">
                {guide.packingTips.map((tip, i) => (
                  <li key={i} className="text-blue-200 text-sm flex gap-2">
                    <span className="text-blue-400 shrink-0">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="mb-8">
          <h2 className="text-white font-semibold mb-3">Other Months in {city.name}</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {MONTHS.map((m) => (
              <Link
                key={m}
                href={`/${city.slug}/weather/${m}`}
                className={`rounded-xl p-2 text-center text-xs transition capitalize ${m === monthSlug ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20 text-blue-300 hover:text-white'}`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-white font-semibold mb-3">Neighborhoods in {city.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {city.districts.slice(0, 12).map((d) => (
              <Link
                key={d.slug}
                href={`/${city.slug}/${d.slug}`}
                className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-3 text-sm text-blue-200 hover:text-white transition"
              >
                {d.name}
              </Link>
            ))}
          </div>
          <Link href={`/${city.slug}`} className="mt-3 inline-block text-blue-300 hover:text-white text-sm transition">
            See all {city.districts.length} neighborhoods →
          </Link>
        </section>

        <div className="flex gap-4 pt-6 border-t border-white/10">
          <Link
            href={`/${city.slug}/weather/${prevMonth}`}
            className="flex-1 text-center bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white rounded-xl py-3 text-sm transition capitalize"
          >
            ← {prevMonth.charAt(0).toUpperCase() + prevMonth.slice(1)}
          </Link>
          <Link
            href={`/${city.slug}`}
            className="flex-1 text-center bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3 text-sm font-medium transition"
          >
            Live Weather
          </Link>
          <Link
            href={`/${city.slug}/weather/${nextMonth}`}
            className="flex-1 text-center bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white rounded-xl py-3 text-sm transition capitalize"
          >
            {nextMonth.charAt(0).toUpperCase() + nextMonth.slice(1)} →
          </Link>
        </div>
      </main>
    </>
  )
}
