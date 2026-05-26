export type FloodRegion = {
  id: string
  state: string
  basin: string
  name: string
  keywords: string[]
  bounds: [[number, number], [number, number]]
}

/** Approximate state bounds [south, west] → [north, east] for demo flood overlays */
export const FLOOD_REGIONS: FloodRegion[] = [
  {
    id: 'assam',
    state: 'Assam',
    basin: 'Brahmaputra Basin',
    name: 'Assam (Brahmaputra Basin)',
    keywords: ['assam', 'brahmaputra', 'guwahati', 'dibrugarh'],
    bounds: [[24.0, 89.7], [28.0, 96.0]],
  },
  {
    id: 'bihar',
    state: 'Bihar',
    basin: 'Ganga Floodplain',
    name: 'Bihar (Ganga Floodplain)',
    keywords: ['bihar', 'ganga', 'patna', 'muzaffarpur'],
    bounds: [[24.5, 83.3], [27.5, 88.2]],
  },
  {
    id: 'gujarat',
    state: 'Gujarat',
    basin: 'Sabarmati Basin',
    name: 'Gujarat (Sabarmati Basin)',
    keywords: ['gujarat', 'sabarmati', 'ahmedabad', 'surat'],
    bounds: [[20.1, 68.2], [24.7, 74.5]],
  },
  {
    id: 'kerala',
    state: 'Kerala',
    basin: 'Periyar Basin',
    name: 'Kerala (Periyar Basin)',
    keywords: ['kerala', 'periyar', 'kochi', 'thrissur'],
    bounds: [[8.0, 74.8], [12.8, 77.5]],
  },
  {
    id: 'maharashtra',
    state: 'Maharashtra',
    basin: 'Godavari-Krishna Basin',
    name: 'Maharashtra (Godavari-Krishna Basin)',
    keywords: ['maharashtra', 'godavari', 'krishna', 'mumbai', 'nagpur'],
    bounds: [[15.6, 72.6], [22.0, 80.9]],
  },
  {
    id: 'uttarakhand',
    state: 'Uttarakhand',
    basin: 'Himalayan River Network',
    name: 'Uttarakhand (Himalayan River Network)',
    keywords: ['uttarakhand', 'ganga', 'yamuna', 'dehradun', 'haridwar'],
    bounds: [[28.7, 77.5], [31.5, 81.0]],
  },
  {
    id: 'himachal-pradesh',
    state: 'Himachal Pradesh',
    basin: 'Beas-Sutlej Basin',
    name: 'Himachal Pradesh (Beas-Sutlej Basin)',
    keywords: ['himachal', 'beas', 'sutlej', 'shimla'],
    bounds: [[30.4, 75.6], [33.2, 79.0]],
  },
  {
    id: 'jammu-kashmir',
    state: 'Jammu & Kashmir',
    basin: 'Jhelum-Chenab Basin',
    name: 'Jammu & Kashmir (Jhelum-Chenab Basin)',
    keywords: ['jammu', 'kashmir', 'jhelum', 'chenab', 'srinagar'],
    bounds: [[32.3, 73.7], [37.0, 80.3]],
  },
  {
    id: 'punjab',
    state: 'Punjab',
    basin: 'Sutlej Floodplain',
    name: 'Punjab (Sutlej Floodplain)',
    keywords: ['punjab', 'sutlej', 'ludhiana', 'amritsar'],
    bounds: [[29.5, 73.8], [32.5, 76.9]],
  },
  {
    id: 'haryana',
    state: 'Haryana',
    basin: 'Yamuna Basin',
    name: 'Haryana (Yamuna Basin)',
    keywords: ['haryana', 'yamuna', 'gurgaon', 'faridabad'],
    bounds: [[27.6, 74.4], [30.9, 77.6]],
  },
  {
    id: 'rajasthan',
    state: 'Rajasthan',
    basin: 'Luni-Chambal Basin',
    name: 'Rajasthan (Luni-Chambal Basin)',
    keywords: ['rajasthan', 'luni', 'chambal', 'jaipur', 'udaipur'],
    bounds: [[23.0, 69.4], [30.2, 78.2]],
  },
  {
    id: 'uttar-pradesh',
    state: 'Uttar Pradesh',
    basin: 'Ganga-Yamuna Plains',
    name: 'Uttar Pradesh (Ganga-Yamuna Plains)',
    keywords: ['uttar pradesh', 'up', 'ganga', 'yamuna', 'lucknow', 'varanasi'],
    bounds: [[23.8, 77.0], [31.0, 84.7]],
  },
  {
    id: 'madhya-pradesh',
    state: 'Madhya Pradesh',
    basin: 'Narmada-Tapti Basin',
    name: 'Madhya Pradesh (Narmada-Tapti Basin)',
    keywords: ['madhya pradesh', 'mp', 'narmada', 'tapti', 'bhopal'],
    bounds: [[21.0, 74.0], [26.9, 82.8]],
  },
  {
    id: 'west-bengal',
    state: 'West Bengal',
    basin: 'Ganga Delta',
    name: 'West Bengal (Ganga Delta)',
    keywords: ['west bengal', 'ganga', 'delta', 'kolkata', 'sundarbans'],
    bounds: [[21.5, 85.8], [27.2, 89.9]],
  },
  {
    id: 'odisha',
    state: 'Odisha',
    basin: 'Mahanadi Basin',
    name: 'Odisha (Mahanadi Basin)',
    keywords: ['odisha', 'orissa', 'mahanadi', 'bhubaneswar', 'cuttack'],
    bounds: [[17.8, 81.3], [22.6, 87.5]],
  },
  {
    id: 'andhra-pradesh',
    state: 'Andhra Pradesh',
    basin: 'Godavari Delta',
    name: 'Andhra Pradesh (Godavari Delta)',
    keywords: ['andhra', 'godavari', 'vijayawada', 'visakhapatnam'],
    bounds: [[12.6, 76.7], [19.9, 84.8]],
  },
  {
    id: 'telangana',
    state: 'Telangana',
    basin: 'Krishna Basin',
    name: 'Telangana (Krishna Basin)',
    keywords: ['telangana', 'krishna', 'hyderabad'],
    bounds: [[15.8, 77.2], [19.9, 81.8]],
  },
  {
    id: 'karnataka',
    state: 'Karnataka',
    basin: 'Cauvery Basin',
    name: 'Karnataka (Cauvery Basin)',
    keywords: ['karnataka', 'cauvery', 'bengaluru', 'bangalore', 'mysuru'],
    bounds: [[11.5, 74.0], [18.5, 78.6]],
  },
  {
    id: 'tamil-nadu',
    state: 'Tamil Nadu',
    basin: 'Cauvery Delta',
    name: 'Tamil Nadu (Cauvery Delta)',
    keywords: ['tamil nadu', 'cauvery', 'chennai', 'madurai'],
    bounds: [[8.0, 76.2], [13.5, 80.3]],
  },
  {
    id: 'chhattisgarh',
    state: 'Chhattisgarh',
    basin: 'Mahanadi Tributaries',
    name: 'Chhattisgarh (Mahanadi Tributaries)',
    keywords: ['chhattisgarh', 'mahanadi', 'raipur'],
    bounds: [[17.8, 80.2], [24.1, 84.4]],
  },
  {
    id: 'jharkhand',
    state: 'Jharkhand',
    basin: 'Damodar Basin',
    name: 'Jharkhand (Damodar Basin)',
    keywords: ['jharkhand', 'damodar', 'ranchi', 'jamshedpur'],
    bounds: [[22.0, 83.3], [25.3, 87.9]],
  },
  {
    id: 'sikkim',
    state: 'Sikkim',
    basin: 'Teesta Basin',
    name: 'Sikkim (Teesta Basin)',
    keywords: ['sikkim', 'teesta', 'gangtok'],
    bounds: [[27.0, 88.0], [28.3, 88.9]],
  },
  {
    id: 'arunachal-pradesh',
    state: 'Arunachal Pradesh',
    basin: 'Siang Basin',
    name: 'Arunachal Pradesh (Siang Basin)',
    keywords: ['arunachal', 'siang', 'itanagar'],
    bounds: [[26.6, 91.5], [29.5, 97.4]],
  },
  {
    id: 'meghalaya',
    state: 'Meghalaya',
    basin: 'Surma-Meghna Basin',
    name: 'Meghalaya (Surma-Meghna Basin)',
    keywords: ['meghalaya', 'surma', 'meghna', 'shillong'],
    bounds: [[25.0, 89.8], [26.1, 92.8]],
  },
  {
    id: 'manipur',
    state: 'Manipur',
    basin: 'Barak Basin',
    name: 'Manipur (Barak Basin)',
    keywords: ['manipur', 'barak', 'imphal'],
    bounds: [[23.8, 93.0], [25.7, 94.8]],
  },
  {
    id: 'mizoram',
    state: 'Mizoram',
    basin: 'Chhimtuipui Basin',
    name: 'Mizoram (Chhimtuipui Basin)',
    keywords: ['mizoram', 'chhimtuipui', 'aizawl'],
    bounds: [[21.9, 92.3], [24.5, 93.4]],
  },
  {
    id: 'nagaland',
    state: 'Nagaland',
    basin: 'Doyang Basin',
    name: 'Nagaland (Doyang Basin)',
    keywords: ['nagaland', 'doyang', 'kohima'],
    bounds: [[25.2, 93.3], [27.0, 95.2]],
  },
  {
    id: 'tripura',
    state: 'Tripura',
    basin: 'Gumti Basin',
    name: 'Tripura (Gumti Basin)',
    keywords: ['tripura', 'gumti', 'agartala'],
    bounds: [[22.9, 91.2], [24.5, 92.3]],
  },
  {
    id: 'goa',
    state: 'Goa',
    basin: 'Zuari Basin',
    name: 'Goa (Zuari Basin)',
    keywords: ['goa', 'zuari', 'panaji'],
    bounds: [[14.9, 73.7], [15.8, 74.3]],
  },
  {
    id: 'delhi',
    state: 'Delhi',
    basin: 'Yamuna Urban Flood Zone',
    name: 'Delhi (Yamuna Urban Flood Zone)',
    keywords: ['delhi', 'ncr', 'yamuna', 'new delhi'],
    bounds: [[28.4, 76.8], [28.9, 77.4]],
  },
]

export function filterFloodRegions(query: string, regions: FloodRegion[]): FloodRegion[] {
  const q = query.trim().toLowerCase()
  if (!q) return regions
  return regions.filter((region) => {
    if (region.name.toLowerCase().includes(q)) return true
    if (region.state.toLowerCase().includes(q)) return true
    if (region.basin.toLowerCase().includes(q)) return true
    return region.keywords.some((kw) => kw.includes(q) || q.includes(kw))
  })
}

export function findBestFloodRegionMatch(
  query: string,
  regions: FloodRegion[],
): FloodRegion | null {
  const filtered = filterFloodRegions(query, regions)
  if (filtered.length === 0) return null
  const q = query.trim().toLowerCase()
  const exact = filtered.find(
    (r) =>
      r.state.toLowerCase() === q ||
      r.id === q.replace(/\s+/g, '-') ||
      r.name.toLowerCase() === q,
  )
  return exact ?? filtered[0]
}
