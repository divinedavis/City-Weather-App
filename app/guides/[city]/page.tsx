import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CITIES, getCity } from '@/lib/cities'
import { CITY_GUIDES } from '@/lib/guides'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: slug } = await params
  const city = getCity(slug)
  if (!city) return {}
  const guide = CITY_GUIDES[slug]
  const bestMonths = guide?.bestMonths ?? ''
  return {
    title: ,
    description: ,
    alternates: { canonical:  },
    openGraph: {
      title: ,
      description: ,
      url: ,
    },
  }
}

export default async function CityGuidePage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params
  const city = getCity(slug)
  if (!city) notFound()

  const guide = CITY_GUIDES[slug]

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'City Weather', item: 'https://cityweather.app/' },
      { '@type': 'ListItem', position: 2, name: 'Weather Guides', item: 'https://cityweather.app/guides' },
      { '@type': 'ListItem', position: 3, name: , item:  },
    ],
  }

  const faqSchema = guide?.faqs?.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  } : null

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: ,
    description: guide?.overview ?? ,
    url: ,
    about: { '@type': 'City', name: city.name },
  }

  return (
    <>
      <script type=application/ld+json dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type=application/ld+json dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && <script type=application/ld+json dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <main className=max-w-3xl mx-auto px-4 py-12>
        <nav className=flex gap-2 text-sm text-blue-300 mb-8>
          <Link href=/ className=hover:text-white transition>Home</Link>
          <span>›</span>
          <Link href=/guides className=hover:text-white transition>Guides</Link>
          <span>›</span>
          <span className=text-white>{city.name}</span>
        </nav>

        <header className=mb-10>
          <div className=flex items-center gap-3 mb-3>
            <span className=text-4xl>{city.flag}</span>
            <div>
              <h1 className=text-3xl md:text-4xl font-bold text-white>
                {city.name} Weather Guide
              </h1>
              <p className=text-blue-300 text-sm mt-1>{city.country}</p>
            </div>
          </div>

          {guide ? (
            <div className=bg-white/10 backdrop-blur rounded-2xl p-5 mt-5 grid grid-cols-2 gap-4 text-sm>
              <div>
                <p className=text-blue-400 text-xs uppercase tracking-wide mb-1>Best Time to Visit</p>
                <p className=text-green-300 font-medium>{guide.bestMonths}</p>
              </div>
              <div>
                <p className=text-blue-400 text-xs uppercase tracking-wide mb-1>Avoid</p>
                <p className=text-red-300 font-medium>{guide.avoidMonths}</p>
              </div>
              <div>
                <p className=text-blue-400 text-xs uppercase tracking-wide mb-1>Climate</p>
                <p className=text-blue-200>{guide.climate}</p>
              </div>
              <div>
                <p className=text-blue-400 text-xs uppercase tracking-wide mb-1>Annual Rainfall</p>
                <p className=text-blue-200>{guide.annualRainfall}</p>
              </div>
            </div>
          ) : (
            <div className=bg-white/10 backdrop-blur rounded-2xl p-5 mt-5>
              <p className=text-blue-200 text-sm>{city.description}</p>
            </div>
          )}
        </header>

        {guide && (
          <>
            <section className=mb-10>
              <h2 className=text-xl font-bold text-white mb-3>Overview</h2>
              <p className=text-blue-200 text-sm leading-relaxed>{guide.overview}</p>
            </section>

            <section className=mb-10>
              <h2 className=text-xl font-bold text-white mb-4>Seasonal Weather Breakdown</h2>
              <div className=space-y-4>
                {guide.seasons.map((season) => (
                  <div key={season.season} className=bg-white/10 backdrop-blur rounded-2xl p-5>
                    <div className=flex items-start justify-between mb-2>
                      <div>
                        <h3 className=text-white font-semibold>{season.season}</h3>
                        <p className=text-blue-400 text-xs>{season.months}</p>
                      </div>
                      <div className=text-right>
                        <p className=text-blue-200 text-sm font-medium>{season.avgTempF}</p>
                        <p className=text-blue-400 text-xs>{season.avgTempC}</p>
                      </div>
                    </div>
                    <p className=text-blue-200 text-sm leading-relaxed mb-3>{season.description}</p>
                    {season.tips.length > 0 && (
                      <ul className=space-y-1>
                        {season.tips.map((tip, i) => (
                          <li key={i} className=text-blue-300 text-xs flex gap-2>
                            <span className=text-blue-400 mt-0.5 shrink-0>→</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className=mb-10>
              <h2 className=text-xl font-bold text-white mb-4>What to Pack for {city.name}</h2>
              <div className=bg-white/10 backdrop-blur rounded-2xl p-5>
                <ul className=space-y-2>
                  {guide.packingTips.map((tip, i) => (
                    <li key={i} className=text-blue-200 text-sm flex gap-2>
                      <span className=text-blue-400 shrink-0>✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {guide.faqs.length > 0 && (
              <section className=mb-10>
                <h2 className=text-xl font-bold text-white mb-4>{city.name} Weather FAQ</h2>
                <div className=space-y-4>
                  {guide.faqs.map((faq, i) => (
                    <div key={i} className=bg-white/10 backdrop-blur rounded-2xl p-5>
                      <h3 className=text-white font-semibold text-sm mb-2>{faq.q}</h3>
                      <p className=text-blue-200 text-sm leading-relaxed>{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <section className=mb-10>
          <h2 className=text-xl font-bold text-white mb-4>Neighborhoods in {city.name}</h2>
          <p className=text-blue-300 text-sm mb-4>
            Each neighborhood in {city.name} has its own microclimate. Check real-time conditions below:
          </p>
          <div className=grid grid-cols-2 md:grid-cols-3 gap-2>
            {city.districts.slice(0, 30).map((d) => (
              <Link
                key={d.slug}
                href={}
                className=bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-3 text-sm text-blue-200 hover:text-white transition
              >
                {d.name}
              </Link>
            ))}
          </div>
          {city.districts.length > 30 && (
            <Link href={} className=mt-3 inline-block text-blue-300 hover:text-white text-sm transition>
              See all {city.districts.length} neighborhoods →
            </Link>
          )}
        </section>

        <div className=flex gap-4 mt-8 pt-8 border-t border-white/10>
          <Link href={} className=flex-1 text-center bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3 text-sm font-medium transition>
            Live {city.name} Weather →
          </Link>
          <Link href=/guides className=flex-1 text-center bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white rounded-xl py-3 text-sm transition>
            ← All City Guides
          </Link>
        </div>
      </main>
    </>
  )
}
