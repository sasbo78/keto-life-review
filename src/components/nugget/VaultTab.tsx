'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bitcoin, TrendingUp, DollarSign, CalendarDays, Plus, Trash2 } from 'lucide-react'
import { useAppStore, type Earning } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

export function VaultTab() {
  const { earnings, setEarnings, addEarning, stats } = useAppStore()
  const [showForm, setShowForm] = useState(false)
  const [source, setSource] = useState('pinterest')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    async function fetch() {
      try {
        const res = await fetch('/api/earnings')
        if (res.ok) {
          const data = await res.json()
          setEarnings(data.earnings || [])
        }
      } catch {}
    }
    fetch()
  }, [setEarnings])

  const handleAdd = useCallback(async () => {
    if (!amount) return
    try {
      const res = await fetch('/api/earnings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, amount: parseFloat(amount), note }),
      })
      if (res.ok) {
        const data: Earning = await res.json()
        addEarning(data)
        setAmount('')
        setNote('')
        toast.success(`$${amount} added!`)
      }
    } catch {
      toast.error('Failed')
    }
  }, [source, amount, note, addEarning])

  const total = earnings.reduce((s, e) => s + e.amount, 0)
  const thisMonth = earnings.filter((e) => new Date(e.date).getMonth() === new Date().getMonth()).reduce((s, e) => s + e.amount, 0)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            <Bitcoin className="h-6 w-6 text-orange-400" />
            Profit Vault
          </h2>
          <p className="text-sm text-gray-500 mt-1">Track your actual earnings from all platforms</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)} className="border-gray-700 text-gray-300">
          <Plus className="h-4 w-4 mr-1" /> Add Earning
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StatCard icon={<DollarSign className="h-4 w-4 text-green-400" />} label="Total Earned" value={`$${total.toLocaleString()}`} />
        <StatCard icon={<TrendingUp className="h-4 w-4 text-blue-400" />} label="This Month" value={`$${thisMonth.toLocaleString()}`} />
        <StatCard icon={<Bitcoin className="h-4 w-4 text-orange-400" />} label="Potential Monthly" value={`$${stats.totalMonthlyEarnings.toLocaleString()}`} />
      </div>

      {/* Add Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {['pinterest', 'tiktok', 'blog', 'youtube', 'other'].map((s) => (
                  <SelectItem key={s} value={s} className="text-gray-200">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Amount $"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-600"
            />
            <Input
              placeholder="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-600"
            />
            <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </motion.div>
      )}

      {/* Earnings List */}
      {earnings.length > 0 ? (
        <div className="space-y-1">
          {earnings.map((e) => (
            <div key={e.id} className="bg-gray-900/40 border border-gray-800 rounded-lg px-4 py-3 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">{e.source} <span className="text-gray-500 font-normal">{e.note}</span></p>
                  <p className="text-xs text-gray-600">{new Date(e.date).toLocaleDateString()}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-green-400">+${e.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Bitcoin className="h-12 w-12 text-gray-700 mb-4" />
          <h3 className="text-lg font-medium text-gray-500">No earnings yet</h3>
          <p className="text-sm text-gray-600 mt-1">Add your first earning to start tracking your profit.</p>
        </div>
      )}
    </div>
  )
}

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
