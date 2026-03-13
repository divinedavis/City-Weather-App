export type Neighborhood = {
  name: string
  slug: string
  borough: string
  boroughSlug: string
  lat: number
  lon: number
}

export const NEIGHBORHOODS: Neighborhood[] = [
  // Manhattan
  { name: "Midtown",            slug: "midtown",            borough: "Manhattan",     boroughSlug: "manhattan",     lat: 40.7549, lon: -73.9840 },
  { name: "Upper East Side",    slug: "upper-east-side",    borough: "Manhattan",     boroughSlug: "manhattan",     lat: 40.7736, lon: -73.9566 },
  { name: "Upper West Side",    slug: "upper-west-side",    borough: "Manhattan",     boroughSlug: "manhattan",     lat: 40.7870, lon: -73.9754 },
  { name: "Harlem",             slug: "harlem",             borough: "Manhattan",     boroughSlug: "manhattan",     lat: 40.8116, lon: -73.9465 },
  { name: "Lower East Side",    slug: "lower-east-side",    borough: "Manhattan",     boroughSlug: "manhattan",     lat: 40.7157, lon: -73.9863 },
  { name: "SoHo",               slug: "soho",               borough: "Manhattan",     boroughSlug: "manhattan",     lat: 40.7233, lon: -74.0030 },
  { name: "Tribeca",            slug: "tribeca",            borough: "Manhattan",     boroughSlug: "manhattan",     lat: 40.7163, lon: -74.0086 },
  { name: "Greenwich Village",  slug: "greenwich-village",  borough: "Manhattan",     boroughSlug: "manhattan",     lat: 40.7336, lon: -74.0027 },
  { name: "Chelsea",            slug: "chelsea",            borough: "Manhattan",     boroughSlug: "manhattan",     lat: 40.7465, lon: -74.0014 },
  { name: "Financial District", slug: "financial-district", borough: "Manhattan",     boroughSlug: "manhattan",     lat: 40.7074, lon: -74.0113 },
  { name: "Washington Heights", slug: "washington-heights", borough: "Manhattan",     boroughSlug: "manhattan",     lat: 40.8448, lon: -73.9400 },
  { name: "East Village",       slug: "east-village",       borough: "Manhattan",     boroughSlug: "manhattan",     lat: 40.7265, lon: -73.9815 },
  { name: "Hells Kitchen",      slug: "hells-kitchen",      borough: "Manhattan",     boroughSlug: "manhattan",     lat: 40.7638, lon: -73.9918 },
  { name: "Inwood",             slug: "inwood",             borough: "Manhattan",     boroughSlug: "manhattan",     lat: 40.8677, lon: -73.9211 },
  // Brooklyn
  { name: "Williamsburg",       slug: "williamsburg",       borough: "Brooklyn",      boroughSlug: "brooklyn",      lat: 40.7081, lon: -73.9571 },
  { name: "Park Slope",         slug: "park-slope",         borough: "Brooklyn",      boroughSlug: "brooklyn",      lat: 40.6681, lon: -73.9800 },
  { name: "DUMBO",              slug: "dumbo",              borough: "Brooklyn",      boroughSlug: "brooklyn",      lat: 40.7033, lon: -73.9882 },
  { name: "Coney Island",       slug: "coney-island",       borough: "Brooklyn",      boroughSlug: "brooklyn",      lat: 40.5755, lon: -73.9707 },
  { name: "Bay Ridge",          slug: "bay-ridge",          borough: "Brooklyn",      boroughSlug: "brooklyn",      lat: 40.6350, lon: -74.0200 },
  { name: "Bushwick",           slug: "bushwick",           borough: "Brooklyn",      boroughSlug: "brooklyn",      lat: 40.6944, lon: -73.9213 },
  { name: "Flatbush",           slug: "flatbush",           borough: "Brooklyn",      boroughSlug: "brooklyn",      lat: 40.6501, lon: -73.9496 },
  { name: "Crown Heights",      slug: "crown-heights",      borough: "Brooklyn",      boroughSlug: "brooklyn",      lat: 40.6694, lon: -73.9428 },
  { name: "Bed-Stuy",           slug: "bed-stuy",           borough: "Brooklyn",      boroughSlug: "brooklyn",      lat: 40.6872, lon: -73.9418 },
  { name: "Greenpoint",         slug: "greenpoint",         borough: "Brooklyn",      boroughSlug: "brooklyn",      lat: 40.7242, lon: -73.9543 },
  { name: "Sunset Park",        slug: "sunset-park",        borough: "Brooklyn",      boroughSlug: "brooklyn",      lat: 40.6459, lon: -74.0054 },
  { name: "Brighton Beach",     slug: "brighton-beach",     borough: "Brooklyn",      boroughSlug: "brooklyn",      lat: 40.5776, lon: -73.9614 },
  { name: "Red Hook",           slug: "red-hook",           borough: "Brooklyn",      boroughSlug: "brooklyn",      lat: 40.6759, lon: -74.0092 },
  { name: "Bensonhurst",        slug: "bensonhurst",        borough: "Brooklyn",      boroughSlug: "brooklyn",      lat: 40.6010, lon: -73.9981 },
  // Queens
  { name: "Flushing",           slug: "flushing",           borough: "Queens",        boroughSlug: "queens",        lat: 40.7675, lon: -73.8330 },
  { name: "Astoria",            slug: "astoria",            borough: "Queens",        boroughSlug: "queens",        lat: 40.7722, lon: -73.9301 },
  { name: "Jackson Heights",    slug: "jackson-heights",    borough: "Queens",        boroughSlug: "queens",        lat: 40.7557, lon: -73.8830 },
  { name: "Jamaica",            slug: "jamaica",            borough: "Queens",        boroughSlug: "queens",        lat: 40.6923, lon: -73.8061 },
  { name: "Forest Hills",       slug: "forest-hills",       borough: "Queens",        boroughSlug: "queens",        lat: 40.7185, lon: -73.8458 },
  { name: "Long Island City",   slug: "long-island-city",   borough: "Queens",        boroughSlug: "queens",        lat: 40.7447, lon: -73.9485 },
  { name: "Bayside",            slug: "bayside",            borough: "Queens",        boroughSlug: "queens",        lat: 40.7624, lon: -73.7702 },
  { name: "Rockaway Beach",     slug: "rockaway-beach",     borough: "Queens",        boroughSlug: "queens",        lat: 40.5862, lon: -73.8162 },
  { name: "JFK Airport",        slug: "jfk-airport",        borough: "Queens",        boroughSlug: "queens",        lat: 40.6413, lon: -73.7781 },
  { name: "Elmhurst",           slug: "elmhurst",           borough: "Queens",        boroughSlug: "queens",        lat: 40.7368, lon: -73.8801 },
  { name: "Howard Beach",       slug: "howard-beach",       borough: "Queens",        boroughSlug: "queens",        lat: 40.6568, lon: -73.8455 },
  { name: "Ridgewood",          slug: "ridgewood",          borough: "Queens",        boroughSlug: "queens",        lat: 40.7056, lon: -73.9041 },
  // The Bronx
  { name: "South Bronx",        slug: "south-bronx",        borough: "The Bronx",     boroughSlug: "bronx",         lat: 40.8167, lon: -73.9174 },
  { name: "Pelham Bay",         slug: "pelham-bay",         borough: "The Bronx",     boroughSlug: "bronx",         lat: 40.8545, lon: -73.8102 },
  { name: "Fordham",            slug: "fordham",            borough: "The Bronx",     boroughSlug: "bronx",         lat: 40.8610, lon: -73.8929 },
  { name: "Riverdale",          slug: "riverdale",          borough: "The Bronx",     boroughSlug: "bronx",         lat: 40.8981, lon: -73.9120 },
  { name: "Mott Haven",         slug: "mott-haven",         borough: "The Bronx",     boroughSlug: "bronx",         lat: 40.8067, lon: -73.9258 },
  { name: "Throggs Neck",       slug: "throggs-neck",       borough: "The Bronx",     boroughSlug: "bronx",         lat: 40.8244, lon: -73.8283 },
  { name: "Concourse",          slug: "concourse",          borough: "The Bronx",     boroughSlug: "bronx",         lat: 40.8367, lon: -73.9219 },
  { name: "Tremont",            slug: "tremont",            borough: "The Bronx",     boroughSlug: "bronx",         lat: 40.8479, lon: -73.8983 },
  // Staten Island
  { name: "St. George",         slug: "st-george",          borough: "Staten Island", boroughSlug: "staten-island", lat: 40.6437, lon: -74.0738 },
  { name: "Great Kills",        slug: "great-kills",        borough: "Staten Island", boroughSlug: "staten-island", lat: 40.5510, lon: -74.1502 },
  { name: "Stapleton",          slug: "stapleton",          borough: "Staten Island", boroughSlug: "staten-island", lat: 40.6282, lon: -74.0754 },
  { name: "New Dorp",           slug: "new-dorp",           borough: "Staten Island", boroughSlug: "staten-island", lat: 40.5731, lon: -74.1130 },
  { name: "Tottenville",        slug: "tottenville",        borough: "Staten Island", boroughSlug: "staten-island", lat: 40.5126, lon: -74.2518 },
  { name: "Snug Harbor",        slug: "snug-harbor",        borough: "Staten Island", boroughSlug: "staten-island", lat: 40.6424, lon: -74.1018 },
]

export function getNeighborhoodsByBorough(boroughSlug: string): Neighborhood[] {
  return NEIGHBORHOODS.filter((n) => n.boroughSlug === boroughSlug)
}
