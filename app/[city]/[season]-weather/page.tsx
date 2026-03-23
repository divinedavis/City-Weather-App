import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CITIES, getCity } from '@/lib/cities'
import type { Metadata } from 'next'

export const revalidate = 86400

const SEASONS = ['summer', 'winter', 'spring', 'fall'] as const
type Season = typeof SEASONS[number]

// Northern hemisphere month ranges per season
const NORTHERN_SEASONS: Record<Season, { months: string[]; monthNums: number[]; desc: string }> = {
  summer: {
    months: ['June', 'July', 'August'],
    monthNums: [6, 7, 8],
    desc: 'warm and sunny',
  },
  winter: {
    months: ['December', 'January', 'February'],
    monthNums: [12, 1, 2],
    desc: 'cold with potential snow',
  },
  spring: {
    months: ['March', 'April', 'May'],
    monthNums: [3, 4, 5],
    desc: 'mild with blooming greenery',
  },
  fall: {
    months: ['September', 'October', 'November'],
    monthNums: [9, 10, 11],
    desc: 'cooling with foliage',
  },
}

// Southern hemisphere flips summer/winter, spring/fall
const SOUTHERN_SEASONS: Record<Season, { months: string[]; monthNums: number[]; desc: string }> = {
  summer: {
    months: ['December', 'January', 'February'],
    monthNums: [12, 1, 2],
    desc: 'hot with potential thunderstorms',
  },
  winter: {
    months: ['June', 'July', 'August'],
    monthNums: [6, 7, 8],
    desc: 'cool and dry',
  },
  spring: {
    months: ['September', 'October', 'November'],
    monthNums: [9, 10, 11],
    desc: 'warming with blooms',
  },
  fall: {
    months: ['March', 'April', 'May'],
    monthNums: [3, 4, 5],
    desc: 'cooling with changing leaves',
  },
}

const SEASON_LABELS: Record<Season, string> = {
  summer: 'Summer',
  winter: 'Winter',
  spring: 'Spring',
  fall: 'Fall',
}

const MONTH_SLUGS: Record<number, string> = {
  1: 'january', 2: 'february', 3: 'march', 4: 'april',
  5: 'may', 6: 'june', 7: 'july', 8: 'august',
  9: 'september', 10: 'october', 11: 'november', 12: 'december',
}

export async function generateStaticParams() {
  const params: { city: string; season: string }[] = []
  for (const city of CITIES) {
    for (const season of SEASONS) {
      params.push({ city: city.slug, season })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; season: string }>
}): Promise<Metadata> {
  const { city: slug, season } = await params
  const city = getCity(slug)
  if (!city || !SEASONS.includes(season as Season)) return {}
  const label = SEASON_LABELS[season as Season]
  const url = `https://cityweather.app/${city.slug}/${season}-weather`
  return {
    title: `${city.name} ${label} Weather | What to Expect`,
    description: `${label} weather in ${city.name}, ${city.country}: typical temperatures, conditions, best neighborhoods, and monthly forecasts for ${label.toLowerCase()} ${city.lat >= 0 ? '(northern hemisphere)' : '(southern hemisphere)'}.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${city.name} ${label} Weather Guide`,
      description: `What is ${label.toLowerCase()} like in ${city.name}? Temperatures, rainfall, and what to wear.`,
      url,
    },
  }
}

export default async function SeasonalPage({
  params,
}: {
  params: Promise<{ city: string; season: string }>
}) {
  const { city: slug, season } = await params
  const city = getCity(slug)
  if (!city || !SEASONS.includes(season as Season)) notFound()

  const s = season as Season
  const label = SEASON_LABELS[s]
  const isSouthern = city.lat < 0
  const seasonData = isSouthern ? SOUTHERN_SEASONS[s] : NORTHERN_SEASONS[s]

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'City Weather', item: 'https://cityweather.app/' },
      { '@type': 'ListItem', position: 2, name: `${city.name} Weather`, item: `https://cityweather.app/${city.slug}` },
      { '@type': 'ListItem', position: 3, name: `${label} Weather`, item: `https://cityweather.app/${city.slug}/${season}-weather` },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is ${label.toLowerCase()} like in ${city.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${city.name} ${label.toLowerCase()} typically runs from ${seasonData.months.join(', ')} and is ${seasonData.desc}. ${city.description}`,
        },
      },
      {
        '@type': 'Question',
        name: `What months are ${label.toLowerCase()} in ${city.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${label} in ${city.name} covers ${seasonData.months.join(', ')}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What should I wear in ${city.name} in ${label.toLowerCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: s === 'summer' ? `Light, breathable clothing. Sun protection is important in ${city.name} during summer.` :
                s === 'winter' ? `Warm layers, a coat, and waterproof shoes are recommended for ${city.name} in winter.` :
                s === 'spring' ? `Layers work well for ${city.name} spring weather — mornings can be cool while afternoons warm up.` :
                `A light jacket and layers are ideal for ${city.name} fall, when temperatures cool but remain comfortable.`,
        },
      },
    ],
  }

  const topDistricts = city.districts.slice(0, 6)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <nav className="text-sm text-blue-400 mb-8">
            <Link href="/" className="hover:text-blue-200">City Weather</Link>
            <span className="mx-2 text-slate-500">/</span>
            <Link href={`/${city.slug}`} className="hover:text-blue-200">{city.name}</Link>
            <span className="mx-2 text-slate-500">/</span>
            <span className="text-slate-300">{label} Weather</span>
          </nav>

          <div className="mb-10">
            <div className="text-5xl mb-4">{city.flag}</div>
            <h1 className="text-4xl font-bold mb-3">{city.name} {label} Weather</h1>
            <p className="text-blue-300 text-lg">
              {label} in {city.name} runs from{' '}
              <strong className="text-white">{seasonData.months[0]} through {seasonData.months[seasonData.months.length - 1]}</strong>
              {' '}and is typically <strong className="text-white">{seasonData.desc}</strong>.
            </p>
          </div>

          <section className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
            <h2 className="text-2xl font-semibold mb-4">{label} Overview</h2>
            <p className="text-slate-300 leading-relaxed mb-4">{city.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {seasonData.months.map((month) => (
                <span key={month} className="bg-blue-900/50 text-blue-200 px-3 py-1 rounded-full text-sm border border-blue-700/50">
                  {month}
                </span>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Monthly Weather Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {seasonData.monthNums.map((num) => {
                const mSlug = MONTH_SLUGS[num]
                const mName = seasonData.months[seasonData.monthNums.indexOf(num)]
                return (
                  <Link
                    key={num}
                    href={`/${city.slug}/weather/${mSlug}`}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-colors"
                  >
                    <div className="text-lg font-semibold">{mName}</div>
                    <div className="text-blue-400 text-sm mt-1">View {mName} forecast →</div>
                  </Link>
                )
              })}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Neighborhoods in {label}</h2>
            <p className="text-slate-400 mb-4 text-sm">
              Weather varies across {city.name}'s neighborhoods. Here are the top areas to check during {label.toLowerCase()}.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {topDistricts.map((d) => (
                <Link
                  key={d.slug}
                  href={`/${city.slug}/${d.slug}`}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-colors"
                >
                  <div className="font-medium text-sm">{d.name}</div>
                  <div className="text-blue-400 text-xs mt-1">Current weather →</div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">FAQ: {city.name} {label} Weather</h2>
            <div className="space-y-4">
              {faqSchema.mainEntity.map((qa, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <h3 className="font-semibold text-white mb-2">{qa.name}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{qa.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="border-t border-white/10 pt-6">
            <Link href={`/${city.slug}`} className="text-blue-400 hover:text-blue-200 text-sm">
              ← Back to {city.name} weather overview
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
