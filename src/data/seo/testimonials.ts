export interface Testimonial {
  name: string
  age: number | string
  location: string
  timeFrame: string
  result: string
  quote: string
  audience: string
}

export const TESTIMONIALS: Testimonial[] = [
  { name: 'Sarah M.', age: 47, location: 'Austin, TX', timeFrame: '6 weeks', result: 'Lost 18 lbs', quote: 'I tried every diet. Keto coffee was the first thing that actually controlled my appetite. The weight just started coming off.', audience: 'women-over-40' },
  { name: 'James R.', age: 52, location: 'Denver, CO', timeFrame: '3 months', result: 'Lost 32 lbs, off BP meds', quote: 'My doctor was shocked. After 3 months of keto coffee, my blood pressure normalized and I lost 32 pounds. No more medication.', audience: 'men-over-40' },
  { name: 'Maria G.', age: 34, location: 'Miami, FL', timeFrame: '4 weeks', result: 'Lost 12 lbs, more energy', quote: 'With two kids under 5, I had zero energy. Keto coffee in the morning changed everything. I actually have energy to play with them now.', audience: 'busy-moms' },
  { name: 'David K.', age: 28, location: 'Seattle, WA', timeFrame: '8 weeks', result: 'Lost 15 lbs, better focus', quote: 'I was skeptical about keto. But the mental clarity from keto coffee is unreal. I get more done before 10am than I used to all day.', audience: 'beginners' },
  { name: 'Linda P.', age: 58, location: 'Phoenix, AZ', timeFrame: '12 weeks', result: 'Lost 25 lbs, no more hot flashes', quote: 'Menopause was miserable until I started keto coffee. The hot flashes reduced dramatically and the weight finally started moving.', audience: 'menopause' },
  { name: 'Tom S.', age: 45, location: 'Chicago, IL', timeFrame: '30 days', result: 'Lost 10 lbs, better blood sugar', quote: 'As a type 2 diabetic, my morning blood sugar dropped from 140 to 105 after a month of keto coffee. My endocrinologist is thrilled.', audience: 'diabetics' },
  { name: 'Rachel N.', age: 39, location: 'Portland, OR', timeFrame: '6 weeks', result: 'Lost 14 lbs, mental clarity', quote: 'The brain fog lifted within 3 days. I finally have the mental sharpness I need for my software engineering job.', audience: 'women-over-40' },
  { name: 'Mike D.', age: 62, location: 'Tampa, FL', timeFrame: '2 months', result: 'Lost 20 lbs, better mobility', quote: 'At 62, I thought my best years were behind me. Keto coffee gave me my energy back. I walk 3 miles daily now.', audience: 'seniors' },
  { name: 'Jennifer W.', age: 43, location: 'Charlotte, NC', timeFrame: '5 weeks', result: 'Lost 16 lbs', quote: 'Intermittent fasting was so hard until I discovered keto coffee. It kills my hunger completely during the 16-hour fast.', audience: 'intermittent-fasting' },
  { name: 'Carlos M.', age: 31, location: 'Los Angeles, CA', timeFrame: '3 months', result: 'Lost 25 lbs, 6-pack visible', quote: 'I was stuck at 18% body fat for a year. Swapped my breakfast for keto coffee and hit 10% in 12 weeks.', audience: 'fitness-enthusiasts' },
]
