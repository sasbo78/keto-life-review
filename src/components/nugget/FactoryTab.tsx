'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Factory, Image, Video, FileText, Send, Loader2, Trash2, ExternalLink, Check, Globe, Mail } from 'lucide-react'
import { useAppStore, type Nugget, type ContentAsset } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

export function FactoryTab() {
  const { nuggets, contents, setContents, addContent, removeContent } = useAppStore()
  const [selectedNuggetId, setSelectedNuggetId] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [filter, setFilter] = useState('all')
  const [bloggerConnected, setBloggerConnected] = useState(false)
  const [gmailConnected, setGmailConnected] = useState(false)
  const [isPublishing, setIsPublishing] = useState<string | null>(null)
  const [isEmailPublishing, setIsEmailPublishing] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('blogger') === 'connected') {
      setBloggerConnected(true)
      toast.success('Connected to Blogger!')
      window.history.replaceState({}, '', '/')
    }
    if (params.get('gmail') === 'connected') {
      setGmailConnected(true)
      toast.success('Connected to Gmail!')
      window.history.replaceState({}, '', '/')
    }
  }, [])

  const activeNuggets = nuggets.filter((n) => n.status === 'active')

  useEffect(() => {
    async function fetch() {
      try {
        const res = await fetch('/api/factory')
        if (res.ok) {
          const data = await res.json()
          setContents(data)
        }
      } catch {}
    }
    fetch()
  }, [setContents])

  const handleGenerate = useCallback(async () => {
    if (!selectedNuggetId) return
    setIsGenerating(true)
    try {
      const res = await fetch('/api/factory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuggetId: selectedNuggetId }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.assets) data.assets.forEach((a: ContentAsset) => addContent(a))
        toast.success(`Generated ${data.count} assets!`)
      }
    } catch {
      toast.error('Generation failed')
    } finally {
      setIsGenerating(false)
    }
  }, [selectedNuggetId, addContent])

  const handleDelete = useCallback(async (id: string) => {
    try {
      await fetch(`/api/factory/${id}`, { method: 'DELETE' })
      removeContent(id)
      toast.success('Deleted')
    } catch {
      toast.error('Failed')
    }
  }, [removeContent])

  const handleEmailPublishAll = useCallback(async () => {
    setIsEmailPublishing(true)
    try {
      const res = await fetch('/api/publish-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`Published ${data.success} articles via email! ${data.failed > 0 ? `${data.failed} failed` : ''}`)
        if (data.errors?.length > 0) {
          data.errors.forEach((e: string) => toast.error(e))
        }
      } else {
        toast.error(data.error || 'Email publish failed')
      }
    } catch {
      toast.error('Email publish failed')
    } finally {
      setIsEmailPublishing(false)
    }
  }, [])

  const handlePublish = useCallback(async (id: string, title: string, content: string) => {
    if (!bloggerConnected) {
      toast.error('Connect to Blogger first')
      return
    }
    setIsPublishing(id)
    try {
      const res = await fetch('/api/blogger/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`Published! ${data.url}`)
      } else if (res.status === 401) {
        setBloggerConnected(false)
        toast.error('Session expired. Reconnect Blogger.')
      } else {
        toast.error(data.error || 'Publish failed')
      }
    } catch {
      toast.error('Publish failed')
    } finally {
      setIsPublishing(null)
    }
  }, [bloggerConnected])

  const filtered = filter === 'all' ? contents : contents.filter((c) => c.type === filter)

  const selectedNugget = nuggets.find((n) => n.id === selectedNuggetId)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            <Factory className="h-6 w-6 text-orange-400" />
            Content Factory
          </h2>
          <p className="text-sm text-gray-500 mt-1">Generate pins, TikToks, and blog posts from your nuggets</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={gmailConnected ? 'outline' : 'default'}
            size="sm"
            onClick={() => {
              if (!gmailConnected) window.location.href = '/api/gmail/auth'
            }}
            className={gmailConnected ? 'border-blue-700 text-blue-400' : 'bg-blue-600 hover:bg-blue-700 text-white'}
          >
            <Mail className="h-4 w-4 mr-1" />
            {gmailConnected ? 'Gmail ✓' : 'Connect Gmail'}
          </Button>
          <Button
            variant={bloggerConnected ? 'outline' : 'default'}
            size="sm"
            onClick={() => {
              if (!bloggerConnected) window.location.href = '/api/blogger/auth'
            }}
            className={bloggerConnected ? 'border-green-700 text-green-400' : 'bg-green-600 hover:bg-green-700 text-white'}
          >
            <Globe className="h-4 w-4 mr-1" />
            {bloggerConnected ? 'Blogger ✓' : 'Connect Blogger'}
          </Button>
        </div>
      </div>

      {/* Generator */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select value={selectedNuggetId} onValueChange={setSelectedNuggetId}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                <SelectValue placeholder="Select a nugget..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {activeNuggets.length === 0 && (
                  <div className="px-2 py-3 text-sm text-gray-500 text-center">No active nuggets. Find some in Nugget Mine first.</div>
                )}
                {activeNuggets.map((n) => (
                  <SelectItem key={n.id} value={n.id} className="text-gray-200">
                    {n.keyword} — ${n.monthlyEarnings}/mo
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleGenerate}
              disabled={!selectedNuggetId || isGenerating}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium"
            >
              {isGenerating ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</>
              ) : (
                <><Send className="h-4 w-4 mr-2" />Generate Assets</>
              )}
            </Button>

            <div className="text-sm text-gray-500 flex items-center px-2">
              {selectedNugget && (
                <span>5 Pins + 2 TikToks + 1 Blog Article</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Publish All */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
        {['all', 'pin', 'tiktok', 'blog'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className={filter === f ? 'bg-orange-500 text-white' : 'border-gray-700 text-gray-400'}
          >
            {f === 'all' ? 'All' : f === 'pin' ? 'Pins' : f === 'tiktok' ? 'TikToks' : 'Blogs'}
            {f !== 'all' && (
              <span className="ml-1.5 text-xs">
                ({contents.filter((c) => c.type === f).length})
              </span>
            )}
          </Button>
        ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleEmailPublishAll}
          disabled={!gmailConnected || isEmailPublishing}
          className="border-blue-700/50 text-blue-400 hover:bg-blue-500/10"
        >
          {isEmailPublishing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Mail className="h-4 w-4 mr-1" />}
          {isEmailPublishing ? 'Publishing...' : 'Publish All via Email'}
        </Button>
      </div>

      {/* Content Grid */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((asset) => (
            <ContentCard
              key={asset.id}
              asset={asset}
              onDelete={() => handleDelete(asset.id)}
              onPublish={() => handlePublish(asset.id, asset.title, asset.content)}
              isPublishing={isPublishing === asset.id}
              bloggerConnected={bloggerConnected}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Factory className="h-12 w-12 text-gray-700 mb-4" />
          <h3 className="text-lg font-medium text-gray-500">No content yet</h3>
          <p className="text-sm text-gray-600 mt-1">Select a nugget and generate your first batch of content assets.</p>
        </div>
      )}
    </div>
  )
}

function ContentCard({ asset, onDelete, onPublish, isPublishing, bloggerConnected }: { asset: ContentAsset; onDelete: () => void; onPublish: () => void; isPublishing: boolean; bloggerConnected: boolean }) {
  const Icon = asset.type === 'pin' ? Image : asset.type === 'tiktok' ? Video : FileText
  const color = asset.type === 'pin' ? 'text-red-400 bg-red-500/10' : asset.type === 'tiktok' ? 'text-purple-400 bg-purple-500/10' : 'text-blue-400 bg-blue-500/10'

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900/60 border border-gray-800 hover:border-gray-700 rounded-xl p-4 group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-200 truncate">{asset.title}</h4>
              <Badge className="text-[10px] bg-gray-800 text-gray-400 border-0">{asset.platform}</Badge>
              <Badge className={`text-[10px] ${asset.status === 'draft' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}>
                {asset.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 line-clamp-2">{asset.content}</p>
            {asset.description && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-1">{asset.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {asset.type === 'blog' && (
            <Button
              variant="outline"
              size="sm"
              onClick={onPublish}
              disabled={isPublishing || !bloggerConnected}
              className="text-green-400 border-green-700/50 hover:bg-green-500/10 h-8 text-xs"
            >
              {isPublishing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Globe className="h-3 w-3 mr-1" />}
              {isPublishing ? '' : 'Publish'}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-gray-600 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 h-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
