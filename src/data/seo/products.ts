export interface Product {
  id: string
  name: string
  brand: string
  type: 'instant' | 'pod' | 'ground' | 'concentrate' | 'premade'
  price: number
  rating: number
  ratingCount: number
  keyFeatures: string[]
  flavor: string
  caffeineContent: string
  servings: number
  amazonAsin?: string
  bestFor: string[]
}

const AFFILIATE_TAG = 'bridgehearts0e-20'
const AMAZON_BASE = `https://www.amazon.com/dp`

export const PRODUCTS: Product[] = [
  {
    id: 'original-keto-coffee',
    name: 'Keto Life Original Coffee',
    brand: 'Keto Life',
    type: 'instant',
    price: 39.95,
    rating: 4.7,
    ratingCount: 12500,
    keyFeatures: ['MCT oil powder', 'Collagen peptides', 'Organic coffee', 'Zero sugar'],
    flavor: 'Smooth roasted',
    caffeineContent: '150mg per serving',
    servings: 30,
    bestFor: ['weight loss', 'energy', 'beginners', 'women', 'men'],
  },
  {
    id: 'superfuel-keto-coffee',
    name: 'SuperFuel Keto Creamer',
    brand: 'SuperFuel',
    type: 'instant',
    price: 34.99,
    rating: 4.5,
    ratingCount: 8900,
    keyFeatures: ['Grass-fed butter', 'MCT oil', 'Collagen', 'Vanilla flavor'],
    flavor: 'Vanilla',
    caffeineContent: '100mg per serving',
    servings: 28,
    bestFor: ['intermittent fasting', 'energy', 'flavor'],
  },
  {
    id: 'bulletproof-coffee',
    name: 'Bulletproof Coffee Original',
    brand: 'Bulletproof',
    type: 'ground',
    price: 44.95,
    rating: 4.6,
    ratingCount: 32000,
    keyFeatures: ['Mold-free beans', 'Single origin', 'Low acid', 'Organic'],
    flavor: 'Earthy roasted',
    caffeineContent: '180mg per cup',
    servings: 30,
    bestFor: ['taste', 'quality', 'purity'],
  },
  {
    id: 'perfect-keto-creamer',
    name: 'Perfect Keto Creamer',
    brand: 'Perfect Keto',
    type: 'concentrate',
    price: 29.99,
    rating: 4.4,
    ratingCount: 6700,
    keyFeatures: ['MCT oil', 'Collagen protein', 'No sugar', 'Keto certified'],
    flavor: 'Unsalted butter',
    caffeineContent: '0mg (add to coffee)',
    servings: 30,
    bestFor: ['customization', 'macros', 'collagen'],
  },
  {
    id: 'keto-coffee-pods',
    name: 'Keto Coffee Pods Variety Pack',
    brand: 'Keto Life',
    type: 'pod',
    price: 24.99,
    rating: 4.3,
    ratingCount: 4200,
    keyFeatures: ['Keurig compatible', 'MCT infused', '5 flavors', 'Biodegradable pods'],
    flavor: 'Variety pack',
    caffeineContent: '130mg per pod',
    servings: 24,
    bestFor: ['convenience', 'variety', 'Keurig users'],
  },
  {
    id: 'keto-life-matcha',
    name: 'Keto Life Matcha Latte',
    brand: 'Keto Life',
    type: 'instant',
    price: 36.99,
    rating: 4.5,
    ratingCount: 3100,
    keyFeatures: ['Ceremonial matcha', 'MCT creamer', 'Antioxidants', 'Low caffeine'],
    flavor: 'Creamy matcha',
    caffeineContent: '80mg per serving',
    servings: 30,
    bestFor: ['matcha lovers', 'low caffeine', 'antioxidants'],
  },
  {
    id: 'keto-pro-coffee',
    name: 'Keto Pro Coffee',
    brand: 'Keto Pro',
    type: 'instant',
    price: 42.50,
    rating: 4.6,
    ratingCount: 5400,
    keyFeatures: ['Grass-fed collagen', 'MCT oil powder', 'Organic arabica', 'Vitamin D'],
    flavor: 'Rich dark roast',
    caffeineContent: '160mg per serving',
    servings: 30,
    bestFor: ['nutrition', 'protein', 'vitamins'],
  },
  {
    id: 'primal-kitchen-coffee',
    name: 'Primal Kitchen Coffee Creamer',
    brand: 'Primal Kitchen',
    type: 'concentrate',
    price: 22.99,
    rating: 4.4,
    ratingCount: 2800,
    keyFeatures: ['Avocado oil', 'Coconut milk', 'No dairy', 'Organic'],
    flavor: 'Unsweetened vanilla',
    caffeineContent: '0mg (add to coffee)',
    servings: 21,
    bestFor: ['dairy-free', 'paleo', 'whole30'],
  },
  {
    id: 'cave-man-coffee',
    name: 'Cave Man Coffee Keto Blend',
    brand: 'Cave Man Coffee',
    type: 'ground',
    price: 32.00,
    rating: 4.7,
    ratingCount: 1800,
    keyFeatures: ['Small batch', 'Single origin', 'Swiss water decaf option', 'Mold tested'],
    flavor: 'Bold smoky',
    caffeineContent: '170mg per cup',
    servings: 28,
    bestFor: ['quality', 'small batch', 'decaf option'],
  },
  {
    id: 'keto-and-coffee',
    name: 'Keto & Coffee Starter Bundle',
    brand: 'Keto Life',
    type: 'instant',
    price: 54.99,
    rating: 4.8,
    ratingCount: 2300,
    keyFeatures: ['Starter kit', '30-day supply', 'Recipe guide', 'Free shaker bottle'],
    flavor: 'Smooth medium roast',
    caffeineContent: '150mg per serving',
    servings: 30,
    bestFor: ['beginners', 'starter kit', 'value'],
  },
]

export function getProductByBestFor(category: string): Product[] {
  return PRODUCTS.filter(p => p.bestFor.includes(category))
}

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id)
}

export function getAmazonUrl(product: Product): string {
  return `${AMAZON_BASE}/${product.amazonAsin || 'B0D8QHNF2L'}?tag=${AFFILIATE_TAG}`
}

export const COMPARISONS = [
  { slug: 'keto-coffee-vs-regular-coffee', name: 'Keto Coffee vs Regular Coffee', products: ['original-keto-coffee', 'bulletproof-coffee'], focus: 'health' },
  { slug: 'keto-coffee-vs-bulletproof-coffee', name: 'Keto Coffee vs Bulletproof Coffee', products: ['original-keto-coffee', 'bulletproof-coffee'], focus: 'ingredients' },
  { slug: 'keto-coffee-vs-green-tea', name: 'Keto Coffee vs Green Tea', products: ['original-keto-coffee', 'keto-life-matcha'], focus: 'weight loss' },
  { slug: 'instant-vs-ground-keto-coffee', name: 'Instant vs Ground Keto Coffee', products: ['original-keto-coffee', 'bulletproof-coffee'], focus: 'convenience' },
  { slug: 'keto-coffee-vs-protein-shake', name: 'Keto Coffee vs Protein Shake', products: ['keto-pro-coffee', 'perfect-keto-creamer'], focus: 'nutrition' },
  { slug: 'keto-coffee-pods-vs-instant', name: 'Keto Coffee Pods vs Instant', products: ['keto-coffee-pods', 'original-keto-coffee'], focus: 'convenience' },
  { slug: 'matcha-vs-coffee-keto', name: 'Matcha Latte vs Keto Coffee', products: ['keto-life-matcha', 'original-keto-coffee'], focus: 'energy' },
  { slug: 'keto-coffee-vs-black-coffee', name: 'Keto Coffee vs Black Coffee', products: ['original-keto-coffee', 'bulletproof-coffee'], focus: 'results' },
]
