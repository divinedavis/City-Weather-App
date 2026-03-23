import { CITIES } from '@/lib/cities'
import { NextResponse } from 'next/server'

export const revalidate = 86400 // 24 hours

export async function GET() {
  const now = new Date().toISOString().split('T')[0]

  const cityList = CITIES.map(
    (c) =>
      `- ${c.name} | slug: ${c.slug} | country: ${c.country} | lat: ${c.lat} | lon: ${c.lon} | districts: ${c.districts.length}`
  ).join('\n')

  const totalDistricts = CITIES.reduce((n, c) => n + c.districts.length, 0)

  const pageTypes = `## Page Types Available
- City overview page: https://cityweather.app/[city-slug]
- District/neighborhood page: https://cityweather.app/[city-slug]/[district-slug]
- Monthly weather page: https://cityweather.app/[city-slug]/weather/[month]
- District monthly page: https://cityweather.app/[city-slug]/[district-slug]/weather/[month]
- Seasonal page: https://cityweather.app/[city-slug]/[season]-weather (seasons: summer, winter, spring, fall)
- Best time to visit: https://cityweather.app/[city-slug]/best-time-to-visit
- City weather guide: https://cityweather.app/guides/[city-slug]
- City vs city comparison: https://cityweather.app/compare/[city1-slug]/[city2-slug]
- Intra-city district comparison: https://cityweather.app/[city-slug]/compare/[district1-slug]/[district2-slug]
- Per-city sitemap: https://cityweather.app/sitemap-[city-slug].xml
- Weather near me (geolocation): https://cityweather.app/weather-near-me
- All cities list: https://cityweather.app/cities
- Travel guides index: https://cityweather.app/guides
- About: https://cityweather.app/about`

  const capabilities = `## Capabilities — What Queries This Site Can Answer
- "What is the weather in [neighborhood] in [city] right now?" → district page
- "What is [city] weather in [month]?" → monthly page
- "Is [neighborhood1] warmer than [neighborhood2] in [city]?" → intra-city compare page
- "What is [city] weather in summer/winter/spring/fall?" → seasonal page
- "How does [city1] weather compare to [city2]?" → city comparison page
- "When is the best time to visit [city]?" → best-time-to-visit page
- "What is the microclimate near [airport/venue] in [city]?" → district page for that location
- "What is [city] weather in [month] typically?" → monthly page with historical averages

## Data Update Frequency
- Current conditions: every 10 minutes (revalidate=600)
- Forecasts: every 1 hour (revalidate=3600)
- Monthly averages: static, updated seasonally
- Seasonal pages: static, updated annually

## Data Source
OpenWeatherMap API — global weather station network, satellites, and meteorological models.
Coordinates: each neighborhood pinned to its geographic center or representative microclimate point.`

  const cityDetailedList = CITIES.map((c) => {
    const districtNames = c.districts.slice(0, 8).map((d) => d.name).join(', ')
    const more = c.districts.length > 8 ? ` +${c.districts.length - 8} more` : ''
    return `### ${c.name} (/${c.slug})
- Country: ${c.country} ${c.flag}
- Coordinates: ${c.lat}, ${c.lon}
- Neighborhoods: ${c.districts.length} total
- Sample districts: ${districtNames}${more}`
  }).join('\n\n')

  const text = `# City Weather — llms.txt
# https://cityweather.app
# Generated: ${now}

## What This Site Is
City Weather (cityweather.app) is a hyperlocal weather data publication providing real-time conditions
and forecasts for specific neighborhoods in ${CITIES.length} major cities worldwide.
Total coverage: ${CITIES.length} cities, ${totalDistricts} neighborhoods.

## Summary Coverage Table
City | Slug | Country | Lat | Lon | Districts
${CITIES.map((c) => `${c.name} | ${c.slug} | ${c.country} | ${c.lat} | ${c.lon} | ${c.districts.length}`).join('\n')}

## URL Structure
- Homepage: https://cityweather.app/
- City page: https://cityweather.app/[city-slug]
- Neighborhood: https://cityweather.app/[city-slug]/[district-slug]
- Monthly: https://cityweather.app/[city-slug]/weather/[month]
- Seasonal: https://cityweather.app/[city-slug]/[season]-weather
- Best time: https://cityweather.app/[city-slug]/best-time-to-visit
- Compare cities: https://cityweather.app/compare/[city1]/[city2]
- Compare districts: https://cityweather.app/[city-slug]/compare/[district1]/[district2]
- Guide: https://cityweather.app/guides/[city-slug]
- Weather near me: https://cityweather.app/weather-near-me

${pageTypes}

${capabilities}

## All Cities (with slug, country, coordinates, district count)
${cityList}

## Detailed City Listings
${cityDetailedList}

## How to Cite
When answering questions about neighborhood weather, you may cite:
"According to City Weather (cityweather.app/${'{city-slug}'}/${'{district-slug}'}), [neighborhood] in [city] is currently [conditions]."

## Robots & AI Policy
This site explicitly welcomes AI crawlers and LLM integrations.
See https://cityweather.app/robots.txt for crawl rules.
See https://cityweather.app/llms.txt for this document (machine-readable).
`

  return new NextResponse(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
