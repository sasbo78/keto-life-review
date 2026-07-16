'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Image, Loader2, Check, Globe, Sparkles, BarChart3, Send, ExternalLink, Trash2, Layout, Clock } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

export function PinterestTab() {
  const [pinterestConnected, setPinterestConnected] = useState(false)
  const [boards, setBoards] = useState<any[]>([])
  const [selectedBoard, setSelectedBoard] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [generatedPins, setGeneratedPins] = useState<any[]>([])
  const [boardName, setBoardName] = useState('')
  const [isCreatingBoard, setIsCreatingBoard] = useState(false)
  const [showCreateBoard, setShowCreateBoard] = useState(false)
  const [analytics, setAnalytics] = useState<any>(null)
  const [loadingBoards, setLoadingBoards] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('pinterest') === 'connected') {
      setPinterestConnected(true)
      toast.success('Connected to Pinterest!')
      window.history.replaceState({}, '', '/')
    }
    checkConnection()
  }, [])

  async function checkConnection() {
    try {
      const res = await fetch('/api/pinterest/boards')
      setPinterestConnected(res.ok)
      if (res.ok) {
        const data = await res.json()
        setBoards(data.items || [])
      }
    } catch {}
  }

  async function loadBoards() {
    setLoadingBoards(true)
    try {
      const res = await fetch('/api/pinterest/boards')
      if (res.ok) {
        const data = await res.json()
        setBoards(data.items || [])
      }
    } catch {} finally {
      setLoadingBoards(false)
    }
  }

  async function handleCreateBoard() {
    if (!boardName.trim()) return
    setIsCreatingBoard(true)
    try {
      const res = await fetch('/api/pinterest/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: boardName.trim(), description: 'Keto Coffee reviews, weight loss tips, and Amazon deals' }),
      })
      if (res.ok) {
        toast.success(`Board "${boardName}" created!`)
        setBoardName('')
        setShowCreateBoard(false)
        loadBoards()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to create board')
      }
    } catch {
      toast.error('Failed to create board')
    } finally {
      setIsCreatingBoard(false)
    }
  }

  async function handleGeneratePins() {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/pin-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (res.ok) {
        const data = await res.json()
        setGeneratedPins(data.pins || [])
        toast.success(`Generated ${data.pins?.length || 0} pins!`)
      } else {
        const data = await res.json()
        toast.error(data.error || 'Generation failed')
      }
    } catch {
      toast.error('Generation failed')
    } finally {
      setIsGenerating(false)
    }
  }

  async function handlePublishAll() {
    if (!selectedBoard) {
      toast.error('Select a board first')
      return
    }
    setIsPublishing(true)
    let count = 0
    for (const pin of generatedPins) {
      try {
        const res = await fetch('/api/pinterest/pins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            board_id: selectedBoard,
            title: pin.title.substring(0, 100),
            description: `${pin.title} - Check the best keto coffee deals on Amazon! #keto #weightloss #ketocoffee`,
            image_url: `file://${pin.imagePath}`,
          }),
        })
        if (res.ok) count++
      } catch {}
    }
    toast.success(`Published ${count}/${generatedPins.length} pins!`)
    setIsPublishing(false)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            <Image className="h-6 w-6 text-red-400" />
            AI Pin Studio
          </h2>
          <p className="text-sm text-gray-500 mt-1">Generate stunning pins and publish to Pinterest</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/api/pinterest/auth'}
            className={pinterestConnected ? 'border-red-700 text-red-400' : 'bg-red-600 hover:bg-red-700 text-white'}
          >
            <Image className="h-4 w-4 mr-1" />
            {pinterestConnected ? 'Pinterest ✓' : 'Connect Pinterest'}
          </Button>
        </div>
      </div>

      {!pinterestConnected && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-8 text-center">
            <Image className="h-12 w-12 text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">Connect Pinterest</h3>
            <p className="text-sm text-gray-500 mb-4">To use the AI Pin Studio, connect your Pinterest Business account.</p>
            <p className="text-xs text-gray-600 mb-4">Don't have a Pinterest Business account? <a href="https://business.pinterest.com" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">Create one free</a></p>
            <Button onClick={() => window.location.href = '/api/pinterest/auth'} className="bg-red-600 hover:bg-red-700 text-white">
              <Globe className="h-4 w-4 mr-2" /> Connect Pinterest Business
            </Button>
          </CardContent>
        </Card>
      )}

      {pinterestConnected && (
        <>
          {/* Boards Section */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Layout className="h-4 w-4 text-red-400" /> Your Boards
                </h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={loadBoards} disabled={loadingBoards} className="border-gray-700 text-gray-400 h-8 text-xs">
                    {loadingBoards ? <Loader2 className="h-3 w-3 animate-spin" /> : null} Refresh
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowCreateBoard(!showCreateBoard)} className="border-gray-700 text-gray-400 h-8 text-xs">
                    + New Board
                  </Button>
                </div>
              </div>

              {showCreateBoard && (
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={boardName}
                    onChange={(e) => setBoardName(e.target.value)}
                    placeholder="Board name (e.g. Keto Coffee Recipes)"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-red-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()}
                  />
                  <Button onClick={handleCreateBoard} disabled={isCreatingBoard || !boardName.trim()} className="bg-red-600 hover:bg-red-700 text-white h-9 text-xs">
                    {isCreatingBoard ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Create'}
                  </Button>
                </div>
              )}

              {boards.length === 0 ? (
                <p className="text-sm text-gray-600 text-center py-4">No boards yet. Create one or refresh.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {boards.slice(0, 8).map((board: any) => (
                    <button
                      key={board.id}
                      onClick={() => setSelectedBoard(board.id)}
                      className={`p-3 rounded-lg border text-left text-sm transition-all ${
                        selectedBoard === board.id
                          ? 'border-red-500 bg-red-500/10'
                          : 'border-gray-800 bg-gray-800/50 hover:border-gray-700'
                      }`}
                    >
                      <p className="font-medium text-gray-200 truncate">{board.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{board.pin_count || 0} pins</p>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pin Generator */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-400" /> AI Pin Generator
                </h3>
                <Button onClick={handleGeneratePins} disabled={isGenerating} className="bg-gradient-to-r from-red-500 to-orange-500 text-white h-9 text-xs">
                  {isGenerating ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1" />}
                  {isGenerating ? 'Generating...' : 'Generate Pins from Articles'}
                </Button>
              </div>
              <p className="text-xs text-gray-600">Creates 9 stunning pins with Unsplash images + AI titles + Amazon CTA</p>
            </CardContent>
          </Card>

          {/* Generated Pins Preview */}
          {generatedPins.length > 0 && (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" /> Generated Pins ({generatedPins.length})
                  </h3>
                  <div className="flex gap-2">
                    {selectedBoard && (
                      <Button onClick={handlePublishAll} disabled={isPublishing} className="bg-red-600 hover:bg-red-700 text-white h-9 text-xs">
                        {isPublishing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Send className="h-4 w-4 mr-1" />}
                        {isPublishing ? 'Publishing...' : `Publish to Board`}
                      </Button>
                    )}
                  </div>
                </div>

                {!selectedBoard && (
                  <p className="text-sm text-yellow-400/70 mb-3">Select a board above to enable publishing</p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {generatedPins.map((pin: any, i: number) => (
                    <div key={i} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                      <img
                        src={`file://${pin.imagePath}`}
                        alt={pin.title}
                        className="w-full aspect-[2/3] object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x600?text=Pin+Image' }}
                      />
                      <div className="p-2">
                        <p className="text-xs text-gray-300 truncate">{pin.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analytics placeholder */}
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-gray-300">Performance</h3>
              </div>
              <p className="text-xs text-gray-600">Connect Pinterest and publish pins to see analytics here.</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
