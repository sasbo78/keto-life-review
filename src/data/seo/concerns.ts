export interface Concern {
  id: string
  title: string
  slug: string
  question: string
  answer: string
  mythDebunked?: string
}

export const CONCERNS: Concern[] = [
  { id: 'side-effects', title: 'Side Effects', slug: 'side-effects', question: 'Does keto coffee have side effects?', answer: 'Most users experience zero negative side effects. Some beginners report mild digestive adjustment during the first 3-5 days as their body adapts to MCT oil. Starting with half a serving and gradually increasing eliminates this entirely.', mythDebunked: 'Keto coffee does NOT cause heart problems, kidney damage, or "keto acidosis" in healthy individuals.' },
  { id: 'calories', title: 'Calorie Concerns', slug: 'calories', question: 'Will keto coffee break my fast?', answer: 'Clean keto coffee (MCT oil + water or unsweetened almond milk) contains under 50 calories per serving and does not break autophagy or interfere with intermittent fasting. It actually extends fasting benefits by suppressing appetite.' },
  { id: 'caffeine', title: 'Caffeine Sensitivity', slug: 'caffeine', question: 'Is the caffeine content too high?', answer: 'Keto coffee typically contains 80-180mg caffeine per serving, similar to regular coffee. Most brands offer caffeine-free options. Choose a matcha blend or collagen-only creamer for minimal caffeine.' },
  { id: 'taste', title: 'Taste Adaptation', slug: 'taste', question: 'Does keto coffee taste good?', answer: 'Modern keto coffee tastes remarkably similar to premium coffee with cream. The MCT oil creates a smooth, rich texture. Users who dislike the taste often haven\'t tried flavored varieties like vanilla, matcha, or mocha.' },
  { id: 'cost', title: 'Cost Effectiveness', slug: 'cost', question: 'Is keto coffee worth the price?', answer: 'At $1-1.50 per serving, keto coffee is cheaper than a Starbucks run and replaces both breakfast and coffee. When you factor in the meal replacement value, it saves money while delivering better nutrition.' },
  { id: 'ketosis', title: 'Getting Into Ketosis', slug: 'ketosis', question: 'Will keto coffee really help me stay in ketosis?', answer: 'Yes. The MCTs in keto coffee are directly converted to ketones by the liver. This raises blood ketone levels within 30-60 minutes, helping you enter or maintain ketosis even after a small carb slip.' },
  { id: 'weight-loss', title: 'Weight Loss Results', slug: 'weight-loss-results', question: 'How much weight can I lose with keto coffee?', answer: 'Users typically lose 5-10 lbs in the first month when replacing breakfast with keto coffee. Long-term users report 1-3 lbs per week of steady fat loss without hunger or deprivation.' },
  { id: 'diabetes', title: 'Diabetes Safety', slug: 'diabetes-safety', question: 'Is keto coffee safe for diabetics?', answer: 'Yes, keto coffee is generally excellent for diabetics as it contains zero sugar and helps stabilize blood glucose. However, consult your doctor before starting, especially if on insulin.' },
]
