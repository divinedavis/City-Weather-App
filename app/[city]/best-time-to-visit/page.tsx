import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CITIES, getCity } from '@/lib/cities'
import type { Metadata } from 'next'

export const revalidate = false // static

export async function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: slug } = await params
  const city = getCity(slug)
  if (!city) return {}
  const url = `https://cityweather.app/${city.slug}/best-time-to-visit`
  return {
    title: `Best Time to Visit ${city.name} | City Weather`,
    description: `Discover the best time to visit ${city.name}. Season-by-season weather breakdown, ideal travel months, packing tips, and local climate insights.`,
    alternates: {
      canonical: url,
      languages: {
        'en': url,
        'x-default': url,
      },
    },
    openGraph: {
      title: `Best Time to Visit ${city.name} | City Weather`,
      description: `When to go to ${city.name}: season-by-season weather, best months, and what to pack.`,
      url,
    },
  }
}

type ClimateType = 'tropical' | 'northern' | 'southern'

function getClimateType(lat: number): ClimateType {
  if (lat > -23 && lat < 23) return 'tropical'
  if (lat >= 0) return 'northern'
  return 'southern'
}

type SeasonRating = 'best' | 'good' | 'fair' | 'avoid'

type SeasonData = {
  name: string
  months: string
  tempRange: string
  description: string
  highlights: string[]
  rating: SeasonRating
}

type BestTimeData = {
  overview: string
  bestMonths: string
  seasons: SeasonData[]
  packingTips: {
    essentials: string[]
    light: string[]
    warmWeather: string[]
    coldWeather: string[]
  }
}

function getBestTimeData(city: NonNullable<ReturnType<typeof getCity>>): BestTimeData {
  const climate = getClimateType(city.lat)

  if (climate === 'tropical') {
    return {
      overview: `${city.name} sits in the tropics (${city.lat.toFixed(1)}° latitude), so rather than four distinct seasons, the year divides into a dry season and a wet season. Temperatures remain warm year-round, typically 75–95°F (24–35°C), with the main variable being rainfall and humidity.`,
      bestMonths: 'The dry season months offer the most comfortable conditions for visitors, with lower humidity, less rain, and clearer skies.',
      seasons: [
        {
          name: 'Dry Season',
          months: city.lat > 0 ? 'November – April' : 'May – October',
          tempRange: '75–88°F (24–31°C)',
          description: `The dry season is the prime time to visit ${city.name}. Humidity drops, rain is infrequent, and sunshine is plentiful. This is peak tourist season, so expect higher prices and more crowds at popular attractions.`,
          highlights: ['Clear sunny days', 'Low humidity', 'Ideal for outdoor activities', 'Best beach and sightseeing conditions'],
          rating: 'best' as SeasonRating,
        },
        {
          name: 'Shoulder Months',
          months: city.lat > 0 ? 'October & May' : 'April & November',
          tempRange: '78–92°F (26–33°C)',
          description: `Transition months bring a mix of dry and wet conditions. Rain becomes more frequent but rarely lasts all day. Crowds thin out and prices soften — a solid compromise between good weather and value.`,
          highlights: ['Fewer tourists', 'Lower hotel rates', 'Occasional afternoon showers', 'Lush green landscapes'],
          rating: 'good' as SeasonRating,
        },
        {
          name: 'Wet Season',
          months: city.lat > 0 ? 'May – October' : 'November – April',
          tempRange: '80–95°F (27–35°C)',
          description: `The wet season brings daily downpours, usually in the afternoon and evening. Heat and humidity are at their peak. Travel is still possible — rain rarely lasts all day — but some activities and roads may be disrupted.`,
          highlights: ['Dramatic skies and thunderstorms', 'Cheapest rates', 'Vibrant vegetation', 'Fewer tourists'],
          rating: 'fair' as SeasonRating,
        },
      ],
      packingTips: {
        essentials: ['Lightweight breathable clothing', 'High-SPF sunscreen', 'Insect repellent', 'Reusable water bottle'],
        light: ['Loose linen or cotton shirts', 'Shorts and light trousers', 'Sandals and walking shoes'],
        warmWeather: ['Portable fan or misting bottle', 'UV-protection hat', 'Light rain jacket (wet season)'],
        coldWeather: ['Light cardigan for air-conditioned spaces', 'Comfortable walking shoes'],
      },
    }
  }

  if (climate === 'northern') {
    const isHighLat = Math.abs(city.lat) > 50
    const isMidLat = Math.abs(city.lat) > 35 && Math.abs(city.lat) <= 50

    const winterTempRange = isHighLat ? '25–45°F (-4–7°C)' : isMidLat ? '30–50°F (-1–10°C)' : '55–75°F (13–24°C)'
    const springTempRange = isHighLat ? '40–60°F (4–15°C)' : isMidLat ? '45–65°F (7–18°C)' : '65–80°F (18–27°C)'
    const summerTempRange = isHighLat ? '60–75°F (15–24°C)' : isMidLat ? '70–90°F (21–32°C)' : '85–105°F (29–40°C)'
    const fallTempRange = isHighLat ? '40–60°F (4–15°C)' : isMidLat ? '50–70°F (10–21°C)' : '65–85°F (18–29°C)'

    const isVeryHotSummer = !isHighLat && !isMidLat

    const overviewSuffix = isHighLat
      ? 'Its northern latitude means cool summers, cold winters, and dramatic seasonal swings.'
      : isMidLat
      ? 'Summers are warm and humid, winters are cold, and spring and fall offer the most pleasant conditions.'
      : 'Its lower latitude means mild winters and very hot summers, making spring and fall the most comfortable seasons for visitors.'

    const bestMonthsText = isHighLat
      ? `May through September offers the warmest and most pleasant conditions in ${city.name}. July and August see the most sunshine.`
      : isMidLat
      ? `Late April through June and September through October are typically the best months to visit ${city.name} — comfortable temperatures, lower humidity, and fewer weather extremes.`
      : `November through March offers the most comfortable temperatures for exploring ${city.name}, avoiding the intense summer heat.`

    const summerDescription = isHighLat
      ? `Summer is ${city.name}'s warmest and most vibrant season. Long daylight hours, outdoor festivals, and comfortable temperatures make it ideal for exploring. This is peak tourist season.`
      : isVeryHotSummer
      ? `Summers in ${city.name} are intensely hot, often exceeding 100°F (38°C). Outdoor activities are best kept to early morning or evening. Air conditioning is essential.`
      : `Summers in ${city.name} are warm and humid, with temperatures often reaching the upper 80s. July and August are the hottest months. It's peak tourist season but can feel oppressive during heat waves.`

    const summerHighlights = isHighLat
      ? ['Long days with late sunsets', 'Outdoor events and festivals', 'Al fresco dining', 'Best beach weather']
      : isVeryHotSummer
      ? ['Cheapest travel rates', 'Indoor attractions thrive', 'Dramatic thunderstorms', 'Fewer tourists']
      : ['Outdoor concerts and events', 'Rooftop bars and terraces', 'Vibrant nightlife', 'Beach and water activities nearby']

    const fallDescription = isHighLat
      ? `Fall brings cooling temperatures and stunning foliage to ${city.name}. September is often warm and golden. October sees dramatic color changes before November ushers in the first chills.`
      : `Fall is widely considered one of the best times to visit ${city.name}. Temperatures ease after summer's heat, the crowds thin, and the city takes on a more relaxed, local character.`

    const winterDescription = isHighLat
      ? `Winter in ${city.name} is cold and can be harsh, with snow, ice, and short daylight hours. That said, holiday markets, cozy interiors, and fewer tourists give winter a charm of its own for prepared visitors.`
      : isMidLat
      ? `Winters in ${city.name} are cold with occasional snow. Holiday decorations make the city magical in December, but January and February can be grey and frigid. Pack layers and be prepared for cold snaps.`
      : `Winter is prime visiting season in ${city.name}. Temperatures are pleasantly warm, ideal for outdoor exploration, and the city is buzzing with visitors and events.`

    const winterHighlights = (isHighLat || isMidLat)
      ? ['Festive holiday season', 'Fewer tourists (Jan-Feb)', 'Lower hotel rates', 'Cozy indoor culture scenes']
      : ['Perfect outdoor weather', 'Peak tourist season', 'Outdoor dining and markets', 'Cultural festivals']

    return {
      overview: `${city.name} experiences four distinct seasons driven by its position at ${city.lat.toFixed(1)}°N. ${overviewSuffix}`,
      bestMonths: bestMonthsText,
      seasons: [
        {
          name: 'Spring',
          months: 'March – May',
          tempRange: springTempRange,
          description: `Spring in ${city.name} is a season of renewal. Temperatures climb steadily from cool to warm, flowers bloom, and the city comes alive after winter. Rain is common in March and April, but by May conditions are often ideal for sightseeing.`,
          highlights: ['Blooming parks and gardens', 'Milder temperatures', 'Longer daylight hours', 'Lower prices before summer peak'],
          rating: (isVeryHotSummer ? 'good' : 'best') as SeasonRating,
        },
        {
          name: 'Summer',
          months: 'June – August',
          tempRange: summerTempRange,
          description: summerDescription,
          highlights: summerHighlights,
          rating: (isHighLat ? 'best' : isVeryHotSummer ? 'avoid' : 'good') as SeasonRating,
        },
        {
          name: 'Fall',
          months: 'September – November',
          tempRange: fallTempRange,
          description: fallDescription,
          highlights: ['Autumn foliage and golden light', 'Harvest festivals and local events', 'Comfortable walking temperatures', 'Lower accommodation rates'],
          rating: 'best' as SeasonRating,
        },
        {
          name: 'Winter',
          months: 'December – February',
          tempRange: winterTempRange,
          description: winterDescription,
          highlights: winterHighlights,
          rating: ((isHighLat || isMidLat) ? 'fair' : 'best') as SeasonRating,
        },
      ],
      packingTips: {
        essentials: ['Comfortable walking shoes', 'Reusable water bottle', 'Power adapter', 'Travel insurance docs'],
        light: ['T-shirts and light layers', 'Sunglasses', 'Sunscreen SPF 30+'],
        warmWeather: ['Shorts and breathable trousers', 'Light jacket for evenings', 'Hat for sun protection'],
        coldWeather: isHighLat
          ? ['Heavy winter coat', 'Waterproof boots', 'Gloves, scarf and hat', 'Thermal underlayers']
          : ['Mid-weight jacket or coat', 'Layering pieces', 'Warm socks', 'Light gloves for cold snaps'],
      },
    }
  }

  // Southern hemisphere
  const isHighLat = Math.abs(city.lat) > 40

  return {
    overview: `${city.name} sits in the southern hemisphere at ${Math.abs(city.lat).toFixed(1)}°S, so its seasons are reversed from the northern hemisphere — summer falls in December through February and winter in June through August.`,
    bestMonths: isHighLat
      ? `October through March (southern spring and summer) offers the warmest and most pleasant conditions for visiting ${city.name}.`
      : `April through September provides comfortable, mild temperatures ideal for exploring ${city.name} without summer heat.`,
    seasons: [
      {
        name: 'Summer (Dec – Feb)',
        months: 'December – February',
        tempRange: isHighLat ? '65–85°F (18–30°C)' : '75–95°F (24–35°C)',
        description: `Summer in ${city.name} runs December through February. Days are long, temperatures are at their warmest, and outdoor activities are in full swing. ${isHighLat ? 'This is peak tourist season.' : 'Heat can be intense; plan outdoor activities for mornings.'}`,
        highlights: ['Long daylight hours', 'Beach and outdoor activities', 'Summer festivals', 'Vibrant city atmosphere'],
        rating: (isHighLat ? 'best' : 'good') as SeasonRating,
      },
      {
        name: 'Fall (Mar – May)',
        months: 'March – May',
        tempRange: isHighLat ? '50–70°F (10–21°C)' : '65–80°F (18–27°C)',
        description: `Autumn in ${city.name} (March–May) sees temperatures begin to cool pleasantly. Foliage changes in April and May. Crowds thin after peak summer and hotel rates ease.`,
        highlights: ['Autumn colors', 'Milder temperatures', 'Fewer crowds', 'Lower travel costs'],
        rating: 'best' as SeasonRating,
      },
      {
        name: 'Winter (Jun – Aug)',
        months: 'June – August',
        tempRange: isHighLat ? '35–55°F (2–13°C)' : '55–70°F (13–21°C)',
        description: isHighLat
          ? `Winter in ${city.name} can be cold, wet, and dark. Snow is possible at higher latitudes. It's the quietest tourist season with the lowest prices.`
          : `Winter months are mild and pleasant in ${city.name} — cool enough for comfortable sightseeing without heavy layering. It is the driest season in many southern cities.`,
        highlights: isHighLat
          ? ['Festive winter events', 'Lowest prices', 'Cozy indoor culture', 'Fewer tourists']
          : ['Perfect sightseeing weather', 'Dry and clear skies', 'Cultural events and festivals', 'Off-peak value'],
        rating: (isHighLat ? 'fair' : 'best') as SeasonRating,
      },
      {
        name: 'Spring (Sep – Nov)',
        months: 'September – November',
        tempRange: isHighLat ? '50–70°F (10–21°C)' : '60–80°F (16–27°C)',
        description: `Spring arrives in ${city.name} from September through November. Gardens bloom, temperatures rise pleasantly, and the city prepares for the summer season. An excellent shoulder season.`,
        highlights: ['Spring blooms', 'Increasing warmth', 'Pre-peak value', 'Outdoor events begin'],
        rating: 'good' as SeasonRating,
      },
    ],
    packingTips: {
      essentials: ['Comfortable walking shoes', 'Reusable water bottle', 'Power adapter', 'Travel insurance docs'],
      light: ['T-shirts and light layers', 'Sunglasses', 'Sunscreen SPF 30+'],
      warmWeather: ['Shorts and breathable clothing', 'Light jacket for evenings', 'Hat for sun protection'],
      coldWeather: isHighLat
        ? ['Warm jacket or coat', 'Waterproof layers', 'Gloves and scarf']
        : ['Light jacket or cardigan', 'Layering pieces', 'Comfortable closed-toe shoes'],
    },
  }
}

const ratingColors: Record<string, string> = {
  best: 'text-green-400 bg-green-400/10',
  good: 'text-blue-300 bg-blue-300/10',
  fair: 'text-yellow-400 bg-yellow-400/10',
  avoid: 'text-red-400 bg-red-400/10',
}
const ratingLabels: Record<string, string> = {
  best: 'Best time',
  good: 'Good time',
  fair: 'Fair',
  avoid: 'Avoid',
}

export default function BestTimeToVisitPage({
  params,
}: {
  params: { city: string }
}) {
  const city = getCity(params.city)
  if (!city) notFound()

  const data = getBestTimeData(city)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'City Weather', item: 'https://cityweather.app/' },
      { '@type': 'ListItem', position: 2, name: `${city.name} Weather`, item: `https://cityweather.app/${city.slug}` },
      { '@type': 'ListItem', position: 3, name: `Best Time to Visit ${city.name}`, item: `https://cityweather.app/${city.slug}/best-time-to-visit` },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `When is the best time to visit ${city.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: data.bestMonths,
        },
      },
      {
        '@type': 'Question',
        name: `What is the weather like in ${city.name} in summer?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: data.seasons.find((s) => s.name.toLowerCase().includes('summer'))?.description ?? `${city.name} summers vary by climate zone.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is ${city.name} like in winter?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: data.seasons.find((s) => s.name.toLowerCase().includes('winter'))?.description ?? `${city.name} winters vary by climate zone.`,
        },
      },
      {
        '@type': 'Question',
        name: `How many days should I spend in ${city.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Most visitors spend 3–5 days in ${city.name} to experience the main neighborhoods and attractions. A week allows a more relaxed pace and the chance to explore outer districts. For a quick visit, 2–3 days covers the highlights.`,
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex gap-3 text-sm text-blue-300 mb-8">
          <Link href="/" className="hover:text-white transition">Cities</Link>
          <span>/</span>
          <Link href={`/${city.slug}`} className="hover:text-white transition">{city.flag} {city.name}</Link>
          <span>/</span>
          <span className="text-white">Best Time to Visit</span>
        </div>

        <header className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Best Time to Visit {city.name}</h1>
          <p className="text-blue-300 text-sm">{city.name}, {city.country} · {city.lat.toFixed(1)}°, {city.lon.toFixed(1)}°</p>
        </header>

        <section className="bg-white/5 rounded-2xl p-6 text-blue-200 text-sm leading-relaxed mb-8">
          <h2 className="text-white font-semibold text-lg mb-3">Overview</h2>
          <p>{data.overview}</p>
          <p className="mt-3 text-white/80">{data.bestMonths}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-white font-semibold text-lg mb-4">Season by Season</h2>
          <div className="space-y-4">
            {data.seasons.map((season) => (
              <div key={season.name} className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white font-semibold">{season.name}</h3>
                    <p className="text-blue-300 text-sm">{season.months} · {season.tempRange}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${ratingColors[season.rating]}`}>
                    {ratingLabels[season.rating]}
                  </span>
                </div>
                <p className="text-blue-200 text-sm leading-relaxed mb-3">{season.description}</p>
                <ul className="grid grid-cols-2 gap-1">
                  {season.highlights.map((h) => (
                    <li key={h} className="text-blue-300 text-xs flex items-center gap-1">
                      <span className="text-blue-400">·</span> {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-white font-semibold text-lg mb-4">Best Months to Visit</h2>
          <div className="bg-white/5 rounded-2xl p-6 text-blue-200 text-sm leading-relaxed">
            <p className="mb-3">{data.bestMonths}</p>
            <div className="mt-4">
              {data.seasons
                .filter((s) => s.rating === 'best' || s.rating === 'good')
                .map((s) => (
                  <div key={s.name} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ratingColors[s.rating]}`}>
                      {ratingLabels[s.rating]}
                    </span>
                    <span className="text-white text-sm">{s.name}</span>
                    <span className="text-blue-400 text-xs ml-auto">{s.months}</span>
                  </div>
                ))}
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-white font-semibold text-lg mb-4">What to Pack for {city.name}</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
              <h3 className="text-white font-medium mb-2 text-sm">Always Bring</h3>
              <ul className="space-y-1">
                {data.packingTips.essentials.map((item) => (
                  <li key={item} className="text-blue-200 text-sm flex items-center gap-2">
                    <span className="text-blue-400">·</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
                <h3 className="text-white font-medium mb-2 text-sm">Warm Weather</h3>
                <ul className="space-y-1">
                  {data.packingTips.warmWeather.map((item) => (
                    <li key={item} className="text-blue-200 text-xs flex items-center gap-1">
                      <span className="text-blue-400">·</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
                <h3 className="text-white font-medium mb-2 text-sm">Cold Weather</h3>
                <ul className="space-y-1">
                  {data.packingTips.coldWeather.map((item) => (
                    <li key={item} className="text-blue-200 text-xs flex items-center gap-1">
                      <span className="text-blue-400">·</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link
            href={`/${city.slug}`}
            className="inline-block text-blue-200 hover:text-white text-sm px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition"
          >
            ← View {city.name} Weather Today
          </Link>
        </div>
      </main>
    </>
  )
}
