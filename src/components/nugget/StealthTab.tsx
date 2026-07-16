'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Globe, Plus, Trash2, Power, Eye, EyeOff, Monitor } from 'lucide-react'
import { useAppStore, type Account } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

export function StealthTab() {
  const { accounts, setAccounts, addAccount, removeAccount, stats } = useAppStore()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ platform: 'pinterest', label: '', username: '', proxy: '' })

  useEffect(() => {
    async function fetch() {
      try {
        const res = await fetch('/api/accounts')
        if (res.ok) setAccounts(await res.json())
      } catch {}
    }
    fetch()
  }, [setAccounts])

  const handleAdd = useCallback(async () => {
    if (!form.label.trim()) return
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const data: Account = await res.json()
        addAccount(data)
        setForm({ platform: 'pinterest', label: '', username: '', proxy: '' })
        toast.success('Account added!')
      }
    } catch {
      toast.error('Failed')
    }
  }, [form, addAccount])

  const handleDelete = useCallback(async (id: string) => {
    try {
      await fetch('/api/accounts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      removeAccount(id)
    } catch {
      toast.error('Failed')
    }
  }, [removeAccount])

  const activeCount = accounts.filter((a) => a.isActive).length
  const totalEarnings = accounts.reduce((s, a) => s + a.earnings, 0)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            <Settings className="h-6 w-6 text-orange-400" />
            Stealth Operations
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage multi-accounts, proxies, and operational security</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)} className="border-gray-700 text-gray-300">
          <Plus className="h-4 w-4 mr-1" /> Add Account
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StatCard icon={<Globe className="h-4 w-4 text-blue-400" />} label="Total Accounts" value={String(accounts.length)} />
        <StatCard icon={<Power className="h-4 w-4 text-green-400" />} label="Active" value={String(activeCount)} />
        <StatCard icon={<Monitor className="h-4 w-4 text-orange-400" />} label="Total Earnings" value={`$${totalEarnings.toLocaleString()}`} />
      </div>

      {/* Add Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v })}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {['pinterest', 'tiktok', 'youtube', 'twitter'].map((s) => (
                  <SelectItem key={s} value={s} className="text-gray-200">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="Label (e.g. Account #1)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-600" />
            <Input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-600" />
            <Input placeholder="Proxy (optional)" value={form.proxy} onChange={(e) => setForm({ ...form, proxy: e.target.value })} className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-600" />
          </div>
          <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700 text-white w-full">
            <Plus className="h-4 w-4 mr-1" /> Save Account
          </Button>
        </motion.div>
      )}

      {/* Accounts List */}
      {accounts.length > 0 ? (
        <div className="space-y-2">
          {accounts.map((a) => (
            <div key={a.id} className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${a.isActive ? 'bg-green-500/10' : 'bg-gray-800'}`}>
                  <Globe className={`h-5 w-5 ${a.isActive ? 'text-green-400' : 'text-gray-600'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-200">{a.label}</h4>
                    <Badge className="text-[10px] bg-gray-800 text-gray-400 border-0">{a.platform}</Badge>
                    <Badge className={`text-[10px] ${a.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                      {a.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    {a.username || 'No username'} {a.proxy ? '• Proxied' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-green-400">${a.earnings}</span>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(a.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 h-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Settings className="h-12 w-12 text-gray-700 mb-4" />
          <h3 className="text-lg font-medium text-gray-500">No accounts yet</h3>
          <p className="text-sm text-gray-600 mt-1">Add your first platform account to start managing your operations.</p>
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
