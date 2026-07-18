export interface Ingredient {
  id: string
  name: string
  slug: string
  benefits: string[]
  description: string
  scientificEvidence: string
  dosage: string
}

export const INGREDIENTS: Ingredient[] = [
  { id: 'mct-oil', name: 'MCT Oil', slug: 'mct-oil', benefits: ['Ketone production', 'Energy boost', 'Appetite control', 'Brain function'], description: 'Medium-chain triglycerides that convert directly into ketones for instant energy.', scientificEvidence: 'Multiple clinical trials show MCTs increase ketone production 3x more than LCTs.', dosage: '1-2 tablespoons daily' },
  { id: 'collagen-peptides', name: 'Collagen Peptides', slug: 'collagen', benefits: ['Joint health', 'Skin elasticity', 'Gut health', 'Protein intake'], description: 'Hydrolyzed collagen protein that supports connective tissue and digestion.', scientificEvidence: 'Studies show 10g daily improves skin hydration by 28% and reduces joint pain.', dosage: '10-20g daily' },
  { id: 'grass-fed-butter', name: 'Grass-Fed Butter', slug: 'grass-fed-butter', benefits: ['Healthy fats', 'Vitamin K2', 'Butyrate for gut', 'Creamy texture'], description: 'Butter from grass-fed cows rich in CLA and fat-soluble vitamins.', scientificEvidence: 'Grass-fed butter has 5x more CLA than grain-fed, linked to better body composition.', dosage: '1-2 tablespoons' },
  { id: 'coconut-oil', name: 'Coconut Oil', slug: 'coconut-oil', benefits: ['MCTs', 'Antimicrobial', 'Energy', 'Affordable'], description: 'Natural source of MCTs with lauric acid for immune support.', scientificEvidence: 'Coconut oil MCTs increase 24h energy expenditure by 5%.', dosage: '1-2 tablespoons' },
  { id: 'cinnamon', name: 'Cinnamon', slug: 'cinnamon', benefits: ['Blood sugar control', 'Antioxidants', 'Flavor', 'Anti-inflammatory'], description: 'Warming spice that helps stabilize blood sugar and adds flavor without calories.', scientificEvidence: 'Meta-analysis shows 1-6g cinnamon reduces fasting blood sugar by 10-29%.', dosage: '1/2-1 teaspoon' },
  { id: 'ashwagandha', name: 'Ashwagandha', slug: 'ashwagandha', benefits: ['Stress reduction', 'Cortisol control', 'Energy', 'Focus'], description: 'Adaptogenic herb that helps manage cortisol and stress response.', scientificEvidence: 'Clinical trials show 300-600mg reduces cortisol by 23-30%.', dosage: '300-600mg' },
  { id: 'electrolytes', name: 'Electrolytes (Sodium, Magnesium, Potassium)', slug: 'electrolytes', benefits: ['Hydration', 'Muscle function', 'Keto flu prevention', 'Energy'], description: 'Essential minerals that become critical when on a ketogenic diet.', scientificEvidence: 'Low-carb diets increase electrolyte excretion. Supplementing reduces keto flu by 50%.', dosage: '3000mg sodium, 400mg magnesium, 3000mg potassium' },
]
