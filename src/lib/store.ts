import { create } from 'zustand'

export interface Nugget {
  id: string
  keyword: string
  product: string
  niche: string
  searchVolume: number
  competition: number
  commission: number
  monthlyEarnings: number
  intent: string
  platform: string
  status: string
  source: string
  notes: string | null
  createdAt: string
  updatedAt: string
  contents?: ContentAsset[]
}

export interface ContentAsset {
  id: string
  nuggetId: string
  type: string
  title: string
  content: string
  description: string | null
  tags: string
  platform: string
  status: string
  mediaUrl: string | null
  linkUrl: string | null
  createdAt: string
}

export interface Earning {
  id: string
  source: string
  amount: number
  date: string
  note: string | null
  createdAt: string
}

export interface Account {
  id: string
  platform: string
  label: string
  username: string | null
  isActive: boolean
  proxy: string | null
  earnings: number
  createdAt: string
  updatedAt: string
}

interface AppState {
  nuggets: Nugget[]
  contents: ContentAsset[]
  earnings: Earning[]
  accounts: Account[]
  currentTab: string
  productInput: string
  isDiscovering: boolean
  stats: {
    totalMonthlyEarnings: number
    activeNuggets: number
    totalNuggets: number
    todayGrowth: number
    totalEarnings: number
  }
  setNuggets: (nuggets: Nugget[]) => void
  addNugget: (nugget: Nugget) => void
  removeNugget: (id: string) => void
  setContents: (contents: ContentAsset[]) => void
  addContent: (content: ContentAsset) => void
  removeContent: (id: string) => void
  setEarnings: (earnings: Earning[]) => void
  addEarning: (earning: Earning) => void
  setAccounts: (accounts: Account[]) => void
  addAccount: (account: Account) => void
  removeAccount: (id: string) => void
  setCurrentTab: (tab: string) => void
  setProductInput: (input: string) => void
  setIsDiscovering: (v: boolean) => void
  recalcStats: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  nuggets: [],
  contents: [],
  earnings: [],
  accounts: [],
  currentTab: 'nuggets',
  productInput: '',
  isDiscovering: false,
  stats: { totalMonthlyEarnings: 0, activeNuggets: 0, totalNuggets: 0, todayGrowth: 0, totalEarnings: 0 },

  setNuggets: (nuggets) => {
    set({ nuggets })
    get().recalcStats()
  },
  addNugget: (nugget) => {
    set((s) => ({ nuggets: [...s.nuggets, nugget] }))
    get().recalcStats()
  },
  removeNugget: (id) => {
    set((s) => ({ nuggets: s.nuggets.filter((n) => n.id !== id) }))
    get().recalcStats()
  },

  setContents: (contents) => set({ contents }),
  addContent: (content) => set((s) => ({ contents: [content, ...s.contents] })),
  removeContent: (id) => set((s) => ({ contents: s.contents.filter((c) => c.id !== id) })),

  setEarnings: (earnings) => set({ earnings }),
  addEarning: (earning) => set((s) => ({ earnings: [earning, ...s.earnings] })),

  setAccounts: (accounts) => set({ accounts }),
  addAccount: (account) => set((s) => ({ accounts: [...s.accounts, account] })),
  removeAccount: (id) => set((s) => ({ accounts: s.accounts.filter((a) => a.id !== id) })),

  setCurrentTab: (currentTab) => set({ currentTab }),
  setProductInput: (productInput) => set({ productInput }),
  setIsDiscovering: (isDiscovering) => set({ isDiscovering }),

  recalcStats: () => {
    const { nuggets } = get()
    const today = new Date().toDateString()
    set({
      stats: {
        totalMonthlyEarnings: nuggets.reduce((s, n) => s + n.monthlyEarnings, 0),
        activeNuggets: nuggets.filter((n) => n.status === 'active').length,
        totalNuggets: nuggets.length,
        todayGrowth: nuggets
          .filter((n) => new Date(n.createdAt).toDateString() === today)
          .reduce((s, n) => s + n.monthlyEarnings, 0),
        totalEarnings: 0,
      },
    })
  },
}))
