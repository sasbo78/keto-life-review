export interface Audience {
  id: string
  label: string
  description: string
  painPoints: string[]
  goals: string[]
  slug: string
}

export const AUDIENCES: Audience[] = [
  { id: 'women-over-40', label: 'Women Over 40', slug: 'women-over-40', description: 'Women navigating hormonal changes and metabolic slowdown after 40', painPoints: ['Slower metabolism', 'Hormonal weight gain', 'Low energy', 'Joint discomfort'], goals: ['Sustainable weight loss', 'Hormone balance', 'All-day energy', 'Healthy aging'] },
  { id: 'beginners', label: 'Beginners', slug: 'beginners', description: 'People new to keto diet and keto coffee', painPoints: ['Confused where to start', 'Keto flu concerns', 'Taste adaptation', 'Budget'], goals: ['Easy transition', 'Simple recipes', 'Affordable options', 'Quick results'] },
  { id: 'busy-moms', label: 'Busy Moms', slug: 'busy-moms', description: 'Mothers juggling family, work, and health goals', painPoints: ['No time for yourself', 'Energy crashes', 'Postpartum weight', 'Stress eating'], goals: ['Quick breakfast', 'Sustained energy', 'Weight management', 'Mental clarity'] },
  { id: 'men-over-40', label: 'Men Over 40', slug: 'men-over-40', description: 'Men dealing with age-related metabolic decline', painPoints: ['Declining testosterone', 'Belly fat', 'Low energy', 'Brain fog'], goals: ['Lean muscle', 'Fat loss', 'Mental sharpness', 'Vitality'] },
  { id: 'intermittent-fasting', label: 'Intermittent Fasters', slug: 'intermittent-fasting', description: 'People practicing IF who need clean fasting', painPoints: ['Hunger during fast', 'Energy dips', 'Breaking fast correctly', 'Compliance'], goals: ['Extended fasting', 'Appetite control', 'Autophagy support', 'Clean fast'] },
  { id: 'diabetics', label: 'Diabetics & Pre-diabetics', slug: 'diabetics', description: 'People managing blood sugar and insulin sensitivity', painPoints: ['Blood sugar spikes', 'Sugar cravings', 'Weight management', 'Medication interaction'], goals: ['Stable glucose', 'Reduced cravings', 'Weight loss', 'Better A1C'] },
  { id: 'vegans', label: 'Vegans on Keto', slug: 'vegans', description: 'Plant-based individuals following a ketogenic lifestyle', painPoints: ['Limited options', 'Protein intake', 'Dairy-free needs', 'Flavor'], goals: ['Plant-based keto', 'Clean ingredients', 'Good macros', 'Ethical choices'] },
  { id: 'seniors', label: 'Seniors (60+)', slug: 'seniors', description: 'Older adults seeking healthy aging solutions', painPoints: ['Joint pain', 'Cognitive decline', 'Low energy', 'Digestive issues'], goals: ['Brain health', 'Mobility', 'Quality of life', 'Simple routine'] },
  { id: 'fitness-enthusiasts', label: 'Fitness Enthusiasts', slug: 'fitness', description: 'Active individuals optimizing performance on keto', painPoints: ['Workout performance', 'Muscle recovery', 'Electrolyte balance', 'Protein timing'], goals: ['Endurance', 'Muscle preservation', 'Fat adaptation', 'Recovery'] },
  { id: 'menopause', label: 'Menopausal Women', slug: 'menopause', description: 'Women in menopause managing weight and symptoms', painPoints: ['Hot flashes', 'Weight gain', 'Mood swings', 'Sleep issues'], goals: ['Symptom relief', 'Weight stability', 'Mood balance', 'Better sleep'] },
]
