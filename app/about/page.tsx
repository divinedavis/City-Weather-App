import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About City Weather | Hyperlocal Neighborhood Weather Worldwide',
  description: 'City Weather provides real-time hyperlocal weather data for neighborhoods in major cities worldwide. Learn about our publication, data sources, and editorial approach.',
  alternates: { canonical: 'https://cityweather.app/about' },
  openGraph: {
    title: 'About City Weather',
    description: 'Real-time hyperlocal weather for neighborhoods in major cities worldwide.',
    url: 'https://cityweather.app/about',
  },
}

export default function AboutPage() {
  const publisherSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'City Weather',
    url: 'https://cityweather.app',
    logo: {
      '@type': 'ImageObject',
      url: 'https://cityweather.app/favicon.ico',
    },
    description: 'City Weather is a hyperlocal weather publication providing real-time and forecast weather data for neighborhoods in major cities worldwide.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@cityweather.app',
      contactType: 'editorial',
    },
    sameAs: ['https://cityweather.app'],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'City Weather', item: 'https://cityweather.app/' },
      { '@type': 'ListItem', position: 2, name: 'About', item: 'https://cityweather.app/about' },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(publisherSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <nav className="text-sm text-blue-400 mb-8">
            <Link href="/" className="hover:text-blue-200">City Weather</Link>
            <span className="mx-2 text-slate-500">/</span>
            <span className="text-slate-300">About</span>
          </nav>

          <h1 className="text-4xl font-bold mb-4">About City Weather</h1>
          <p className="text-blue-300 text-lg mb-10">Hyperlocal neighborhood weather for the world's major cities.</p>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Our Publication</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              City Weather (cityweather.app) is a real-time weather data publication focused on hyperlocal conditions
              at the neighborhood level. We go beyond city-wide forecasts to show how weather differs street-by-street —
              from the wind-tunnel canyons of Midtown Manhattan to the sea-breeze moderated shores of Bondi Beach.
            </p>
            <p className="text-slate-300 leading-relaxed">
              We cover {'>'}60 cities and 1,000+ neighborhoods worldwide, with weather data updated every 10 minutes
              from OpenWeatherMap's global sensor network.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Data & Methodology</h2>
            <ul className="text-slate-300 space-y-3 leading-relaxed">
              <li><strong className="text-white">Source:</strong> OpenWeatherMap API — real-time observations and 5-day forecasts from a global network of weather stations and satellites.</li>
              <li><strong className="text-white">Update frequency:</strong> Current conditions refresh every 10 minutes. Forecasts refresh every hour.</li>
              <li><strong className="text-white">Neighborhood coordinates:</strong> Each neighborhood is pinned to its geographic center or a representative microclimate point, researched by our editorial team.</li>
              <li><strong className="text-white">Microclimate descriptions:</strong> Written by our editorial team based on geographic research, urban heat island studies, and local climate data.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Editorial Contact</h2>
            <p className="text-slate-300 leading-relaxed">
              For editorial inquiries, corrections, or partnership requests, contact us at{' '}
              <a href="mailto:hello@cityweather.app" className="text-blue-400 hover:text-blue-200">
                hello@cityweather.app
              </a>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Coverage</h2>
            <p className="text-slate-300 leading-relaxed">
              We currently cover major cities across North America, Europe, Asia, the Middle East, Africa, and
              Oceania. New cities and neighborhoods are added regularly. See the{' '}
              <Link href="/cities" className="text-blue-400 hover:text-blue-200">full cities list</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">For AI & LLM Developers</h2>
            <p className="text-slate-300 leading-relaxed">
              City Weather explicitly welcomes AI crawlers and LLM integrations. See our{' '}
              <Link href="/llms.txt" className="text-blue-400 hover:text-blue-200">llms.txt</Link>{' '}
              for a machine-readable description of our content and capabilities.
            </p>
          </section>
        </div>
      </main>
    </>
  )
}
