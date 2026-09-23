// Additional local catalog fixtures. Prices are integer USD cents.
const additions = [
  {
    id: 'adjustable-dumbbells', name: 'Shift Adjustable Dumbbells', category: 'Dumbbells', tag: 'NEW ARRIVAL',
    price: 37900, compare: 42900, rating: '4.8', reviews: 42,
    subtitle: 'More weights. Less floor space.',
    description: 'Move from warm-ups to working sets with one compact pair. Selector dials let you change the load while the unused plates stay in their cradles, keeping your training corner ready for the next set.',
    variants: [{ name: '2–24 kg pair', price: 37900 }],
    features: ['Adjustable loading from 2 to 24 kg per dumbbell', 'Two storage cradles included', 'Textured chrome grips', 'Compact footprint for home training'],
    specs: [['Weight range', '2–24 kg per dumbbell'], ['Grip', 'Knurled chrome'], ['Finish', 'Black with orange selector dials'], ['Included', '2 adjustable dumbbells and 2 cradles']]
  },
  {
    id: 'cast-kettlebell', name: 'Core Cast-Iron Kettlebell', category: 'Kettlebells & bars', tag: 'EVERYDAY ESSENTIAL',
    price: 7900, compare: null, rating: '4.9', reviews: 73, defaultVariant: '12 kg', optionLabel: 'SELECT WEIGHT',
    subtitle: 'One bell. A whole new way to move.',
    description: 'Add swings, carries and controlled strength work to your routine. A broad handle and a balanced cast-iron body give this compact essential a reassuring feel, while the flat base makes it easy to set down between sets.',
    variants: [{ name: '8 kg', price: 5900 }, { name: '12 kg', price: 7900 }, { name: '16 kg', price: 9900 }],
    features: ['Single-piece cast-iron construction', 'Wide handle for one- or two-handed holds', 'Flat base for stable storage', 'Matte black finish with an orange accent'],
    specs: [['Material', 'Cast iron'], ['Weight options', '8, 12 or 16 kg'], ['Finish', 'Matte powder coating'], ['Included', '1 kettlebell']]
  },
  {
    id: 'olympic-barbell', name: 'Forge Olympic Barbell', category: 'Kettlebells & bars', tag: '',
    price: 17900, compare: null, rating: '4.8', reviews: 56,
    subtitle: 'The starting point for a stronger setup.',
    description: 'Build your barbell sessions around a dependable steel bar. A straight knurled shaft and rotating sleeves make it a versatile companion for your rack, bench and Olympic plates.',
    variants: [{ name: '20 kg · 220 cm', price: 17900 }],
    features: ['Full-length steel training bar', 'Textured knurling for a secure grip', 'Rotating 50 mm sleeves', 'Compatible with OMIGYM Olympic plates'],
    specs: [['Bar weight', '20 kg'], ['Length', '220 cm'], ['Sleeve diameter', '50 mm'], ['Included', '1 barbell; plates and collars sold separately']]
  },
  {
    id: 'ez-curl-bar', name: 'Contour EZ Curl Bar', category: 'Kettlebells & bars', tag: '',
    price: 8900, compare: null, rating: '4.7', reviews: 38,
    subtitle: 'A different grip on your next set.',
    description: 'Bring variety to curls, rows and accessory sessions with an angled gripping shaft. The shorter format fits easily into a home setup and uses the same Olympic plates as your main bar.',
    variants: [{ name: '8 kg · 120 cm', price: 8900 }],
    features: ['Angled shaft with multiple grip positions', 'Knurled chrome finish', '50 mm Olympic sleeves', 'Compact length for accessory training'],
    specs: [['Bar weight', '8 kg'], ['Length', '120 cm'], ['Sleeve diameter', '50 mm'], ['Included', '1 curl bar; plates and collars sold separately']]
  },
  {
    id: 'hex-trap-bar', name: 'Hexagon Trap Bar', category: 'Kettlebells & bars', tag: 'NEW ARRIVAL',
    price: 22900, compare: 25900, rating: '4.8', reviews: 29,
    subtitle: 'Step inside. Find your strength.',
    description: 'A closed hexagonal frame puts you at the center of the lift. Raised parallel handles offer a neutral grip for deadlift variations and loaded carries, with Olympic sleeves ready for your preferred plates.',
    variants: [{ name: '25 kg · Chrome', price: 22900 }],
    features: ['Closed hexagonal steel frame', 'Raised neutral-grip handles', 'Chrome finish with textured grips', 'Fits standard 50 mm Olympic plates'],
    specs: [['Bar weight', '25 kg'], ['Overall dimensions', '142 × 62 cm'], ['Sleeve diameter', '50 mm'], ['Included', '1 trap bar; plates and collars sold separately']]
  },
  {
    id: 'resistance-bands', name: 'Flex Loop Band Set', category: 'Training accessories', tag: '',
    price: 3900, compare: null, rating: '4.8', reviews: 94,
    subtitle: 'A little resistance goes a long way.',
    description: 'Four continuous loops bring warm-ups, assisted movements and added resistance into one compact kit. Choose a lighter or wider band to change the feel of your session, then pack the whole set away in seconds.',
    variants: [{ name: '4 resistance levels', price: 3900 }],
    features: ['Four continuous loop bands', 'Varied widths for different resistance levels', 'Flexible natural latex construction', 'Easy to store or take on the go'],
    specs: [['Material', 'Natural latex'], ['Loop circumference', '208 cm'], ['Levels', 'Light, medium, heavy and extra heavy'], ['Included', '4 loop bands']]
  },
  {
    id: 'flat-bench', name: 'Foundation Flat Bench', category: 'Racks & benches', tag: '',
    price: 12900, compare: null, rating: '4.8', reviews: 61,
    subtitle: 'Simple by design. Ready for the work.',
    description: 'A firm, level platform for presses, rows and everyday strength work. The compact steel base and single padded top keep the setup straightforward, with rubber feet to help protect your training floor.',
    variants: [{ name: 'Matte black', price: 12900 }],
    features: ['Fixed horizontal padded top', 'Stable steel frame', 'Easy-clean upholstery', 'Rubber feet for floor protection'],
    specs: [['Dimensions', '110 × 42 × 43 cm'], ['Pad width', '30 cm'], ['Frame', 'Powder-coated steel'], ['Included', '1 flat bench']]
  },
  {
    id: 'squat-stands', name: 'Apex Independent Squat Stands', category: 'Racks & benches', tag: 'SMALL SPACE. BIG LIFTS.',
    price: 24900, compare: null, rating: '4.7', reviews: 26,
    subtitle: 'Set your width. Make room to train.',
    description: 'Two independent stands give your barbell a dedicated place without a full rack footprint. Adjust the uprights to your setup and move the separate bases aside when your session is done.',
    variants: [{ name: 'Adjustable pair', price: 24900 }],
    features: ['Two separate freestanding supports', 'Adjustable J-cup height', 'Short adjustable safety arms', 'Wide bases with rubber feet'],
    specs: [['Height range', '105–165 cm'], ['Base per stand', '60 × 50 cm'], ['Material', 'Powder-coated steel'], ['Included', '2 squat stands; barbell sold separately']]
  },
  {
    id: 'plate-storage-tree', name: 'Order Olympic Plate Tree', category: 'Storage', tag: '',
    price: 11900, compare: null, rating: '4.8', reviews: 33,
    subtitle: 'A place for every plate.',
    description: 'Clear the floor and keep your plates within reach. Six storage pegs spread your collection across a compact steel frame, so choosing the next load becomes part of a smoother session.',
    variants: [{ name: '6-peg tree', price: 11900 }],
    features: ['Six plate-storage pegs', 'Fits plates with 50 mm center holes', 'Wide freestanding base', 'Compact vertical storage'],
    specs: [['Dimensions', '64 × 58 × 105 cm'], ['Frame', 'Black powder-coated steel'], ['Storage', '6 pegs'], ['Included', '1 storage tree; plates not included']]
  },
  {
    id: 'dumbbell-storage-rack', name: 'Order Three-Tier Dumbbell Rack', category: 'Storage', tag: '',
    price: 15900, compare: null, rating: '4.8', reviews: 45,
    subtitle: 'Less clutter. A clearer start.',
    description: 'Give your dumbbell collection a home between sessions. Three angled shelves make each pair easy to see and reach, while the compact frame keeps your training space organized.',
    variants: [{ name: '3-tier · 90 cm wide', price: 15900 }],
    features: ['Three inclined storage tiers', 'Open design for easy access', 'Powder-coated steel construction', 'Rubber feet protect the floor'],
    specs: [['Dimensions', '90 × 50 × 82 cm'], ['Tiers', '3'], ['Finish', 'Matte black'], ['Included', '1 rack; dumbbells not included']]
  },
  {
    id: 'pull-up-dip-station', name: 'Rise Pull-Up & Dip Station', category: 'Racks & benches', tag: 'NEW ARRIVAL',
    price: 32900, compare: 36900, rating: '4.7', reviews: 31,
    subtitle: 'Put your bodyweight to work.',
    description: 'Create a dedicated spot for pull-ups, dips and knee raises. A tall freestanding frame combines an overhead bar with padded arm supports and a back pad, bringing several bodyweight movements into one station.',
    variants: [{ name: 'Freestanding tower', price: 32900 }],
    features: ['Overhead pull-up bar', 'Parallel dip handles', 'Padded arm supports and backrest', 'Broad floor-standing base'],
    specs: [['Dimensions', '120 × 105 × 215 cm'], ['Frame', 'Powder-coated steel'], ['Padding', 'Black easy-clean upholstery'], ['Included', '1 pull-up and dip station']]
  },
  {
    id: 'plyometric-box', name: 'Launch Soft Plyo Box', category: 'Training accessories', tag: '',
    price: 14900, compare: null, rating: '4.8', reviews: 24,
    subtitle: 'A new level for every session.',
    description: 'Add a raised platform to your step-ups and controlled conditioning work. Rotate the rectangular box to choose one of three heights, with a dense foam body and durable wipe-clean cover.',
    variants: [{ name: '50 / 60 / 75 cm', price: 14900 }],
    features: ['Three heights in one rectangular box', 'Dense supportive foam body', 'Textured vinyl cover', 'Orange reinforced edge piping'],
    specs: [['Dimensions', '50 × 60 × 75 cm'], ['Core', 'Dense foam'], ['Cover', 'Textured vinyl'], ['Included', '1 soft plyometric box']]
  },
  {
    id: 'slam-ball', name: 'Impact Slam Ball', category: 'Training accessories', tag: '',
    price: 4900, compare: null, rating: '4.8', reviews: 68, optionLabel: 'SELECT WEIGHT',
    subtitle: 'Finish your workout with intent.',
    description: 'Bring weighted carries, ground-to-overhead work and conditioning into your routine. The textured rubber shell gives you a secure surface to grip, with a sand-filled interior designed for a low rebound.',
    variants: [{ name: '5 kg', price: 4900 }, { name: '10 kg', price: 6900 }, { name: '15 kg', price: 8900 }],
    features: ['Textured rubber grip surface', 'Sand-filled construction', 'Low-rebound design', 'Three weight options'],
    specs: [['Weight options', '5, 10 or 15 kg'], ['Shell', 'Textured rubber'], ['Filling', 'Sand'], ['Included', '1 slam ball']]
  },
  {
    id: 'training-mat', name: 'Groundwork Training Mat', category: 'Training accessories', tag: '',
    price: 3900, compare: null, rating: '4.9', reviews: 112,
    subtitle: 'Your space, from the ground up.',
    description: 'Roll out a comfortable surface for floor work, mobility and cooldowns. A lightly ribbed finish and generous length make this mat an easy everyday companion, and the flexible foam rolls away when you are done.',
    variants: [{ name: '180 × 60 cm · Charcoal', price: 3900 }],
    features: ['10 mm cushioning for floor sessions', 'Lightly ribbed surface', 'Rolls up for compact storage', 'Charcoal finish with orange edge detail'],
    specs: [['Dimensions', '180 × 60 cm'], ['Thickness', '10 mm'], ['Material', 'NBR foam'], ['Included', '1 training mat']]
  },
  {
    id: 'rowing-machine', name: 'Flow Magnetic Rower', category: 'Cardio', tag: 'NEW ARRIVAL',
    price: 59900, compare: 64900, rating: '4.8', reviews: 37,
    subtitle: 'Find your rhythm. Keep it moving.',
    description: 'Make steady conditioning part of your home routine. A sliding padded seat, adjustable foot straps and magnetic resistance support a smooth rowing motion, with a compact display to keep your session in view.',
    variants: [{ name: '8 resistance levels', price: 59900 }],
    features: ['Eight magnetic resistance settings', 'Padded sliding seat', 'Adjustable foot straps', 'Simple workout display'],
    specs: [['Dimensions', '180 × 54 × 75 cm'], ['Resistance', 'Magnetic, 8 levels'], ['Display', 'Time, stroke count and distance'], ['Included', '1 rowing machine']]
  }
];

export const expandedProducts = additions.map(product => ({
  ...product,
  image: `${product.id}.png`,
  images: [`${product.id}.png`]
}));
