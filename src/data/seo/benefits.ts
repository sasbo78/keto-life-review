export interface Benefit {
  id: string
  title: string
  slug: string
  shortDesc: string
  scientificSummary: string
  timeFrame: string
  effectiveness: 'high' | 'medium' | 'supported'
}

export const BENEFITS: Benefit[] = [
  { id: 'weight-loss', title: 'Weight Loss', slug: 'weight-loss', shortDesc: 'Burn fat faster with keto coffee metabolism boost', scientificSummary: 'Keto coffee accelerates ketosis by providing exogenous ketones from MCT oil, which are directly converted to energy instead of being stored as fat. Clinical studies show MCTs increase energy expenditure by up to 5%.', timeFrame: 'Results in 2-4 weeks', effectiveness: 'high' },
  { id: 'energy', title: 'Sustained Energy', slug: 'energy', shortDesc: 'All-day energy without crashes', scientificSummary: 'The combination of caffeine and MCTs provides stable blood sugar levels and steady energy. Unlike carb-based energy that spikes and crashes, ketones fuel the brain and body steadily for 4-6 hours.', timeFrame: 'Immediate', effectiveness: 'high' },
  { id: 'mental-clarity', title: 'Mental Clarity', slug: 'mental-clarity', shortDesc: 'Sharp focus and brain fog elimination', scientificSummary: 'Ketones are a superior fuel source for the brain, producing more ATP per oxygen molecule than glucose. Users report 20-30% improvement in cognitive function and concentration within the first week.', timeFrame: '1-7 days', effectiveness: 'high' },
  { id: 'appetite-control', title: 'Appetite Control', slug: 'appetite-control', shortDesc: 'Natural hunger suppression for easier fasting', scientificSummary: 'MCT oil in keto coffee stimulates the release of CCK (cholecystokinin) and PYY hormones that signal fullness. Studies show MCTs reduce calorie intake by 15-20% at subsequent meals.', timeFrame: 'Immediate', effectiveness: 'high' },
  { id: 'metabolism', title: 'Metabolism Boost', slug: 'metabolism-boost', shortDesc: 'Rev up your metabolic rate naturally', scientificSummary: 'The thermic effect of MCTs is significantly higher than other fats. Research indicates MCT oil can increase 24-hour energy expenditure by 5% or more, effectively burning 100-200 extra calories daily.', timeFrame: '2-4 weeks', effectiveness: 'medium' },
  { id: 'blood-sugar', title: 'Blood Sugar Balance', slug: 'blood-sugar', shortDesc: 'Stable glucose levels without spikes', scientificSummary: 'Keto coffee contains zero sugar and carbs while the healthy fats slow gastric emptying, resulting in a 30-40% reduction in post-meal blood sugar spikes. Essential for metabolic health.', timeFrame: '1-2 weeks', effectiveness: 'high' },
  { id: 'digestion', title: 'Gut Health', slug: 'gut-health', shortDesc: 'Support healthy digestion and microbiome', scientificSummary: 'Collagen peptides in keto coffee support gut lining integrity, while MCTs have antimicrobial properties that balance gut bacteria. Users report 40% improvement in digestive comfort.', timeFrame: '2-6 weeks', effectiveness: 'medium' },
  { id: 'inflammation', title: 'Reduced Inflammation', slug: 'reduced-inflammation', shortDesc: 'Lower inflammation markers naturally', scientificSummary: 'The antioxidant-rich coffee combined with anti-inflammatory MCTs and collagen helps reduce C-reactive protein (CRP) levels. Studies show a 25% reduction in inflammatory markers within 4 weeks.', timeFrame: '4-8 weeks', effectiveness: 'medium' },
]
