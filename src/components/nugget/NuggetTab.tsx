'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, Sparkles, Plus, TrendingUp, Target, DollarSign, Hash } from 'lucide-react'
import { useAppStore, type Nugget } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { formatCurrency, formatNumber } from '@/lib/utils'

export function NuggetTab() {
  const { nuggets, productInput, setProductInput, isDiscovering, setIsDiscovering, addNugget, removeNugget, stats } = useAppStore()
  const [niche, setNiche] = useState('')
  const [discovered, setDiscovered] = useState<Nugget[]>([])
  const [showManualForm, setShowManualForm] = useState(false)
  const [manual, setManual] = useState({ keyword: '', product: '', searchVolume: '', commission: '', platform: 'pinterest' })

  const handleDiscover = useCallback(async () => {
    if (!productInput.trim() || !niche.trim()) {
      toast.error('Enter a product and niche first')
      return
    }
    setIsDiscovering(true)
    setDiscovered([])
    try {
      const res = await fetch('/api/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: productInput.trim(), niche: niche.trim() }),
      })
      if (res.ok) {
        const data = await res.json()
        setDiscovered(data.nuggets || [])
        if (data.nuggets?.length === 0) toast('No nuggets found, try a different product')
        else toast.success(`Found ${data.count} golden nuggets!`)
      }
    } catch {
      toast.error('Discovery failed')
    } finally {
      setIsDiscovering(false)
    }
  }, [productInput, niche, setIsDiscovering])

  const handleSaveNugget = useCallback(
    async (n: typeof discovered[0]) => {
      try {
        const res = await fetch('/api/nuggets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(n),
        })
        if (res.ok) {
          const saved: Nugget = await res.json()
          addNugget(saved)
          toast.success('Nugget saved!')
        }
      } catch {
        toast.error('Failed to save')
      }
    },
    [addNugget]
  )

  const handleSaveAll = useCallback(async () => {
    let saved = 0
    for (const n of discovered) {
      try {
        const res = await fetch('/api/nuggets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(n),
        })
        if (res.ok) {
          const data: Nugget = await res.json()
          addNugget(data)
          saved++
        }
      } catch {
        // skip
      }
    }
    setDiscovered([])
    toast.success(`Saved ${saved} nuggets!`)
  }, [discovered, addNugget])

  const handleDeleteNugget = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/nuggets/${id}`, { method: 'DELETE' })
        removeNugget(id)
        toast.success('Nugget removed')
      } catch {
        toast.error('Failed to delete')
      }
    },
    [removeNugget]
  )

  const handleManualAdd = useCallback(async () => {
    if (!manual.keyword.trim() || !manual.product.trim()) return
    try {
      const res = await fetch('/api/nuggets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: manual.keyword.trim(),
          product: manual.product.trim(),
          niche: niche || 'general',
          searchVolume: parseInt(manual.searchVolume) || 0,
          commission: parseFloat(manual.commission) || 0,
          platform: manual.platform,
          source: 'manual',
        }),
      })
      if (res.ok) {
        const data: Nugget = await res.json()
        addNugget(data)
        setManual({ keyword: '', product: '', searchVolume: '', commission: '', platform: 'pinterest' })
        setShowManualForm(false)
        toast.success('Nugget added!')
      }
    } catch {
      toast.error('Failed to add')
    }
  }, [manual, niche, addNugget])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-orange-400" />
            Nugget Mine
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Discover golden keywords with high buyer intent & low competition
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowManualForm(!showManualForm)} className="border-gray-700 text-gray-300">
          <Plus className="h-4 w-4 mr-1" /> Add Nugget
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<DollarSign className="h-4 w-4 text-orange-400" />} label="Potential Monthly" value={`$${stats.totalMonthlyEarnings.toLocaleString()}`} />
        <StatCard icon={<Target className="h-4 w-4 text-green-400" />} label="Active Nuggets" value={String(stats.activeNuggets)} />
        <StatCard icon={<Hash className="h-4 w-4 text-blue-400" />} label="Total Nuggets" value={String(stats.totalNuggets)} />
        <StatCard icon={<TrendingUp className="h-4 w-4 text-purple-400" />} label="Today's Growth" value={`+$${stats.todayGrowth}`} />
      </div>

      {/* Search / Discovery */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-5">
          <Label className="text-gray-400 text-sm mb-3 block">Discover Golden Keywords</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="Product name (e.g., keto coffee)"
              value={productInput}
              onChange={(e) => setProductInput(e.target.value)}
              className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-600"
            />
            <Input
              placeholder="Niche (e.g., weight loss)"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-600"
            />
            <Button
              onClick={handleDiscover}
              disabled={isDiscovering || !productInput.trim() || !niche.trim()}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium"
            >
              {isDiscovering ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Discovering...</>
              ) : (
                <><Search className="h-4 w-4 mr-2" />Discover Nuggets</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Manual Add Form */}
      {showManualForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
          <h4 className="text-sm font-semibold text-gray-300">Manual Nugget Entry</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Input placeholder="Keyword" value={manual.keyword} onChange={(e) => setManual({ ...manual, keyword: e.target.value })} className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-600" />
            <Input placeholder="Product" value={manual.product} onChange={(e) => setManual({ ...manual, product: e.target.value })} className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-600" />
            <Input placeholder="Search volume" type="number" value={manual.searchVolume} onChange={(e) => setManual({ ...manual, searchVolume: e.target.value })} className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-600" />
            <Input placeholder="Commission $" type="number" step="0.01" value={manual.commission} onChange={(e) => setManual({ ...manual, commission: e.target.value })} className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-600" />
            <Button onClick={handleManualAdd} className="bg-green-600 hover:bg-green-700 text-white">Save Nugget</Button>
          </div>
        </motion.div>
      )}

      {/* Discovered Results */}
      {discovered.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Discovered Nuggets</h3>
            <Button size="sm" onClick={handleSaveAll} className="bg-orange-500 hover:bg-orange-600 text-white text-xs h-8">
              <Plus className="h-3 w-3 mr-1" /> Save All ({discovered.length})
            </Button>
          </div>
          <div className="space-y-2">
            {discovered.map((n, i) => (
              <DiscoveredCard key={`${n.keyword}-${i}`} nugget={n} index={i} onSave={() => handleSaveNugget(n)} />
            ))}
          </div>
        </div>
      )}

      {/* Saved Nuggets */}
      {nuggets.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Saved Nuggets ({nuggets.length})</h3>
          <div className="space-y-2">
            {nuggets.map((n) => (
              <SavedNuggetCard key={n.id} nugget={n} onDelete={() => handleDeleteNugget(n.id)} />
            ))}
          </div>
        </div>
      )}

      {nuggets.length === 0 && discovered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="h-12 w-12 text-gray-700 mb-4" />
          <h3 className="text-lg font-medium text-gray-500">No nuggets yet</h3>
          <p className="text-sm text-gray-600 mt-1 max-w-md">Enter a product and niche above, then click "Discover Nuggets" to find golden keyword opportunities.</p>
        </div>
      )}
    </div>
  )
}

/* ─── Sub-components ─── */

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className="text-xl font-bold text-gray-100">{value}</p>
    </div>
  )
}

function DiscoveredCard({ nugget, index, onSave }: { nugget: any; index: number; onSave: () => void }) {
  const compColor = nugget.competition < 30 ? 'text-green-400' : nugget.competition < 60 ? 'text-yellow-400' : 'text-red-400'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-gray-900/80 border border-gray-800 hover:border-orange-500/30 rounded-xl p-4 flex items-center justify-between transition-all"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-gray-600">#{index + 1}</span>
          <h4 className="font-semibold text-gray-200 truncate">{nugget.keyword}</h4>
          <Badge variant="outline" className="text-[10px] border-gray-700 text-gray-500">{nugget.platform}</Badge>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>📊 {formatNumber(nugget.searchVolume)}/mo</span>
          <span className={compColor}>⚔️ {nugget.competition}% comp.</span>
          <span>💰 ${nugget.commission}/sale</span>
          <span className="text-orange-400 font-semibold">📈 ~${nugget.monthlyEarnings}/mo</span>
        </div>
      </div>
      <Button size="sm" onClick={onSave} className="ml-4 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 flex-shrink-0 h-8">
        <Plus className="h-3 w-3 mr-1" /> Save
      </Button>
    </motion.div>
  )
}

function SavedNuggetCard({ nugget, onDelete }: { nugget: Nugget; onDelete: () => void }) {
  const compColor = nugget.competition < 30 ? 'text-green-400' : nugget.competition < 60 ? 'text-yellow-400' : 'text-red-400'
  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 flex items-center justify-between group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <h4 className="font-semibold text-gray-200 truncate">{nugget.keyword}</h4>
          <Badge variant="outline" className="text-[10px] border-gray-700 text-gray-500">{nugget.platform}</Badge>
          <Badge className={`text-[10px] ${nugget.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
            {nugget.status}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>{nugget.product}</span>
          <span>📊 {formatNumber(nugget.searchVolume)}/mo</span>
          <span className={compColor}>⚔️ {nugget.competition}%</span>
          <span>💰 ${nugget.commission}/sale</span>
          <span className="text-orange-400 font-semibold">📈 ${nugget.monthlyEarnings}/mo</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="ml-4 text-gray-600 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity h-8"
      >
        ✕
      </Button>
    </div>
  )
}
