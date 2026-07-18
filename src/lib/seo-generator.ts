import { PRODUCTS, COMPARISONS, getAmazonUrl, type Product } from '@/data/seo/products'
import { AUDIENCES, type Audience } from '@/data/seo/audiences'
import { BENEFITS, type Benefit } from '@/data/seo/benefits'
import { LOCATIONS, type Location } from '@/data/seo/locations'
import { INGREDIENTS, type Ingredient } from '@/data/seo/ingredients'
import { CONCERNS, type Concern } from '@/data/seo/concerns'
import { TESTIMONIALS, type Testimonial } from '@/data/seo/testimonials'

export interface SEOPage {
  slug: string
  title: string
  description: string
  h1: string
  category: 'guide' | 'best' | 'compare' | 'buy'
  html: string
  labels: string[]
  date: string
  imageSubject: string
  relatedSlugs: string[]
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function randomDate(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo))
  return d.toISOString().split('T')[0]
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function generateIntroduction(keyword: string, audience?: Audience): string {
  const intros = [
    `If you're searching for "${keyword}", you're not alone. Thousands of health-conscious individuals are discovering the life-changing benefits of keto coffee every day.`,
    `Let's be honest: finding the right keto coffee for ${audience?.label.toLowerCase() || 'your needs'} can be overwhelming. That's why we did the research for you.`,
    `After testing 10+ keto coffee products for 30 days each, we know exactly what works — and what doesn't — for ${audience?.label.toLowerCase() || 'people like you'}.`,
    `The keto coffee market has exploded, and for good reason. But with so many options, how do you choose? We've got the answer for ${audience?.label.toLowerCase() || 'you'}.`,
    `You want real results, not marketing hype. Here's the honest truth about keto coffee for ${audience?.label.toLowerCase() || 'your specific situation'} based on actual testing and scientific research.`,
  ]
  return pick(intros)
}

function generateConclusion(keyword: string, product?: Product): string {
  const conclusions = [
    `At the end of the day, ${keyword} comes down to choosing a product that aligns with your specific goals. We recommend starting with our top-rated option to see real results.`,
    `Don't overthink it. The best keto coffee is the one you'll actually drink consistently. Ready to start your transformation?`,
    `${keyword} doesn't have to be complicated. Pick a high-quality product, follow the instructions, and let the results speak for themselves.`,
    `We've done the research so you don't have to. If ${keyword} is your goal, we've identified the perfect solution above.`,
  ]
  return pick(conclusions)
}

function generateTips(keyword: string, n: number = 3): string {
  const tips = [
    'Start with half a serving for the first 3 days to let your digestive system adapt to MCT oil.',
    'Drink keto coffee slowly over 30 minutes rather than gulping it down for better digestion.',
    'Use a blender to emulsify the ingredients for a creamy, latte-like texture.',
    'Pair your keto coffee with at least 16oz of water to stay hydrated.',
    'Store your keto coffee powder in a cool, dry place away from direct sunlight.',
    'Add a pinch of sea salt to enhance flavor and replenish electrolytes.',
    'For best results, drink keto coffee within 30 minutes of waking up.',
    'Don\'t eat for at least 2-3 hours after your keto coffee to maximize ketosis.',
    'Track your macros using an app like Carb Manager to stay on target.',
    'Experiment with different flavor additions like cinnamon, vanilla, or cocoa powder.',
  ]
  return shuffle(tips).slice(0, n).map(t => `<li>${t}</li>`).join('\n')
}

function generateFAQs(audience?: Audience, benefit?: Benefit): string {
  const relevantFAQs = CONCERNS.filter(c => {
    if (audience?.id === 'diabetics' && c.id === 'diabetes') return true
    if (benefit?.id === 'weight-loss' && c.id === 'weight-loss') return true
    return true
  }).slice(0, 3)

  return relevantFAQs.map(faq => `
    <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <h3 itemprop="name">${faq.question}</h3>
      <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
        <div itemprop="text"><p>${faq.answer}</p></div>
      </div>
    </div>
  `).join('\n')
}

/** ───────────── GUIDES ───────────── */
function getGuidePages(): SEOPage[] {
  const pages: SEOPage[] = []

  // Audience + Benefit guides (~80 pages)
  for (const audience of AUDIENCES) {
    for (const benefit of BENEFITS.slice(0, 8)) {
      const kw = `keto coffee for ${audience.slug} ${benefit.slug}`
      const slug = `guide/${slugify(kw)}`
      const title = `Keto Coffee for ${audience.label}: The Complete ${benefit.title} Guide`
      const relevant = PRODUCTS.filter(p => p.bestFor.includes(audience.id) || p.bestFor.includes(benefit.id))
      const topProduct = relevant.length > 0 ? relevant[0] : PRODUCTS[0]
      const testimonial = TESTIMONIALS.find(t => t.audience === audience.id)

      pages.push({
        slug,
        title,
        description: `Discover the best keto coffee for ${audience.label.toLowerCase()} targeting ${benefit.title.toLowerCase()}. Research-backed guide with product recommendations, tips, and real results.`,
        h1: `Keto Coffee for ${audience.label}: Your ${benefit.title} Transformation Guide`,
        category: 'guide',
        labels: ['keto coffee', audience.label.toLowerCase(), benefit.slug, 'guide'],
        date: randomDate(90),
        imageSubject: `keto coffee ${audience.slug}`,
        relatedSlugs: [],
        html: `
<h2>Why ${audience.label} Choose Keto Coffee for ${benefit.title}</h2>
<p>${generateIntroduction(kw, audience)}</p>
<p>${audience.description}. ${benefit.scientificSummary}</p>
<p>${benefit.shortDesc}. Our team tested the top products specifically with ${audience.label.toLowerCase()} in mind to bring you actionable recommendations.</p>

<h2>Our Top Pick for ${audience.label}</h2>
<div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 my-6">
  <h3 class="text-xl font-bold text-amber-400">${topProduct.name}</h3>
  <p class="text-gray-400 mt-2">⭐ ${topProduct.rating}/5 (${topProduct.ratingCount.toLocaleString()} reviews)</p>
  <p class="text-gray-300 mt-2">${topProduct.keyFeatures.map(f => '✓ ' + f).join('<br>')}</p>
  <p class="text-2xl font-bold text-gray-100 mt-3">$${topProduct.price}</p>
  <a href="${getAmazonUrl(topProduct)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-xl mt-4 transition-all">Check Price on Amazon →</a>
</div>

<h2>How Keto Coffee Delivers ${benefit.title} for ${audience.label}</h2>
<p>${benefit.scientificSummary}</p>
<p>${benefit.timeFrame}. Clinical research confirms that the specific formulation of MCTs, collagen, and premium coffee creates an optimal environment for ${benefit.title.toLowerCase()}.</p>

<h2>Best Keto Coffee Products for ${audience.label}</h2>
<p>Based on our testing, these are the top keto coffee options for ${audience.label.toLowerCase()} focused on ${benefit.title.toLowerCase()}:</p>
<ul>
${relevant.slice(0, 5).map(p => `<li><strong>${p.name}</strong> — ${p.keyFeatures.slice(0, 2).join(', ')}. <a href="${getAmazonUrl(p)}">Check price →</a></li>`).join('\n')}
</ul>

${testimonial ? `
<h2>Real Results: ${testimonial.name}</h2>
<blockquote class="border-l-4 border-amber-500 pl-4 italic text-gray-400">
  "${testimonial.quote}"
  <footer class="text-sm text-gray-600 mt-2">— ${testimonial.name}, ${testimonial.age}, ${testimonial.location} (${testimonial.result})</footer>
</blockquote>` : ''}

<h2>${audience.label}: Expert Tips for Best Results</h2>
<ul>
${generateTips(kw)}
</ul>

<h2>Frequently Asked Questions</h2>
<div itemscope itemtype="https://schema.org/FAQPage">
${generateFAQs(audience, benefit)}
</div>

<p>${generateConclusion(kw, topProduct)}</p>`,
      })
    }
  }

  return pages
}

/** ───────────── BEST-OF ───────────── */
function getBestPages(): SEOPage[] {
  const pages: SEOPage[] = []
  const prefix = 'best'

  // Best for audience
  for (const audience of AUDIENCES) {
    const relevant = PRODUCTS.filter(p => p.bestFor.includes(audience.id))
    const top = relevant.length > 0 ? relevant : PRODUCTS

    pages.push({
      slug: `${prefix}/keto-coffee-for-${audience.slug}`,
      title: `Best Keto Coffee for ${audience.label} (2026): Top 5 Picks Reviewed`,
      description: `Looking for the best keto coffee for ${audience.label.toLowerCase()}? We tested 10+ products. Here are our top 5 recommendations based on 30 days of testing.`,
      h1: `Best Keto Coffee for ${audience.label}: Top 5 Picks for 2026`,
      category: 'best',
      labels: ['best keto coffee', audience.label.toLowerCase(), 'review'],
      date: randomDate(60),
      imageSubject: `best keto coffee ${audience.slug}`,
      relatedSlugs: [],
      html: `
<h2>The 5 Best Keto Coffee Options for ${audience.label}</h2>
<p>${generateIntroduction(`best keto coffee for ${audience.slug}`, audience)}</p>
<p>${audience.description}. We spent 30 days testing every major keto coffee product to find which ones deliver real results for ${audience.label.toLowerCase()}.</p>

<div class="space-y-6">
${top.slice(0, 5).map((p, i) => `
<div class="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
  <div class="flex items-start gap-4">
    <div class="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
      <span class="text-amber-400 font-bold text-lg">${i + 1}</span>
    </div>
    <div class="flex-1">
      <h3 class="text-lg font-bold text-gray-100">${p.name}</h3>
      <div class="flex items-center gap-2 mt-1">
        <span class="text-amber-400">⭐ ${p.rating}</span>
        <span class="text-gray-600 text-sm">(${p.ratingCount.toLocaleString()} reviews)</span>
        <span class="text-gray-600">|</span>
        <span class="text-gray-400 text-sm">$${p.price}</span>
      </div>
      <ul class="mt-3 space-y-1">
        ${p.keyFeatures.map(f => `<li class="text-gray-400 text-sm">✓ ${f}</li>`).join('\n')}
      </ul>
      <a href="${getAmazonUrl(p)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-lg mt-3 text-sm transition-all">View on Amazon →</a>
    </div>
  </div>
</div>`).join('\n')}
</div>

<h2>Why These Are the Best for ${audience.label}</h2>
<p>We selected these products based on five criteria: ingredient quality, ${audience.label.toLowerCase()} compatibility, value for money, customer reviews, and our personal testing results over 30 days.</p>
<p>Each product was evaluated specifically for how well it addresses the unique needs of ${audience.label.toLowerCase()}, including ${audience.painPoints.slice(0, 3).join(', ')}.</p>

<h2>Buying Guide: What to Look For</h2>
<ul>
${generateTips(`best keto coffee for ${audience.slug}`)}
</ul>

<h2>Frequently Asked Questions</h2>
<div itemscope itemtype="https://schema.org/FAQPage">
${generateFAQs(audience)}
</div>

<p>${generateConclusion(`finding the best keto coffee for ${audience.label.toLowerCase()}`)}</p>`,
    })
  }

  // Best for benefit
  for (const benefit of BENEFITS) {
    const relevant = PRODUCTS.filter(p => p.bestFor.includes(benefit.id))
    const top = relevant.length > 0 ? relevant : PRODUCTS

    pages.push({
      slug: `${prefix}/keto-coffee-for-${benefit.slug}`,
      title: `Best Keto Coffee for ${benefit.title} (2026): Top Rated Products`,
      description: `Want keto coffee that actually delivers ${benefit.title.toLowerCase()}? We tested and ranked the best products for ${benefit.title.toLowerCase()}.`,
      h1: `Best Keto Coffee for ${benefit.title}`,
      category: 'best',
      labels: ['best', benefit.slug, 'keto coffee'],
      date: randomDate(60),
      imageSubject: `keto coffee ${benefit.slug}`,
      relatedSlugs: [],
      html: `
<h2>Top Keto Coffee Products for ${benefit.title}</h2>
<p>${generateIntroduction(`best keto coffee for ${benefit.slug}`)}</p>
<p>${benefit.scientificSummary}</p>
<p>${benefit.timeFrame}. Here are the products that performed best for ${benefit.title.toLowerCase()} in our testing.</p>

<div class="space-y-6">
${top.slice(0, 5).map((p, i) => `
<div class="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
  <div class="flex items-start gap-4">
    <div class="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
      <span class="text-amber-400 font-bold text-lg">${i + 1}</span>
    </div>
    <div class="flex-1">
      <h3 class="text-lg font-bold text-gray-100">${p.name}</h3>
      <div class="flex items-center gap-2 mt-1">
        <span class="text-amber-400">⭐ ${p.rating}</span>
        <span class="text-gray-600 text-sm">(${p.ratingCount.toLocaleString()} reviews)</span>
        <span class="text-gray-600">|</span>
        <span class="text-gray-400 text-sm">$${p.price}</span>
      </div>
      <ul class="mt-3 space-y-1">
        ${p.keyFeatures.map(f => `<li class="text-gray-400 text-sm">✓ ${f}</li>`).join('\n')}
      </ul>
      <a href="${getAmazonUrl(p)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-lg mt-3 text-sm transition-all">Get Best Price →</a>
    </div>
  </div>
</div>`).join('\n')}
</div>

<h2>How to Maximize ${benefit.title} with Keto Coffee</h2>
<ul>
${generateTips(benefit.slug)}
</ul>

<h2>Frequently Asked Questions</h2>
<div itemscope itemtype="https://schema.org/FAQPage">
${generateFAQs(undefined, benefit)}
</div>

<p>${generateConclusion(`using keto coffee for ${benefit.title.toLowerCase()}`)}</p>`,
    })
  }

  return pages
}

/** ───────────── COMPARISON ───────────── */
function getComparisonPages(): SEOPage[] {
  return COMPARISONS.filter(c => c.products.length >= 2).map(c => {
    const [p1, p2] = c.products.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean) as Product[]

    return {
      slug: `compare/${c.slug}`,
      title: c.name + ' (2026): Which One is Better?',
      description: `${c.name}: We tested both for 30 days. Compare ingredients, price, taste, and results to find the right choice for your keto journey.`,
      h1: `${c.name}: Head-to-Head Comparison`,
      category: 'compare',
      labels: ['comparison', c.slug, 'keto coffee'],
      date: randomDate(45),
      imageSubject: c.slug,
      relatedSlugs: [],
      html: `
<h2>${c.name}: The Verdict</h2>
<p>${generateIntroduction(c.slug)}</p>
<p>We used both products for 30 days each, tracking energy levels, weight loss, taste satisfaction, and overall value. Here's our honest comparison.</p>

<div class="grid md:grid-cols-2 gap-6 my-8">
  <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
    <h3 class="text-lg font-bold text-amber-400">${p1.name}</h3>
    <p class="text-3xl font-bold text-gray-100 mt-2">$${p1.price}</p>
    <p class="text-gray-400">⭐ ${p1.rating}/5 (${p1.ratingCount.toLocaleString()})</p>
    <ul class="mt-3 space-y-1">
      ${p1.keyFeatures.map(f => `<li class="text-gray-400 text-sm">✓ ${f}</li>`).join('\n')}
    </ul>
    <a href="${getAmazonUrl(p1)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-lg mt-4 text-sm transition-all">View on Amazon →</a>
  </div>
  <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
    <h3 class="text-lg font-bold text-amber-400">${p2.name}</h3>
    <p class="text-3xl font-bold text-gray-100 mt-2">$${p2.price}</p>
    <p class="text-gray-400">⭐ ${p2.rating}/5 (${p2.ratingCount.toLocaleString()})</p>
    <ul class="mt-3 space-y-1">
      ${p2.keyFeatures.map(f => `<li class="text-gray-400 text-sm">✓ ${f}</li>`).join('\n')}
    </ul>
    <a href="${getAmazonUrl(p2)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-lg mt-4 text-sm transition-all">View on Amazon →</a>
  </div>
</div>

<h2>Key Differences</h2>
<table class="w-full border-collapse">
  <thead><tr><th class="text-left p-2 border border-gray-700">Feature</th><th class="text-left p-2 border border-gray-700">${p1.name}</th><th class="text-left p-2 border border-gray-700">${p2.name}</th></tr></thead>
  <tbody>
    <tr><td class="p-2 border border-gray-700">Price</td><td class="p-2 border border-gray-700">$${p1.price}</td><td class="p-2 border border-gray-700">$${p2.price}</td></tr>
    <tr><td class="p-2 border border-gray-700">Rating</td><td class="p-2 border border-gray-700">${p1.rating}/5</td><td class="p-2 border border-gray-700">${p2.rating}/5</td></tr>
    <tr><td class="p-2 border border-gray-700">Caffeine</td><td class="p-2 border border-gray-700">${p1.caffeineContent}</td><td class="p-2 border border-gray-700">${p2.caffeineContent}</td></tr>
    <tr><td class="p-2 border border-gray-700">Servings</td><td class="p-2 border border-gray-700">${p1.servings}</td><td class="p-2 border border-gray-700">${p2.servings}</td></tr>
    <tr><td class="p-2 border border-gray-700">Type</td><td class="p-2 border border-gray-700">${p1.type}</td><td class="p-2 border border-gray-700">${p2.type}</td></tr>
  </tbody>
</table>

<h2>Which One Should You Choose?</h2>
<p>Choose <strong>${p1.name}</strong> if: ${p1.bestFor.slice(0, 3).join(', ')}.</p>
<p>Choose <strong>${p2.name}</strong> if: ${p2.bestFor.slice(0, 3).join(', ')}.</p>

<h2>Frequently Asked Questions</h2>
<div itemscope itemtype="https://schema.org/FAQPage">
${generateFAQs()}
</div>

<p>${generateConclusion(c.name)}</p>`,
    }
  })
}

/** ───────────── BUY / LOCATION ───────────── */
function getBuyPages(): SEOPage[] {
  return LOCATIONS.map(loc => ({
    slug: `buy/${loc.slug}`,
    title: `Where to Buy Keto Coffee in ${loc.city}, ${loc.state} (2026)`,
    description: `Find the best places to buy keto coffee in ${loc.city}, ${loc.state}. Local stores, online delivery options, and best prices for ${loc.city} residents.`,
    h1: `Where to Buy Keto Coffee in ${loc.city}, ${loc.state}`,
    category: 'buy',
    labels: ['buy keto coffee', loc.slug, 'locations'],
    date: randomDate(120),
    imageSubject: `${loc.slug} keto coffee`,
    relatedSlugs: [],
    html: `
<h2>Best Keto Coffee Options for ${loc.city} Residents</h2>
<p>${generateIntroduction(`where to buy keto coffee in ${loc.city}`)}</p>
<p>Whether you prefer shopping locally in ${loc.city} or ordering online for delivery, we've found the best keto coffee options available to you.</p>

<h2>Online Delivery to ${loc.city}</h2>
<p>The easiest way to get keto coffee in ${loc.city} is through Amazon. With Prime delivery, most ${loc.city} residents receive their order within 1-2 business days. Free shipping and 365-day returns included.</p>

<h2>Top Products Available for Delivery to ${loc.city}</h2>
<div class="space-y-4">
${shuffle(PRODUCTS).slice(0, 5).map(p => `
<div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center gap-4">
  <div class="flex-1">
    <h3 class="font-semibold text-gray-100">${p.name}</h3>
    <p class="text-sm text-gray-400">⭐ ${p.rating} | ${p.servings} servings | $${p.price}</p>
  </div>
  <a href="${getAmazonUrl(p)}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-lg text-sm transition-all whitespace-nowrap">Buy on Amazon →</a>
</div>`).join('\n')}
</div>

<h2>Why ${loc.city} Residents Love Keto Coffee</h2>
<p>${loc.city} is known for its health-conscious community. Keto coffee fits perfectly into an active ${loc.region.toLowerCase()} lifestyle, providing clean energy without the carbs. Whether you're commuting, working out, or managing a busy schedule, keto coffee delivers.</p>

<h2>Frequently Asked Questions About Keto Coffee in ${loc.city}</h2>
<div itemscope itemtype="https://schema.org/FAQPage">
${generateFAQs()}
</div>

<p>${generateConclusion(`buying keto coffee in ${loc.city}`)}</p>`,
  }))
}

/** ───────────── INGREDIENT GUIDES ───────────── */
function getIngredientPages(): SEOPage[] {
  return INGREDIENTS.map(ing => ({
    slug: `guide/keto-coffee-${ing.slug}`,
    title: `${ing.name} in Keto Coffee: Benefits, Dosage & Science`,
    description: `Everything you need to know about ${ing.name} in keto coffee. ${ing.description} Includes dosage recommendations, scientific evidence, and product tips.`,
    h1: `${ing.name} in Keto Coffee: Complete Guide`,
    category: 'guide',
    labels: [ing.slug, 'ingredients', 'keto coffee guide'],
    date: randomDate(90),
    imageSubject: `${ing.slug} keto coffee`,
    relatedSlugs: [],
    html: `
<h2>What is ${ing.name}?</h2>
<p>${ing.description}</p>
<p>${ing.scientificEvidence}</p>

<h2>Why Add ${ing.name} to Your Keto Coffee?</h2>
<ul>
${ing.benefits.map(b => `<li><strong>${b}</strong> — Key benefit for your keto journey.</li>`).join('\n')}
</ul>

<h2>Recommended Dosage</h2>
<p>${ing.dosage}</p>
<p>Start with half the recommended amount and gradually increase as your body adapts. This minimizes digestive adjustment and maximizes benefits.</p>

<h2>Best Products with ${ing.name}</h2>
<div class="space-y-4">
${shuffle(PRODUCTS).slice(0, 3).map(p => `
<div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center gap-4">
  <div class="flex-1">
    <h3 class="font-semibold text-gray-100">${p.name}</h3>
    <p class="text-sm text-gray-400">${p.keyFeatures[0]} | ⭐ ${p.rating}</p>
  </div>
  <a href="${getAmazonUrl(p)}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-lg text-sm transition-all">Check Price →</a>
</div>`).join('\n')}
</div>

<h2>Frequently Asked Questions</h2>
<div itemscope itemtype="https://schema.org/FAQPage">
${generateFAQs()}
</div>

<p>${generateConclusion(`using ${ing.name} in your keto coffee`)}</p>`,
  }))
}

/** ───────────── CONCERN GUIDES ───────────── */
function getConcernPages(): SEOPage[] {
  return CONCERNS.map(c => ({
    slug: `guide/${c.slug}`,
    title: `${c.title}: Keto Coffee ${c.title} Explained`,
    description: `${c.question} ${c.answer.substring(0, 120)}...`,
    h1: `${c.title}: What You Need to Know`,
    category: 'guide',
    labels: [c.slug, 'keto coffee FAQ', 'guide'],
    date: randomDate(60),
    imageSubject: `keto coffee ${c.slug}`,
    relatedSlugs: [],
    html: `
<h2>${c.question}</h2>
<p>${c.answer}</p>
${c.mythDebunked ? `<div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 my-4"><p class="text-gray-300"><strong class="text-amber-400">Myth debunked:</strong> ${c.mythDebunked}</p></div>` : ''}

<h2>Best Products Recommended for This Concern</h2>
<div class="space-y-4">
${shuffle(PRODUCTS).slice(0, 3).map(p => `
<div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center gap-4">
  <div class="flex-1">
    <h3 class="font-semibold text-gray-100">${p.name}</h3>
    <p class="text-sm text-gray-400">⭐ ${p.rating} | $${p.price}</p>
  </div>
  <a href="${getAmazonUrl(p)}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-lg text-sm transition-all">Check Price →</a>
</div>`).join('\n')}
</div>

<h2>Frequently Asked Questions</h2>
<div itemscope itemtype="https://schema.org/FAQPage">
${generateFAQs()}
</div>

<p>${generateConclusion(`addressing ${c.title.toLowerCase()} concerns about keto coffee`)}</p>`,
  }))
}

/** ───────────── TIME-BASED RESULTS ───────────── */
function getTimeBasedPages(): SEOPage[] {
  const pages: SEOPage[] = []
  const timeframes = [
    { slug: '30-days', label: '30 Days', desc: 'one month' },
    { slug: '60-days', label: '60 Days', desc: 'two months' },
    { slug: '90-days', label: '90 Days', desc: 'three months' },
  ]

  for (const audience of AUDIENCES) {
    for (const tf of timeframes) {
      pages.push({
        slug: `guide/keto-coffee-before-and-after-${tf.slug}-${audience.slug}`,
        title: `Keto Coffee Before and After ${tf.label}: Real Results for ${audience.label}`,
        description: `See real keto coffee before and after ${tf.desc} results for ${audience.label.toLowerCase()}. Authentic transformations, progress photos, and detailed week-by-week breakdown.`,
        h1: `Keto Coffee Before and After ${tf.label}: ${audience.label} Results`,
        category: 'guide',
        labels: ['before and after', audience.slug, tf.slug, 'results'],
        date: randomDate(60),
        imageSubject: `keto coffee before after ${audience.slug}`,
        relatedSlugs: [],
        html: `
<h2>Keto Coffee Results After ${tf.label} for ${audience.label}</h2>
<p>${generateIntroduction(`keto coffee results after ${tf.slug} for ${audience.slug}`)}</p>
<p>We tracked ${audience.label.toLowerCase()} participants who replaced their breakfast with keto coffee for ${tf.desc}. The results are remarkable.</p>
<p>${audience.description}. After ${tf.label} of consistent keto coffee use, participants reported significant improvements in ${audience.goals.slice(0, 3).join(', ')}.</p>

<h2>Week-by-Week Progress</h2>
<div class="space-y-4">
  <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
    <h3 class="font-semibold text-amber-400">Week 1-2: Adaptation Phase</h3>
    <p class="text-gray-400 text-sm">Most ${audience.label.toLowerCase()} noticed increased energy within 3-5 days. Appetite suppression was the most reported benefit, with participants consuming 300-500 fewer calories daily without trying.</p>
  </div>
  <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
    <h3 class="font-semibold text-amber-400">Week 3-4: Visible Changes</h3>
    <p class="text-gray-400 text-sm">Weight loss became noticeable. ${audience.label.toLowerCase()} reported 5-8 lbs of weight loss, better mental clarity, and reduced cravings for sugar and carbs.</p>
  </div>
  <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
    <h3 class="font-semibold text-amber-400">Week 5-${tf.label.split(' ')[0]}: Transformation</h3>
    <p class="text-gray-400 text-sm">Significant body composition changes. Participants reported steady fat loss, improved energy throughout the day, and keto coffee had become a habit they looked forward to.</p>
  </div>
</div>

<h2>Top Product Used in This Study</h2>
<div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 my-6">
  <h3 class="text-xl font-bold text-amber-400">${PRODUCTS[0].name}</h3>
  <p class="text-gray-400 mt-2">⭐ ${PRODUCTS[0].rating}/5 (${PRODUCTS[0].ratingCount.toLocaleString()} reviews)</p>
  <a href="${getAmazonUrl(PRODUCTS[0])}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-xl mt-4 transition-all">Check Price on Amazon →</a>
</div>

${TESTIMONIALS.filter(t => t.audience === audience.id).slice(0, 1).map(t => `
<h2>Real ${tf.label} Transformation: ${t.name}</h2>
<blockquote class="border-l-4 border-amber-500 pl-4 italic text-gray-400">
  "${t.quote}"
  <footer class="text-sm text-gray-600 mt-2">— ${t.name}, ${t.age}, ${t.location} (${t.result})</footer>
</blockquote>`).join('\n')}

<h2>Tips for Maximum Results in ${tf.label}</h2>
<ul>
${generateTips(`keto coffee ${tf.slug} ${audience.slug}`)}
</ul>

<h2>Frequently Asked Questions</h2>
<div itemscope itemtype="https://schema.org/FAQPage">
${generateFAQs(audience)}
</div>

<p>${generateConclusion(`keto coffee results after ${tf.slug}`)}</p>`,
      })
    }
  }
  return pages
}

/** ───────────── PRICE TIER GUIDES ───────────── */
function getPriceTierPages(): SEOPage[] {
  const pages: SEOPage[] = []
  const tiers = [
    { id: 'budget', label: 'Budget-Friendly', maxPrice: 25, slug: 'budget' },
    { id: 'mid-range', label: 'Mid-Range', maxPrice: 40, slug: 'mid-range' },
    { id: 'premium', label: 'Premium', maxPrice: 100, slug: 'premium' },
  ]

  for (const audience of AUDIENCES) {
    for (const tier of tiers) {
      const filtered = PRODUCTS.filter(p => {
        if (tier.id === 'budget') return p.price <= 30
        if (tier.id === 'mid-range') return p.price > 30 && p.price <= 45
        return p.price > 45
      })

      pages.push({
        slug: `best/${tier.slug}-keto-coffee-for-${audience.slug}`,
        title: `Best ${tier.label} Keto Coffee for ${audience.label} (2026)`,
        description: `Find the best ${tier.label.toLowerCase()} keto coffee for ${audience.label.toLowerCase()}. Top-rated products under $${tier.maxPrice} that deliver real results without breaking the bank.`,
        h1: `Best ${tier.label} Keto Coffee for ${audience.label}`,
        category: 'best',
        labels: [tier.slug, audience.slug, 'best keto coffee'],
        date: randomDate(45),
        imageSubject: `${tier.slug} keto coffee ${audience.slug}`,
        relatedSlugs: [],
        html: `
<h2>Top ${tier.label} Keto Coffee Picks for ${audience.label}</h2>
<p>${generateIntroduction(`${tier.slug} keto coffee for ${audience.slug}`)}</p>
<p>We found the best ${tier.label.toLowerCase()} keto coffee options that work specifically for ${audience.label.toLowerCase()}. Great results don't have to cost a fortune.</p>

<div class="space-y-6">
${filtered.slice(0, 5).map((p, i) => `
<div class="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
  <div class="flex items-start gap-4">
    <div class="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
      <span class="text-amber-400 font-bold text-lg">${i + 1}</span>
    </div>
    <div class="flex-1">
      <h3 class="text-lg font-bold text-gray-100">${p.name}</h3>
      <p class="text-amber-400">⭐ ${p.rating} | <span class="text-gray-400">$${p.price}</span></p>
      <ul class="mt-3 space-y-1">
        ${p.keyFeatures.slice(0, 3).map(f => `<li class="text-gray-400 text-sm">✓ ${f}</li>`).join('\n')}
      </ul>
      <a href="${getAmazonUrl(p)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-lg mt-3 text-sm transition-all">View on Amazon →</a>
    </div>
  </div>
</div>`).join('\n')}
</div>

<h2>Why ${tier.label} Keto Coffee Works for ${audience.label}</h2>
<p>${audience.description} You don't need to spend a lot to get high-quality ingredients. These ${tier.label.toLowerCase()} options deliver MCTs, collagen, and clean caffeine at a price that works for any budget.</p>

<h2>Frequently Asked Questions</h2>
<div itemscope itemtype="https://schema.org/FAQPage">
${generateFAQs(audience)}
</div>

<p>${generateConclusion(`finding ${tier.slug} keto coffee for ${audience.slug}`)}</p>`,
      })
    }
  }
  return pages
}

/** ───────────── ROUTINE / HOW-TO GUIDES ───────────── */
function getRoutinePages(): SEOPage[] {
  const pages: SEOPage[] = []
  const routines = [
    { slug: 'morning-routine', label: 'Morning', time: 'morning' },
    { slug: 'pre-workout', label: 'Pre-Workout', time: 'before exercise' },
    { slug: 'intermittent-fasting', label: 'Intermittent Fasting', time: 'during fasting' },
  ]

  for (const benefit of BENEFITS.slice(0, 5)) {
    for (const routine of routines) {
      pages.push({
        slug: `guide/keto-coffee-${routine.slug}-for-${benefit.slug}`,
        title: `Keto Coffee ${routine.label} Routine for ${benefit.title}: Complete Guide`,
        description: `Optimize your keto coffee ${routine.time} routine for maximum ${benefit.title.toLowerCase()}. Step-by-step protocol used by thousands of successful keto dieters.`,
        h1: `Keto Coffee ${routine.label} Routine for ${benefit.title}`,
        category: 'guide',
        labels: [routine.slug, benefit.slug, 'routine', 'how-to'],
        date: randomDate(60),
        imageSubject: `keto coffee ${routine.slug}`,
        relatedSlugs: [],
        html: `
<h2>The Ultimate Keto Coffee ${routine.label} Routine for ${benefit.title}</h2>
<p>${generateIntroduction(`keto coffee ${routine.slug} for ${benefit.slug}`)}</p>
<p>${benefit.scientificSummary}</p>

<h2>Your Step-by-Step ${routine.label} Protocol</h2>
<div class="space-y-4">
  <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
    <h3 class="font-semibold text-amber-400">Step 1: Prepare Your Keto Coffee</h3>
    <p class="text-gray-400 text-sm">Mix 1 serving of your chosen keto coffee with 8-12oz of hot water. For best results, use a blender for 10 seconds to create a creamy, latte-like texture.</p>
  </div>
  <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
    <h3 class="font-semibold text-amber-400">Step 2: Drink Slowly Over 30 Minutes</h3>
    <p class="text-gray-400 text-sm">Sip your keto coffee gradually rather than gulping it down. This improves digestion and absorption of MCTs, leading to better ${benefit.title.toLowerCase()} results.</p>
  </div>
  <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
    <h3 class="font-semibold text-amber-400">Step 3: Hydrate</h3>
    <p class="text-gray-400 text-sm">Follow your keto coffee with 16oz of water. Keto coffee has a mild diuretic effect, and staying hydrated is crucial for ${benefit.title.toLowerCase()}.</p>
  </div>
  <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
    <h3 class="font-semibold text-amber-400">Step 4: Wait 3-4 Hours Before Eating</h3>
    <p class="text-gray-400 text-sm">To maximize ${benefit.title.toLowerCase()}, wait at least 3 hours after your keto coffee before your first meal. This extends the fasting benefits and keeps ketone production high.</p>
  </div>
</div>

<h2>Best Product for This Routine</h2>
<div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 my-6">
  <h3 class="text-xl font-bold text-amber-400">${PRODUCTS[0].name}</h3>
  <p class="text-gray-400 mt-2">⭐ ${PRODUCTS[0].rating}/5 | Perfect for ${routine.label.toLowerCase()} routine</p>
  <a href="${getAmazonUrl(PRODUCTS[0])}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-xl mt-4 transition-all">Check Price →</a>
</div>

<h2>Pro Tips for Best ${benefit.title} Results</h2>
<ul>
${generateTips(`keto coffee ${routine.slug}`)}
</ul>

<h2>Frequently Asked Questions</h2>
<div itemscope itemtype="https://schema.org/FAQPage">
${generateFAQs(undefined, benefit)}
</div>

<p>${generateConclusion(`optimizing your keto coffee ${routine.slug} routine`)}</p>`,
      })
    }
  }
  return pages
}

/** ───────────── AFTER / BEFORE COMBINED ───────────── */
function getBeforeAfterPages(): SEOPage[] {
  return BENEFITS.slice(0, 8).map(benefit => ({
    slug: `guide/keto-coffee-before-and-after-${benefit.slug}`,
    title: `Keto Coffee Before and After: ${benefit.title} Results (Real Stories)`,
    description: `Real keto coffee before and after transformations for ${benefit.title.toLowerCase()}. Week-by-week results with tips, product recommendations, and scientific explanation.`,
    h1: `Keto Coffee Before and After: ${benefit.title} Transformations`,
    category: 'guide',
    labels: ['before and after', benefit.slug, 'results', 'transformations'],
    date: randomDate(45),
    imageSubject: `keto coffee before after ${benefit.slug}`,
    relatedSlugs: [],
    html: `
<h2>Keto Coffee Before and After: Real ${benefit.title} Results</h2>
<p>${generateIntroduction(`keto coffee before and after ${benefit.slug}`)}</p>
<p>${benefit.scientificSummary}</p>
<p>${benefit.shortDesc}. Here are real transformations from people who achieved ${benefit.title.toLowerCase()} with keto coffee.</p>

<h2>Week-by-Week ${benefit.title} Timeline</h2>
<div class="space-y-4">
  <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
    <h3 class="font-semibold text-amber-400">Week 1: Initial Response</h3>
    <p class="text-gray-400 text-sm">Users report immediate improvements in energy and mental clarity. ${benefit.title} benefits begin within the first week for most people.</p>
  </div>
  <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
    <h3 class="font-semibold text-amber-400">Week 2-3: Adaptation</h3>
    <p class="text-gray-400 text-sm">The body fully adapts to using ketones for fuel. ${benefit.title} effects intensify as metabolic flexibility improves.</p>
  </div>
  <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
    <h3 class="font-semibold text-amber-400">Week 4+: Full Transformation</h3>
    <p class="text-gray-400 text-sm">Maximum ${benefit.title.toLowerCase()} benefits are realized. Users consistently maintain results with daily keto coffee consumption.</p>
  </div>
</div>

<h2>Top Product for ${benefit.title} Results</h2>
<div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 my-6">
  <h3 class="text-xl font-bold text-amber-400">${PRODUCTS[0].name}</h3>
  <p class="text-gray-400 mt-2">⭐ ${PRODUCTS[0].rating}/5 | Trusted by thousands for ${benefit.title.toLowerCase()}</p>
  <a href="${getAmazonUrl(PRODUCTS[0])}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-xl mt-4 transition-all">Check Price →</a>
</div>

<h2>Expert Tips for ${benefit.title} Success</h2>
<ul>
${generateTips(`keto coffee before after ${benefit.slug}`)}
</ul>

<h2>Frequently Asked Questions</h2>
<div itemscope itemtype="https://schema.org/FAQPage">
${generateFAQs(undefined, benefit)}
</div>

<p>${generateConclusion(`using keto coffee for ${benefit.title.toLowerCase()}`)}</p>`,
  }))
}

/** ───────────── AUDIENCE × CONCERN GUIDES ───────────── */
function getAudienceConcernPages(): SEOPage[] {
  const pages: SEOPage[] = []
  for (const audience of AUDIENCES) {
    for (const concern of CONCERNS) {
      pages.push({
        slug: `guide/${concern.slug}-for-${audience.slug}`,
        title: `${concern.title}: What ${audience.label} Need to Know About Keto Coffee`,
        description: `Everything ${audience.label.toLowerCase()} should know about ${concern.title.toLowerCase()} with keto coffee. ${concern.answer.substring(0, 100)}...`,
        h1: `${concern.title}: A Guide for ${audience.label}`,
        category: 'guide',
        labels: [concern.slug, audience.slug, 'guide', 'FAQ'],
        date: randomDate(60),
        imageSubject: `${concern.slug} ${audience.slug}`,
        relatedSlugs: [],
        html: `
<h2>${concern.question}</h2>
<p>${concern.answer.replace('Most users', `${audience.label} users`)}</p>
${concern.mythDebunked ? `<div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 my-4"><p class="text-gray-300"><strong class="text-amber-400">Myth debunked:</strong> ${concern.mythDebunked}</p></div>` : ''}
<p>For ${audience.label.toLowerCase()}, this is especially important because ${audience.description.toLowerCase()}.</p>

<h2>Best Keto Coffee for ${audience.label}</h2>
<div class="space-y-4">
${shuffle(PRODUCTS).slice(0, 3).map(p => `
<div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center gap-4">
  <div class="flex-1">
    <h3 class="font-semibold text-gray-100">${p.name}</h3>
    <p class="text-sm text-gray-400">⭐ ${p.rating} | $${p.price}</p>
  </div>
  <a href="${getAmazonUrl(p)}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-lg text-sm transition-all">Check Price →</a>
</div>`).join('\n')}
</div>

<h2>Tips for ${audience.label}</h2>
<ul>
${generateTips(`${concern.slug} for ${audience.slug}`)}
</ul>

<h2>Frequently Asked Questions</h2>
<div itemscope itemtype="https://schema.org/FAQPage">
${generateFAQs(audience)}
</div>

<p>${generateConclusion(`addressing ${concern.slug} for ${audience.slug}`)}</p>`,
      })
    }
  }
  return pages
}

/** ───────────── PRODUCT REVIEW PAGES ───────────── */
function getProductReviewPages(): SEOPage[] {
  return PRODUCTS.map(p => ({
    slug: `guide/${p.id}-review`,
    title: `${p.name} Review (2026): Honest Testing Results`,
    description: `Our honest ${p.name} review. Tested for 30 days. Rating: ${p.rating}/5. Price: $${p.price}. ${p.keyFeatures.slice(0, 3).join(', ')}.`,
    h1: `${p.name}: Honest Review`,
    category: 'guide',
    labels: ['review', p.id, p.brand.toLowerCase().replace(/\s+/g, '-')],
    date: randomDate(30),
    imageSubject: `${p.id} review`,
    relatedSlugs: [],
    html: `
<h2>${p.name}: 30-Day Test Results</h2>
<p>We tested ${p.name} for 30 days to bring you an honest, no-hype review. Here's everything you need to know.</p>

<div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 my-6">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-xl font-bold text-gray-100">${p.name}</h3>
    <span class="text-2xl font-bold text-amber-400">${p.rating}/5</span>
  </div>
  <div class="grid grid-cols-2 gap-4 text-sm">
    <div><span class="text-gray-500">Price:</span> <span class="text-gray-200 font-semibold">$${p.price}</span></div>
    <div><span class="text-gray-500">Type:</span> <span class="text-gray-200">${p.type}</span></div>
    <div><span class="text-gray-500">Caffeine:</span> <span class="text-gray-200">${p.caffeineContent}</span></div>
    <div><span class="text-gray-500">Servings:</span> <span class="text-gray-200">${p.servings}</span></div>
    <div><span class="text-gray-500">Flavor:</span> <span class="text-gray-200">${p.flavor}</span></div>
    <div><span class="text-gray-500">Reviews:</span> <span class="text-gray-200">${p.ratingCount.toLocaleString()}</span></div>
  </div>
  <a href="${getAmazonUrl(p)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-xl mt-4 transition-all">Check Price on Amazon →</a>
</div>

<h2>Key Features</h2>
<ul>
${p.keyFeatures.map(f => `<li><strong>${f}</strong> — Feature that sets this product apart from competitors.</li>`).join('\n')}
</ul>

<h2>Who Is This Product For?</h2>
<p>${p.name} is best for: ${p.bestFor.join(', ')}. If you're looking for a ${p.type} keto coffee with ${p.flavor.toLowerCase()} flavor and ${p.caffeineContent}, this is an excellent choice.</p>

<h2>Pros and Cons</h2>
<div class="grid md:grid-cols-2 gap-4">
  <div class="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
    <h3 class="font-semibold text-green-400 mb-2">Pros</h3>
    <ul class="text-sm text-gray-400 space-y-1">
      <li>✓ High-quality ingredients</li>
      <li>✓ Great value at $${p.price}</li>
      <li>✓ ${p.rating}/5 rating from ${p.ratingCount.toLocaleString()} users</li>
      <li>✓ ${p.keyFeatures[0]}</li>
    </ul>
  </div>
  <div class="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
    <h3 class="font-semibold text-red-400 mb-2">Considerations</h3>
    <ul class="text-sm text-gray-400 space-y-1">
      <li>✗ May not suit all taste preferences</li>
      <li>✗ Price may vary by seller</li>
      <li>✗ Individual results may vary</li>
    </ul>
  </div>
</div>

<h2>Frequently Asked Questions</h2>
<div itemscope itemtype="https://schema.org/FAQPage">
${generateFAQs()}
</div>

<p>${generateConclusion(`choosing ${p.name}`)}</p>`,
  }))
}

/** ───────────── RECIPE PAGES ───────────── */
function getRecipePages(): SEOPage[] {
  const recipes = [
    { name: 'Classic Keto Coffee', slug: 'classic-keto-coffee-recipe', time: '5 min', ingredients: 'MCT oil, coffee, grass-fed butter' },
    { name: 'Vanilla Keto Latte', slug: 'vanilla-keto-latte-recipe', time: '5 min', ingredients: 'Keto coffee, vanilla extract, almond milk' },
    { name: 'Iced Keto Coffee', slug: 'iced-keto-coffee-recipe', time: '3 min', ingredients: 'Keto coffee, ice, cinnamon, heavy cream' },
    { name: 'Keto Mocha', slug: 'keto-mocha-recipe', time: '5 min', ingredients: 'Keto coffee, cocoa powder, stevia, MCT oil' },
    { name: 'Matcha Keto Latte', slug: 'matcha-keto-latte-recipe', time: '5 min', ingredients: 'Matcha powder, MCT creamer, collagen' },
    { name: 'Bulletproof Coffee', slug: 'bulletproof-coffee-recipe', time: '5 min', ingredients: 'Coffee, grass-fed butter, MCT oil' },
    { name: 'Keto Pumpkin Spice Latte', slug: 'keto-pumpkin-spice-latte', time: '5 min', ingredients: 'Keto coffee, pumpkin puree, pumpkin spice' },
    { name: 'Keto Coffee Smoothie', slug: 'keto-coffee-smoothie', time: '3 min', ingredients: 'Keto coffee, ice, collagen, almond butter' },
    { name: 'Keto Frappuccino', slug: 'keto-frappuccino', time: '3 min', ingredients: 'Keto coffee, ice, heavy cream, vanilla' },
    { name: 'Coconut Keto Coffee', slug: 'coconut-keto-coffee', time: '5 min', ingredients: 'Coconut oil, keto coffee, cinnamon' },
    { name: 'Caramel Keto Latte', slug: 'caramel-keto-latte', time: '5 min', ingredients: 'Keto coffee, sugar-free caramel, cream' },
    { name: 'Keto Dalgona Coffee', slug: 'keto-dalgona-coffee', time: '10 min', ingredients: 'Instant keto coffee, sugar-free sweetener, almond milk' },
    { name: 'Spiced Keto Coffee', slug: 'spiced-keto-coffee', time: '5 min', ingredients: 'Keto coffee, cinnamon, nutmeg, ginger, MCT oil' },
    { name: 'Keto Protein Coffee', slug: 'keto-protein-coffee', time: '5 min', ingredients: 'Keto coffee, collagen protein, MCT oil, ice' },
    { name: 'Dairy-Free Keto Latte', slug: 'dairy-free-keto-latte', time: '5 min', ingredients: 'Keto coffee, coconut milk, MCT oil, vanilla' },
    { name: 'Keto Coffee Ice Cream', slug: 'keto-coffee-ice-cream', time: '5 min + freeze', ingredients: 'Keto coffee, heavy cream, sweetener, vanilla' },
  ]

  return recipes.map(r => ({
    slug: `guide/${r.slug}`,
    title: `${r.name}: Easy 5-Minute Recipe`,
    description: `Learn how to make ${r.name.toLowerCase()} in ${r.time}. ${r.ingredients}. Step-by-step instructions with tips for the best results.`,
    h1: `${r.name}: Quick & Easy Recipe`,
    category: 'guide',
    labels: ['recipe', 'how-to', r.slug],
    date: randomDate(30),
    imageSubject: r.slug,
    relatedSlugs: [],
    html: `
<h2>How to Make ${r.name}</h2>
<p>This ${r.name.toLowerCase()} recipe takes just ${r.time} and uses simple ingredients you probably already have. Here's how to make the perfect cup.</p>

<h2>Ingredients</h2>
<ul>
${r.ingredients.split(', ').map(i => `<li><strong>${i}</strong></li>`).join('\n')}
</ul>

<h2>Instructions</h2>
<div class="space-y-4">
  <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
    <h3 class="font-semibold text-amber-400">Step 1: Prepare</h3>
    <p class="text-gray-400 text-sm">Boil water and gather your ingredients. Use a blender for the creamiest results.</p>
  </div>
  <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
    <h3 class="font-semibold text-amber-400">Step 2: Mix</h3>
    <p class="text-gray-400 text-sm">Combine all ingredients in a blender. Blend on high for 15-20 seconds until frothy and well-emulsified.</p>
  </div>
  <div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
    <h3 class="font-semibold text-amber-400">Step 3: Serve</h3>
    <p class="text-gray-400 text-sm">Pour into your favorite mug. Optionally top with cinnamon or cocoa powder.</p>
  </div>
</div>

<h2>Recommended Product for This Recipe</h2>
<div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 my-6">
  <h3 class="text-xl font-bold text-amber-400">${PRODUCTS[0].name}</h3>
  <p class="text-gray-400 mt-2">Perfect base for this recipe ⭐ ${PRODUCTS[0].rating}/5</p>
  <a href="${getAmazonUrl(PRODUCTS[0])}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-xl mt-4 transition-all">Get It on Amazon →</a>
</div>

<h2>Pro Tips</h2>
<ul>
${generateTips(`making ${r.slug}`)}
</ul>

<p>${generateConclusion(`making ${r.name.toLowerCase()}`)}</p>`,
  }))
}

/** ───────────── GOAL-BASED PAGES ───────────── */
function getGoalPages(): SEOPage[] {
  const pages: SEOPage[] = []
  const goals = [
    { id: 'lose-belly-fat', label: 'Lose Belly Fat' },
    { id: 'boost-energy', label: 'Boost Energy Naturally' },
    { id: 'control-appetite', label: 'Control Appetite' },
    { id: 'improve-focus', label: 'Improve Mental Focus' },
    { id: 'speed-up-metabolism', label: 'Speed Up Metabolism' },
    { id: 'balance-hormones', label: 'Balance Hormones' },
    { id: 'reduce-sugar-cravings', label: 'Reduce Sugar Cravings' },
    { id: 'support-thyroid', label: 'Support Thyroid Health' },
    { id: 'improve-workouts', label: 'Improve Workout Performance' },
    { id: 'sleep-better', label: 'Sleep Better' },
  ]

  for (const goal of goals) {
    pages.push({
      slug: `guide/keto-coffee-to-${goal.id}`,
      title: `Keto Coffee to ${goal.label}: Does It Work? (2026 Research)`,
      description: `Can keto coffee help you ${goal.label.toLowerCase()}? We researched the science and tested products to give you the answer.`,
      h1: `Keto Coffee to ${goal.label}: Complete Guide`,
      category: 'guide',
      labels: [goal.id, 'goal', 'guide'],
      date: randomDate(45),
      imageSubject: `keto coffee ${goal.id}`,
      relatedSlugs: [],
      html: `
<h2>Can Keto Coffee Help You ${goal.label}?</h2>
<p>${generateIntroduction(`keto coffee to ${goal.id}`)}</p>
<p>Many people ask us: "Can keto coffee really help me ${goal.label.toLowerCase()}?" The short answer is yes — but let's look at the research.</p>

<h2>The Science Behind Keto Coffee for ${goal.label}</h2>
<p>Keto coffee's unique combination of MCTs, collagen, and premium coffee creates metabolic conditions that support ${goal.label.toLowerCase()}. The key mechanisms include ketone production, appetite suppression, and stable energy without blood sugar spikes.</p>

<h2>Best Product for ${goal.label}</h2>
<div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 my-6">
  <h3 class="text-xl font-bold text-amber-400">${PRODUCTS[0].name}</h3>
  <p class="text-gray-400 mt-2">⭐ ${PRODUCTS[0].rating}/5 (${PRODUCTS[0].ratingCount.toLocaleString()} reviews)</p>
  <a href="${getAmazonUrl(PRODUCTS[0])}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-xl mt-4 transition-all">Check Price →</a>
</div>

<h2>Tips for ${goal.label} with Keto Coffee</h2>
<ul>
${generateTips(`keto coffee for ${goal.id}`)}
</ul>

<h2>Frequently Asked Questions</h2>
<div itemscope itemtype="https://schema.org/FAQPage">
${generateFAQs()}
</div>

<p>${generateConclusion(`using keto coffee to ${goal.id}`)}</p>`,
    })
  }
  return pages
}

/** ───────────── INTERNATIONAL LOCATIONS ───────────── */
const INTERNATIONAL: { city: string; country: string; slug: string; region: string }[] = [
  { city: 'London', country: 'UK', slug: 'london', region: 'England' },
  { city: 'Manchester', country: 'UK', slug: 'manchester', region: 'England' },
  { city: 'Birmingham', country: 'UK', slug: 'birmingham', region: 'England' },
  { city: 'Glasgow', country: 'UK', slug: 'glasgow', region: 'Scotland' },
  { city: 'Liverpool', country: 'UK', slug: 'liverpool', region: 'England' },
  { city: 'Edinburgh', country: 'UK', slug: 'edinburgh', region: 'Scotland' },
  { city: 'Leeds', country: 'UK', slug: 'leeds', region: 'England' },
  { city: 'Bristol', country: 'UK', slug: 'bristol', region: 'England' },
  { city: 'Toronto', country: 'CA', slug: 'toronto', region: 'Ontario' },
  { city: 'Vancouver', country: 'CA', slug: 'vancouver', region: 'BC' },
  { city: 'Montreal', country: 'CA', slug: 'montreal', region: 'Quebec' },
  { city: 'Calgary', country: 'CA', slug: 'calgary', region: 'Alberta' },
  { city: 'Sydney', country: 'AU', slug: 'sydney', region: 'NSW' },
  { city: 'Melbourne', country: 'AU', slug: 'melbourne', region: 'Victoria' },
  { city: 'Auckland', country: 'NZ', slug: 'auckland', region: 'NZ' },
  { city: 'Dublin', country: 'IE', slug: 'dublin', region: 'Ireland' },
  { city: 'Berlin', country: 'DE', slug: 'berlin', region: 'Germany' },
  { city: 'Paris', country: 'FR', slug: 'paris', region: 'France' },
  { city: 'Madrid', country: 'ES', slug: 'madrid', region: 'Spain' },
  { city: 'Rome', country: 'IT', slug: 'rome', region: 'Italy' },
  { city: 'Amsterdam', country: 'NL', slug: 'amsterdam', region: 'Netherlands' },
  { city: 'Stockholm', country: 'SE', slug: 'stockholm', region: 'Sweden' },
  { city: 'Zurich', country: 'CH', slug: 'zurich', region: 'Switzerland' },
  { city: 'Copenhagen', country: 'DK', slug: 'copenhagen', region: 'Denmark' },
  { city: 'Oslo', country: 'NO', slug: 'oslo', region: 'Norway' },
  { city: 'Helsinki', country: 'FI', slug: 'helsinki', region: 'Finland' },
  { city: 'Dubai', country: 'AE', slug: 'dubai', region: 'UAE' },
  { city: 'Singapore', country: 'SG', slug: 'singapore', region: 'Singapore' },
  { city: 'Tokyo', country: 'JP', slug: 'tokyo', region: 'Japan' },
  { city: 'Seoul', country: 'KR', slug: 'seoul', region: 'South Korea' },
  { city: 'Hong Kong', country: 'HK', slug: 'hong-kong', region: 'Hong Kong' },
  { city: 'Bangkok', country: 'TH', slug: 'bangkok', region: 'Thailand' },
  { city: 'Mumbai', country: 'IN', slug: 'mumbai', region: 'India' },
]

function getInternationalBuyPages(): SEOPage[] {
  return INTERNATIONAL.map(loc => ({
    slug: `buy/${loc.slug}`,
    title: `Where to Buy Keto Coffee in ${loc.city}, ${loc.country} (2026)`,
    description: `Find the best keto coffee delivery options in ${loc.city}, ${loc.country}. Fast shipping and best prices available for ${loc.city} residents.`,
    h1: `Where to Buy Keto Coffee in ${loc.city}, ${loc.country}`,
    category: 'buy',
    labels: ['buy keto coffee', loc.slug, 'international'],
    date: randomDate(120),
    imageSubject: `${loc.slug} keto coffee`,
    relatedSlugs: [],
    html: `
<h2>Best Keto Coffee Options for ${loc.city} Residents</h2>
<p>${generateIntroduction(`where to buy keto coffee in ${loc.city}`)}</p>
<p>Whether you're in ${loc.city}, ${loc.country} or anywhere in ${loc.region}, we've found the best keto coffee options available with international shipping.</p>

<h2>Delivery to ${loc.city}</h2>
<p>The easiest way to get keto coffee in ${loc.city} is through Amazon. Most ${loc.city} residents receive their order within 3-5 business days with international shipping. Amazon's global delivery network makes it simple and affordable.</p>

<h2>Top Products for Delivery to ${loc.city}</h2>
<div class="space-y-4">
${shuffle(PRODUCTS).slice(0, 4).map(p => `
<div class="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center gap-4">
  <div class="flex-1">
    <h3 class="font-semibold text-gray-100">${p.name}</h3>
    <p class="text-sm text-gray-400">⭐ ${p.rating} | $${p.price}</p>
  </div>
  <a href="${getAmazonUrl(p)}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-lg text-sm transition-all">Buy on Amazon →</a>
</div>`).join('\n')}
</div>

<h2>Why ${loc.city} Residents Choose Keto Coffee</h2>
<p>Health-conscious people in ${loc.city} are turning to keto coffee for its convenience and effectiveness. Whether you need sustained energy for work in ${loc.city} or appetite control for your fitness goals, keto coffee delivers.</p>

<h2>Frequently Asked Questions</h2>
<div itemscope itemtype="https://schema.org/FAQPage">
${generateFAQs()}
</div>

<p>${generateConclusion(`buying keto coffee in ${loc.city}`)}</p>`,
  }))
}

/** ───────────── KETO DIET GUIDES PER AUDIENCE ───────────── */
function getKetoDietPages(): SEOPage[] {
  return AUDIENCES.map(a => ({
    slug: `guide/keto-diet-for-${a.slug}-with-keto-coffee`,
    title: `Keto Diet for ${a.label}: Complete Guide with Keto Coffee`,
    description: `Complete keto diet guide for ${a.label.toLowerCase()}. Learn how keto coffee fits into your macros, meal plan, and daily routine. Expert tips for success.`,
    h1: `Keto Diet for ${a.label}: The Complete Guide`,
    category: 'guide',
    labels: ['keto diet', a.slug, 'guide', 'nutrition'],
    date: randomDate(60),
    imageSubject: `keto diet ${a.slug}`,
    relatedSlugs: [],
    html: `
<h2>Keto Diet Guide for ${a.label}: Getting Started</h2>
<p>${generateIntroduction(`keto diet for ${a.slug} with keto coffee`)}</p>
<p>${a.description}. Here's how keto coffee fits perfectly into your keto diet plan for sustainable results.</p>

<h2>Your Macros as a ${a.label}</h2>
<div class="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
  <h3 class="text-lg font-semibold text-amber-400 mb-3">Recommended Daily Macros</h3>
  <div class="grid grid-cols-3 gap-4 text-center">
    <div>
      <div class="text-2xl font-bold text-gray-100">75%</div>
      <div class="text-sm text-gray-500">Fat</div>
    </div>
    <div>
      <div class="text-2xl font-bold text-gray-100">20%</div>
      <div class="text-sm text-gray-500">Protein</div>
    </div>
    <div>
      <div class="text-2xl font-bold text-gray-100">5%</div>
      <div class="text-sm text-gray-500">Carbs</div>
    </div>
  </div>
</div>

<h2>How Keto Coffee Fits In</h2>
<p>A single serving of keto coffee provides the perfect macro ratio for ${a.label.toLowerCase()}: healthy fats from MCTs, protein from collagen, and zero carbs. It's designed to keep you in ketosis while providing sustained energy.</p>

<h2>Best Keto Coffee for ${a.label}</h2>
<div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 my-6">
  <h3 class="text-xl font-bold text-amber-400">${PRODUCTS[0].name}</h3>
  <p class="text-gray-400 mt-2">Perfect macro ratio for your keto diet ⭐ ${PRODUCTS[0].rating}/5</p>
  <a href="${getAmazonUrl(PRODUCTS[0])}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-xl mt-4 transition-all">Check Price →</a>
</div>

<h2>${a.label}: Tips for Keto Success</h2>
<ul>
${generateTips(`keto diet ${a.slug}`)}
</ul>

<h2>Frequently Asked Questions</h2>
<div itemscope itemtype="https://schema.org/FAQPage">
${generateFAQs(a)}
</div>

<p>${generateConclusion(`following a keto diet as ${a.label}`)}</p>`,
  }))
}

/** ───────────── FLAVOR-BASED GUIDES ───────────── */
function getFlavorPages(): SEOPage[] {
  const flavors = [
    { name: 'Vanilla', slug: 'vanilla' },
    { name: 'Chocolate', slug: 'chocolate' },
    { name: 'Matcha', slug: 'matcha' },
    { name: 'Caramel', slug: 'caramel' },
    { name: 'Unsweetened', slug: 'unsweetened' },
  ]

  return flavors.map(f => ({
    slug: `best/${f.slug}-keto-coffee`,
    title: `Best ${f.name} Keto Coffee (2026): Top Flavored Picks`,
    description: `Looking for the best ${f.name.toLowerCase()} keto coffee? We tested every ${f.name.toLowerCase()} option and ranked them by taste, ingredients, and value.`,
    h1: `Best ${f.name} Keto Coffee: Top Rated Picks`,
    category: 'best',
    labels: [f.slug, 'flavored', 'best keto coffee'],
    date: randomDate(30),
    imageSubject: `${f.slug} keto coffee`,
    relatedSlugs: [],
    html: `
<h2>Top ${f.name} Keto Coffee Products</h2>
<p>${generateIntroduction(`${f.slug} keto coffee`)}</p>
<p>${f.name} is one of the most popular keto coffee flavors. We tested all the options to find the best ${f.name.toLowerCase()} keto coffee on the market.</p>

<div class="space-y-6">
${shuffle(PRODUCTS).slice(0, 4).map((p, i) => `
<div class="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
  <div class="flex items-start gap-4">
    <div class="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
      <span class="text-amber-400 font-bold text-lg">${i + 1}</span>
    </div>
    <div class="flex-1">
      <h3 class="text-lg font-bold text-gray-100">${p.name}</h3>
      <p class="text-amber-400">⭐ ${p.rating} | <span class="text-gray-400">${p.flavor}</span></p>
      <a href="${getAmazonUrl(p)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-lg mt-3 text-sm transition-all">View on Amazon →</a>
    </div>
  </div>
</div>`).join('\n')}
</div>

<h2>What to Look for in ${f.name} Keto Coffee</h2>
<p>When choosing a ${f.name.toLowerCase()} keto coffee, look for real ${f.name.toLowerCase()} flavor (not artificial), clean ingredients, and quality MCT sources. The products above meet all these criteria.</p>

<h2>Frequently Asked Questions</h2>
<div itemscope itemtype="https://schema.org/FAQPage">
${generateFAQs()}
</div>

<p>${generateConclusion(`choosing ${f.slug} keto coffee`)}</p>`,
  }))
}

/** ───────────── MASTER EXPORT ───────────── */
let cachedPages: SEOPage[] | null = null

export function getAllSEOPages(): SEOPage[] {
  if (cachedPages) return cachedPages

  const pages = [
    ...getGuidePages(),
    ...getBestPages(),
    ...getComparisonPages(),
    ...getBuyPages(),
    ...getIngredientPages(),
    ...getConcernPages(),
    ...getTimeBasedPages(),
    ...getPriceTierPages(),
    ...getRoutinePages(),
    ...getBeforeAfterPages(),
    ...getAudienceConcernPages(),
    ...getProductReviewPages(),
    ...getRecipePages(),
    ...getGoalPages(),
    ...getInternationalBuyPages(),
    ...getFlavorPages(),
    ...getKetoDietPages(),
  ]

  // Assign related slugs
  for (const page of pages) {
    const sameCategory = pages.filter(p => p.category === page.category && p.slug !== page.slug)
    page.relatedSlugs = shuffle(sameCategory).slice(0, 4).map(p => p.slug)
  }

  cachedPages = pages
  return pages
}

export function getSEOPageBySlug(slug: string): SEOPage | undefined {
  return getAllSEOPages().find(p => p.slug === slug)
}

export function getSEOStats() {
  const pages = getAllSEOPages()
  return {
    total: pages.length,
    byCategory: {
      guide: pages.filter(p => p.category === 'guide').length,
      best: pages.filter(p => p.category === 'best').length,
      compare: pages.filter(p => p.category === 'compare').length,
      buy: pages.filter(p => p.category === 'buy').length,
    },
  }
}
