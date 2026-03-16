export type Neighborhood = {
  name: string
  slug: string
  borough: string
  boroughSlug: string
  lat: number
  lon: number
  description?: string
}

export const NEIGHBORHOODS: Neighborhood[] = [
  // Manhattan
  {
    name: "Midtown", slug: "midtown", borough: "Manhattan", boroughSlug: "manhattan", lat: 40.7549, lon: -73.9840,
    description: "Midtown's dense canyon of skyscrapers creates its own microclimate. Wind tunnels between towers can make it feel significantly colder than surrounding areas, and the urban heat island effect keeps overnight lows warmer than outer boroughs.",
  },
  {
    name: "Upper East Side", slug: "upper-east-side", borough: "Manhattan", boroughSlug: "manhattan", lat: 40.7736, lon: -73.9566,
    description: "The Upper East Side benefits from Central Park's moderating effect to the west, which helps buffer temperatures and provides cooler breezes in summer. Its position along the East River corridor can bring gusty northeast winds in winter.",
  },
  {
    name: "Upper West Side", slug: "upper-west-side", borough: "Manhattan", boroughSlug: "manhattan", lat: 40.7870, lon: -73.9754,
    description: "Flanked by both Central Park and the Hudson River, the Upper West Side enjoys cooling summer breezes from the west. The river creates a natural wind channel, making conditions noticeably breezy along Riverside Drive.",
  },
  {
    name: "Harlem", slug: "harlem", borough: "Manhattan", boroughSlug: "manhattan", lat: 40.8116, lon: -73.9465,
    description: "Harlem sits at upper Manhattan where the island widens, placing it farther from major water bodies. Summers can be notably hotter than downtown due to dense pavement and buildings. Central Park to the south offers some heat relief.",
  },
  {
    name: "Lower East Side", slug: "lower-east-side", borough: "Manhattan", boroughSlug: "manhattan", lat: 40.7157, lon: -73.9863,
    description: "The Lower East Side's low-rise density and proximity to the East River give it more exposure to river winds than Midtown. Summer heat can concentrate in the densely packed blocks away from the waterfront.",
  },
  {
    name: "SoHo", slug: "soho", borough: "Manhattan", boroughSlug: "manhattan", lat: 40.7233, lon: -74.0030,
    description: "SoHo's cast-iron buildings and cobblestone streets absorb significant heat in summer, making it one of the warmer neighborhoods in Lower Manhattan. Its position between the Hudson and East Rivers means occasional crosswinds.",
  },
  {
    name: "Tribeca", slug: "tribeca", borough: "Manhattan", boroughSlug: "manhattan", lat: 40.7163, lon: -74.0086,
    description: "Tribeca sits near the Hudson River waterfront, which provides refreshing breezes in summer and amplifies wind chill in winter. Its low-rise character means less of the wind tunnel effect found in Midtown.",
  },
  {
    name: "Greenwich Village", slug: "greenwich-village", borough: "Manhattan", boroughSlug: "manhattan", lat: 40.7336, lon: -74.0027,
    description: "Greenwich Village's irregular street grid and mix of low and mid-rise buildings create varied microclimates block by block. Hudson Street acts as a wind corridor from the nearby river on blustery days.",
  },
  {
    name: "Chelsea", slug: "chelsea", borough: "Manhattan", boroughSlug: "manhattan", lat: 40.7465, lon: -74.0014,
    description: "Chelsea's Hudson River frontage means steady westerly breezes year-round. The High Line elevation catches more wind than street level, and the open waterfront can feel several degrees colder in winter.",
  },
  {
    name: "Financial District", slug: "financial-district", borough: "Manhattan", boroughSlug: "manhattan", lat: 40.7074, lon: -74.0113,
    description: "The Financial District sits at the southern tip of Manhattan, exposed to New York Harbor winds from multiple directions. The concentration of skyscrapers creates powerful wind tunnels. Harbor influence moderates extreme temperatures but amplifies wind chill significantly.",
  },
  {
    name: "Washington Heights", slug: "washington-heights", borough: "Manhattan", boroughSlug: "manhattan", lat: 40.8448, lon: -73.9400,
    description: "Washington Heights is one of Manhattan's highest elevations, sitting atop the Manhattan schist ridge. This gives it slightly cooler average temperatures and greater exposure to northerly winds sweeping down from the Hudson Valley.",
  },
  {
    name: "East Village", slug: "east-village", borough: "Manhattan", boroughSlug: "manhattan", lat: 40.7265, lon: -73.9815,
    description: "The East Village's dense low-rise blocks trap heat in summer but are sheltered from major winds. Avenues running north-south create long wind corridors, making cross-streets feel noticeably calmer on windy days.",
  },
  {
    name: "Hells Kitchen", slug: "hells-kitchen", borough: "Manhattan", boroughSlug: "manhattan", lat: 40.7638, lon: -73.9918,
    description: "Hell's Kitchen faces the Hudson River directly, making it one of the windier Midtown neighborhoods. Westerly gales off the river are strongest in fall and winter, and the wide cross streets funnel breezes from the water.",
  },
  {
    name: "Inwood", slug: "inwood", borough: "Manhattan", boroughSlug: "manhattan", lat: 40.8677, lon: -73.9211,
    description: "Inwood at the northern tip of Manhattan is flanked by both the Hudson and Harlem Rivers, creating a true island microclimate. The wooded Inwood Hill Park provides natural wind breaks and keeps the area slightly cooler than surrounding blocks.",
  },
  // Brooklyn
  {
    name: "Williamsburg", slug: "williamsburg", borough: "Brooklyn", boroughSlug: "brooklyn", lat: 40.7081, lon: -73.9571,
    description: "Williamsburg's East River waterfront creates a noticeable wind corridor facing lower Manhattan. In winter, northeast winds funnel down the river and hit the waterfront hard. Summer brings occasional East River breezes that cool the otherwise dense neighborhood.",
  },
  {
    name: "Park Slope", slug: "park-slope", borough: "Brooklyn", boroughSlug: "brooklyn", lat: 40.6681, lon: -73.9800,
    description: "Park Slope's name is literal — it slopes upward toward Prospect Park, which acts as a green lung moderating temperatures. The park creates cooler, breezier conditions along its perimeter compared to the warmer streets further east.",
  },
  {
    name: "DUMBO", slug: "dumbo", borough: "Brooklyn", boroughSlug: "brooklyn", lat: 40.7033, lon: -73.9882,
    description: "DUMBO sits directly beneath the Manhattan and Brooklyn Bridges with direct East River exposure on two sides. The gap between the bridges creates a reliable wind corridor, making it one of Brooklyn's breeziest spots in any season.",
  },
  {
    name: "Coney Island", slug: "coney-island", borough: "Brooklyn", boroughSlug: "brooklyn", lat: 40.5755, lon: -73.9707,
    description: "Coney Island experiences genuine Atlantic coastal weather. Ocean breezes keep summer temperatures cooler than inland Brooklyn — often 5-10°F lower on hot days. In winter, offshore winds can be biting, and the area sees above-average snowfall from nor'easters tracking up the coast.",
  },
  {
    name: "Bay Ridge", slug: "bay-ridge", borough: "Brooklyn", boroughSlug: "brooklyn", lat: 40.6350, lon: -74.0200,
    description: "Bay Ridge overlooks the Narrows where Upper New York Bay meets Lower New York Bay, giving it strong maritime influence. Harbor winds are consistent year-round, and its elevated terrain along Shore Road makes it breezier than lower Brooklyn neighborhoods.",
  },
  {
    name: "Bushwick", slug: "bushwick", borough: "Brooklyn", boroughSlug: "brooklyn", lat: 40.6944, lon: -73.9213,
    description: "Bushwick is one of Brooklyn's more inland neighborhoods, giving it warmer summers and colder winters than the waterfront. Its wide industrial blocks retain heat, and the lack of large green spaces means less temperature buffering than park-adjacent neighborhoods.",
  },
  {
    name: "Flatbush", slug: "flatbush", borough: "Brooklyn", boroughSlug: "brooklyn", lat: 40.6501, lon: -73.9496,
    description: "Flatbush sits in central Brooklyn away from major waterways, giving it a more continental microclimate. Summers can be hot and humid without the moderating ocean breezes felt at Coney Island, but it's typically well-sheltered from harbor winds.",
  },
  {
    name: "Crown Heights", slug: "crown-heights", borough: "Brooklyn", boroughSlug: "brooklyn", lat: 40.6694, lon: -73.9428,
    description: "Crown Heights sits on a slight ridge in central Brooklyn, near Prospect Park. The park buffers temperatures on warm days, and the neighborhood's tree-lined streets provide more cooling shade than surrounding areas.",
  },
  {
    name: "Bed-Stuy", slug: "bed-stuy", borough: "Brooklyn", boroughSlug: "brooklyn", lat: 40.6872, lon: -73.9418,
    description: "Bedford-Stuyvesant is a dense residential neighborhood far enough from the waterfront to experience full urban heat island conditions in summer. Its wide boulevards like Fulton Street channel winds from the west on blustery days.",
  },
  {
    name: "Greenpoint", slug: "greenpoint", borough: "Brooklyn", boroughSlug: "brooklyn", lat: 40.7242, lon: -73.9543,
    description: "Greenpoint occupies a peninsula between the East River and Newtown Creek, giving it waterfront exposure on two sides. Winds off the East River are common, and the low-rise industrial character of much of the neighborhood offers little wind shelter.",
  },
  {
    name: "Sunset Park", slug: "sunset-park", borough: "Brooklyn", boroughSlug: "brooklyn", lat: 40.6459, lon: -74.0054,
    description: "Sunset Park lives up to its name — the elevated ridge faces west toward New York Harbor with sweeping views and consistent harbor breezes. The park at the top of the hill catches more wind than the streets below, making it cooler on warm days.",
  },
  {
    name: "Brighton Beach", slug: "brighton-beach", borough: "Brooklyn", boroughSlug: "brooklyn", lat: 40.5776, lon: -73.9614,
    description: "Brighton Beach faces the Atlantic Ocean directly, sharing Coney Island's coastal weather character. Sea breezes are strongest in afternoon, keeping summer temperatures several degrees cooler than inland Brooklyn. Winter winds off the open ocean can be harsh.",
  },
  {
    name: "Red Hook", slug: "red-hook", borough: "Brooklyn", boroughSlug: "brooklyn", lat: 40.6759, lon: -74.0092,
    description: "Red Hook juts into Upper New York Bay with water on three sides, making it highly exposed to harbor weather. Its low elevation and industrial waterfront saw major flooding during Hurricane Sandy. Strong southwest winds are a near-daily occurrence along the waterfront.",
  },
  {
    name: "Bensonhurst", slug: "bensonhurst", borough: "Brooklyn", boroughSlug: "brooklyn", lat: 40.6010, lon: -73.9981,
    description: "Bensonhurst in southern Brooklyn is close enough to the coast to occasionally catch ocean breezes from the south, but its dense residential blocks buffer most wind. Summers are hot and humid, with heat moderated somewhat by its proximity to the shore.",
  },
  // Queens
  {
    name: "Flushing", slug: "flushing", borough: "Queens", boroughSlug: "queens", lat: 40.7675, lon: -73.8330,
    description: "Flushing in central-eastern Queens sits away from major waterways, giving it more extreme seasonal temperatures than coastal neighborhoods — hotter in summer and colder in winter. Flushing Bay nearby provides occasional morning fog.",
  },
  {
    name: "Astoria", slug: "astoria", borough: "Queens", boroughSlug: "queens", lat: 40.7722, lon: -73.9301,
    description: "Astoria faces the East River and the Hell Gate — one of NYC's most turbulent tidal confluences — giving it notable river winds especially on the waterfront. Its mix of low and mid-rise buildings creates varied wind exposures block to block.",
  },
  {
    name: "Jackson Heights", slug: "jackson-heights", borough: "Queens", boroughSlug: "queens", lat: 40.7557, lon: -73.8830,
    description: "Jackson Heights sits in the middle of Queens away from waterways, giving it classic urban microclimate conditions. Dense residential blocks trap heat in summer, and the relatively flat terrain means winds move freely through the wide avenues.",
  },
  {
    name: "Jamaica", slug: "jamaica", borough: "Queens", boroughSlug: "queens", lat: 40.6923, lon: -73.8061,
    description: "Jamaica is one of Queens' more inland areas, though Jamaica Bay to the south provides some coastal influence. Heat islands are common in the commercial downtown core, while residential side streets offer more tree cover and shade.",
  },
  {
    name: "Forest Hills", slug: "forest-hills", borough: "Queens", boroughSlug: "queens", lat: 40.7185, lon: -73.8458,
    description: "Forest Hills and its adjacent Forest Park create a notable green buffer that moderates temperatures. The park-adjacent streets are consistently cooler in summer than the commercial corridor on Queens Boulevard.",
  },
  {
    name: "Long Island City", slug: "long-island-city", borough: "Queens", boroughSlug: "queens", lat: 40.7447, lon: -73.9485,
    description: "Long Island City faces the East River with a direct sightline to Midtown Manhattan. Its rapidly developing waterfront is exposed to consistent river winds, and the growing cluster of towers is beginning to create wind tunnel effects similar to Manhattan.",
  },
  {
    name: "Bayside", slug: "bayside", borough: "Queens", boroughSlug: "queens", lat: 40.7624, lon: -73.7702,
    description: "Bayside sits along Little Neck Bay and the Long Island Sound approaches, giving it a maritime character. Summer sea breezes from the Sound keep temperatures noticeably cooler than central Queens on hot days.",
  },
  {
    name: "Rockaway Beach", slug: "rockaway-beach", borough: "Queens", boroughSlug: "queens", lat: 40.5862, lon: -73.8162,
    description: "Rockaway Beach is NYC's only ocean-facing beach community — a true barrier island with Atlantic Ocean to the south and Jamaica Bay to the north. Ocean breezes keep summer temperatures 5-10°F cooler than inland Queens, but winter storms can be intense, and the low elevation makes it vulnerable to storm surge.",
  },
  {
    name: "JFK Airport", slug: "jfk-airport", borough: "Queens", boroughSlug: "queens", lat: 40.6413, lon: -73.7781,
    description: "JFK Airport weather is critically important for flight operations. Located on Jamaica Bay, the airport experiences coastal fog, sea breezes, and occasional wind shear that affect runway conditions. Crosswind gusts from Jamaica Bay are a common operational factor.",
  },
  {
    name: "Elmhurst", slug: "elmhurst", borough: "Queens", boroughSlug: "queens", lat: 40.7368, lon: -73.8801,
    description: "Elmhurst in central Queens has no major waterfront exposure, giving it one of the more typical urban inland climates in the borough. Dense commercial and residential blocks contribute to heat island conditions in summer.",
  },
  {
    name: "Howard Beach", slug: "howard-beach", borough: "Queens", boroughSlug: "queens", lat: 40.6568, lon: -73.8455,
    description: "Howard Beach sits directly on Jamaica Bay, giving it strong tidal and coastal influences. Bay breezes are common throughout the year, and the low-lying terrain means the neighborhood saw significant flooding during Hurricane Sandy.",
  },
  {
    name: "Ridgewood", slug: "ridgewood", borough: "Queens", boroughSlug: "queens", lat: 40.7056, lon: -73.9041,
    description: "Ridgewood straddles the Queens-Brooklyn border on a modest ridge that gives the neighborhood slightly better drainage and airflow than the surrounding lowlands. Its residential density is lower than adjacent Bushwick, offering more green space and tree cover.",
  },
  // The Bronx
  {
    name: "South Bronx", slug: "south-bronx", borough: "The Bronx", boroughSlug: "bronx", lat: 40.8167, lon: -73.9174,
    description: "The South Bronx faces the Harlem River and East River, with significant industrial land use that contributes to heat island effects. It's one of NYC's most heat-vulnerable neighborhoods in summer, with limited tree cover and high impervious surface coverage.",
  },
  {
    name: "Pelham Bay", slug: "pelham-bay", borough: "The Bronx", boroughSlug: "bronx", lat: 40.8545, lon: -73.8102,
    description: "Pelham Bay Park — NYC's largest park — dominates this neighborhood and provides exceptional temperature buffering. Pelham Bay's Long Island Sound coastline brings maritime air and sea breezes that keep summers noticeably cooler than southern Bronx.",
  },
  {
    name: "Fordham", slug: "fordham", borough: "The Bronx", boroughSlug: "bronx", lat: 40.8610, lon: -73.8929,
    description: "Fordham sits in the central Bronx on moderate terrain. The neighborhood's urban density means heat island effects in summer, while its distance from major waterways gives it more pronounced seasonal temperature swings.",
  },
  {
    name: "Riverdale", slug: "riverdale", borough: "The Bronx", boroughSlug: "bronx", lat: 40.8981, lon: -73.9120,
    description: "Riverdale is one of the Bronx's most elevated and wooded neighborhoods, sitting on cliffs above the Hudson River. The trees and elevation keep summers notably cooler than lower Bronx neighborhoods, and Hudson River views come with consistent river breezes.",
  },
  {
    name: "Mott Haven", slug: "mott-haven", borough: "The Bronx", boroughSlug: "bronx", lat: 40.8067, lon: -73.9258,
    description: "Mott Haven at the southern tip of the Bronx is surrounded by water — the Harlem River to the west and south — but its dense urban fabric means extreme heat in summer. It consistently ranks among the hottest neighborhoods in NYC during heat waves.",
  },
  {
    name: "Throggs Neck", slug: "throggs-neck", borough: "The Bronx", boroughSlug: "bronx", lat: 40.8244, lon: -73.8283,
    description: "Throggs Neck is a peninsula extending into Long Island Sound at the confluence with the East River. Its coastal position on three sides means persistent maritime breezes and moderate temperatures, buffered from inland heat.",
  },
  {
    name: "Concourse", slug: "concourse", borough: "The Bronx", boroughSlug: "bronx", lat: 40.8367, lon: -73.9219,
    description: "The Grand Concourse area sits on the central Bronx ridge, making it slightly elevated above adjacent valleys. The wide boulevard of the Grand Concourse itself acts as a wind channel, bringing some airflow through the otherwise dense residential fabric.",
  },
  {
    name: "Tremont", slug: "tremont", borough: "The Bronx", boroughSlug: "bronx", lat: 40.8479, lon: -73.8983,
    description: "Tremont in the central Bronx has a mix of dense residential blocks and proximity to Bronx Park, which provides a degree of temperature moderation. Summers can be hot due to urban density, but parks nearby offer cooler refuges.",
  },
  // Staten Island
  {
    name: "St. George", slug: "st-george", borough: "Staten Island", boroughSlug: "staten-island", lat: 40.6437, lon: -74.0738,
    description: "St. George sits at Staten Island's northern tip facing New York Harbor, with ferry terminal winds and harbor exposure year-round. Its hillside position above the ferry terminal gives it sweeping harbor views and consistent breezes from the Kill van Kull waterway.",
  },
  {
    name: "Great Kills", slug: "great-kills", borough: "Staten Island", boroughSlug: "staten-island", lat: 40.5510, lon: -74.1502,
    description: "Great Kills on Staten Island's southeastern shore faces Raritan Bay, bringing Atlantic coastal weather influence. The Great Kills Harbor provides sheltered anchorage but the open bay to the south means strong southerly winds in summer storms.",
  },
  {
    name: "Stapleton", slug: "stapleton", borough: "Staten Island", boroughSlug: "staten-island", lat: 40.6282, lon: -74.0754,
    description: "Stapleton faces the Kill van Kull strait with views of Bayonne, NJ, giving it consistent tidal winds from the harbor. Its waterfront location has made it a target for coastal resilience projects following Hurricane Sandy.",
  },
  {
    name: "New Dorp", slug: "new-dorp", borough: "Staten Island", boroughSlug: "staten-island", lat: 40.5731, lon: -74.1130,
    description: "New Dorp sits in the middle of Staten Island with Atlantic Coast access to the southeast. Close enough to the coast to feel ocean influence in summer, while the island's wooded interior provides natural windbreaks for the residential streets.",
  },
  {
    name: "Tottenville", slug: "tottenville", borough: "Staten Island", boroughSlug: "staten-island", lat: 40.5126, lon: -74.2518,
    description: "Tottenville at Staten Island's southern tip is NYC's southernmost neighborhood, facing Raritan Bay and the Arthur Kill. Its exposed coastal location means it catches the full force of southerly storms and nor'easters, and is one of the more wind-exposed residential areas in the city.",
  },
  {
    name: "Snug Harbor", slug: "snug-harbor", borough: "Staten Island", boroughSlug: "staten-island", lat: 40.6424, lon: -74.1018,
    description: "Snug Harbor Cultural Center's grounds provide significant green space along Staten Island's north shore. The park's trees and open lawns buffer winds from Kill van Kull and offer cooler conditions than the surrounding dense streets on summer days.",
  },
]

export function getNeighborhoodsByBorough(boroughSlug: string): Neighborhood[] {
  return NEIGHBORHOODS.filter((n) => n.boroughSlug === boroughSlug)
}
