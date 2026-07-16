'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pickaxe, Bitcoin, Radio, Settings, Menu, X, Rocket, Factory, TrendingUp, Globe, Image } from 'lucide-react'
import { useAppStore, type Nugget } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { NuggetTab } from '@/components/nugget/NuggetTab'
import { FactoryTab } from '@/components/nugget/FactoryTab'
import { VaultTab } from '@/components/nugget/VaultTab'
import { StealthTab } from '@/components/nugget/StealthTab'
import { PinterestTab } from '@/components/nugget/PinterestTab'
import { Badge } from '@/components/ui/badge'

interface TabConfig {
  id: string
  label: string
  icon: React.ReactNode
  desc: string
}

const TABS: TabConfig[] = [
  { id: 'nuggets', label: 'Nugget Mine', icon: <Pickaxe className="h-5 w-5" />, desc: 'Discover golden keywords' },
  { id: 'factory', label: 'Factory', icon: <Factory className="h-5 w-5" />, desc: 'Generate content assets' },
  { id: 'vault', label: 'Vault', icon: <Bitcoin className="h-5 w-5" />, desc: 'Track earnings' },
  { id: 'stealth', label: 'Stealth', icon: <Settings className="h-5 w-5" />, desc: 'Manage accounts' },
  { id: 'pinterest', label: 'Pinterest', icon: <Image className="h-5 w-5" />, desc: 'AI Pin Studio & Publisher' },
]

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

export default function TrafficMonsterDashboard() {
  const { nuggets, contents, earnings, accounts, currentTab, setCurrentTab, setNuggets, setContents, setEarnings, setAccounts, stats } = useAppStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      try {
        const [nRes, cRes, eRes, aRes] = await Promise.all([
          fetch('/api/nuggets'),
          fetch('/api/factory'),
          fetch('/api/earnings'),
          fetch('/api/accounts'),
        ])
        if (nRes.ok) setNuggets(await nRes.json())
        if (cRes.ok) setContents(await cRes.json())
        if (eRes.ok) { const d = await eRes.json(); setEarnings(d.earnings || []) }
        if (aRes.ok) setAccounts(await aRes.json())
      } catch {} finally { setLoading(false) }
    }
    init()
  }, [setNuggets, setContents, setEarnings, setAccounts])

  const handleTabChange = useCallback((tabId: string) => {
    setCurrentTab(tabId)
    setSidebarOpen(false)
  }, [setCurrentTab])

  const totalEarnings = earnings.reduce((s, e) => s + e.amount, 0)

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-[260px] flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-800">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-gray-100 tracking-tight">Traffic Monster</h1>
            <p className="text-[11px] text-gray-500 font-medium">Personal Profit Engine</p>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden ml-auto h-8 w-8 text-gray-400" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-4 py-4 border-b border-gray-800 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-800/50 rounded-lg p-2.5">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Potential</p>
              <p className="text-sm font-bold text-orange-400">${stats.totalMonthlyEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2.5">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Earned</p>
              <p className="text-sm font-bold text-green-400">${totalEarnings.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {TABS.map((tab) => {
            const isActive = currentTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-orange-500/10 text-orange-400 border-l-2 border-orange-500'
                    : 'text-gray-400 hover:bg-gray-800/80 hover:text-gray-200 border-l-2 border-transparent'
                }`}
              >
                <span className={isActive ? 'text-orange-400' : ''}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <p className="text-[10px] text-gray-600 text-center">© 2026 Traffic Monster v2.0</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center gap-4 px-4 md:px-6 py-4 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm flex-shrink-0">
          <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 text-gray-400" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3 min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-gray-100">
              {TABS.find((t) => t.id === currentTab)?.label ?? 'Dashboard'}
            </h2>
            <span className="text-xs text-gray-600 hidden sm:inline">
              {TABS.find((t) => t.id === currentTab)?.desc}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-gray-700 text-gray-400 text-xs hidden sm:inline-flex">
              <TrendingUp className="h-3 w-3 mr-1 text-orange-400" />
              ${stats.totalMonthlyEarnings.toLocaleString()}/mo potential
            </Badge>
            <Badge className="bg-green-500/10 text-green-400 border-0 text-xs">
              ${totalEarnings.toLocaleString()} earned
            </Badge>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8">
            {loading ? (
              <div className="flex items-center justify-center min-h-[40vh]">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                  <p className="text-sm text-gray-500">Loading profit engine...</p>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTab}
                  variants={pageVariants}
                  initial="initial" animate="animate" exit="exit"
                  transition={{ duration: 0.2 }}
                >
                  {currentTab === 'nuggets' && <NuggetTab />}
                  {currentTab === 'factory' && <FactoryTab />}
                  {currentTab === 'vault' && <VaultTab />}
                  {currentTab === 'stealth' && <StealthTab />}
                  {currentTab === 'pinterest' && <PinterestTab />}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
