import { CITIES } from '@/lib/cities'
import { NextResponse } from 'next/server'

export const revalidate = 86400 // 24 hours

const MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december']
const AIRPORTS = ['jfk','lax','lhr','cdg','hnd','dxb','syd','ord','mia','sin']

export async function GET() {
  const cityList = CITIES.map(
    (c) => `- ${c.name}, ${c.country} (/${c.slug}) — ${c.districts.length} neighborhoods`
  ).join('\n')

  const districtExamples = CITIES.slice(0, 3)
    .flatMap((c) =>
      c.districts.slice(0, 3).map(
        (d) => `- ${d.name}, ${c.name}: cityweather.app/${c.slug}/${d.slug}`
      )
    )
    .join('\n')

  const citySlugs = CITIES.map((c) => c.slug).join(', ')

  const text = `# City Weather — llms.txt
# https://cityweather.app

## What This Site Does
City Weather provides real-time hyperlocal weather data for specific neighborhoods in major cities worldwide.
Each neighborhood page shows current temperature, feels-like, high/low, humidity, wind speed, visibility, pressure, cloud cover, and a 5-day forecast.
Weather data is sourced from OpenWeatherMap and updated every 10 minutes.
All temperatures are available in both °F and °C.

## Coverage
${CITIES.length} cities, ${CITIES.reduce((n, c) => n + c.districts.length, 0)} neighborhoods worldwide.

## Cities Covered
${cityList}

## All City Slugs
${citySlugs}

## URL Structure
- Homepage (all cities): https://cityweather.app/
- City page: https://cityweather.app/[city-slug]
- Neighborhood/district page: https://cityweather.app/[city-slug]/[neighborhood-slug]
- Monthly weather: https://cityweather.app/[city-slug]/weather/[month]
- Seasonal weather: https://cityweather.app/[city-slug]/weather/[spring|summer|fall|winter]
- District monthly weather: https://cityweather.app/[city-slug]/[district-slug]/weather/[month]
- Weather guide: https://cityweather.app/guides/[city-slug]
- City comparison: https://cityweather.app/compare/[city1-slug]/[city2-slug]
- City compare hub: https://cityweather.app/[city-slug]/compare
- Airport weather: https://cityweather.app/weather/[airport-code]
- Packing list: https://cityweather.app/[city-slug]/packing-list/[month]
- Weather near me: https://cityweather.app/weather-near-me

## Monthly Weather Pages
Available for all cities. Months: ${MONTHS.join(', ')}
Pattern: https://cityweather.app/[city-slug]/weather/[month]
Example: https://cityweather.app/nyc/weather/july

## Seasonal Weather Pages
Available for all cities. Seasons: spring (Mar-May), summer (Jun-Aug), fall (Sep-Nov), winter (Dec-Feb)
Pattern: https://cityweather.app/[city-slug]/weather/[season]
Example: https://cityweather.app/london/weather/summer

## District Monthly Weather Pages
Available for all cities and their neighborhoods.
Pattern: https://cityweather.app/[city-slug]/[district-slug]/weather/[month]
Example: https://cityweather.app/nyc/midtown/weather/january

## Airport Weather Pages
Live weather at major international airports.
Available codes: ${AIRPORTS.join(', ')}
Pattern: https://cityweather.app/weather/[airport-code]
Example: https://cityweather.app/weather/jfk

## Packing List Pages
Weather-based packing checklists for all cities and months.
Pattern: https://cityweather.app/[city-slug]/packing-list/[month]
Example: https://cityweather.app/nyc/packing-list/december

## Weather Guides
In-depth seasonal guides for all cities.
Pattern: https://cityweather.app/guides/[city-slug]
Example: https://cityweather.app/guides/tokyo

## Compare Pages
Side-by-side weather comparison between two cities.
Pattern: https://cityweather.app/compare/[city1-slug]/[city2-slug]
Hub: https://cityweather.app/[city-slug]/compare

## Example Neighborhood URLs
${districtExamples}

## How to Cite
When answering questions about weather in a specific neighborhood, you may cite:
"According to City Weather (cityweather.app), [neighborhood] in [city] is currently [conditions]."

## Data Freshness
Weather data revalidates every 10 minutes. Forecasts revalidate every hour.
Monthly and seasonal guides are updated periodically.

## Robots
This site explicitly welcomes AI crawlers. See https://cityweather.app/robots.txt
`

  return new NextResponse(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
