"use client"

import { useState } from "react"
import { ArrowLeft, Search, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAcademicContext } from "@/contexts/academic-context"
import { useResources } from "@/hooks/use-resources"
import { ResourceCard } from "@/components/cards/resource-card"
import { CardSkeleton } from "@/components/cards/card-skeleton"
import { ErrorCard } from "@/components/cards/error-card"
import Link from "next/link"

export default function PeerNotesPage() {
  const { academicInfo, isContextSet } = useAcademicContext()
  const [searchQuery, setSearchQuery] = useState("")

  const {
    data: peerNotesData,
    isLoading,
    error,
    refetch,
  } = useResources("peer_notes", {
    year: academicInfo.year,
    semester: Number.parseInt(academicInfo.semester),
    branch: academicInfo.branch,
  })

  const filteredPeerNotes = peerNotesData
    ? peerNotesData.filter(
        (note) =>
          note.subject_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.uploader_name?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  const handleRateNote = (resourceId: string, rating: number) => {
    // TODO: Implement rating functionality
    console.log(`Rating ${resourceId} with ${rating} stars`)
  }

  if (!isContextSet) {
    return (
      <div className="min-h-screen bg-white font-mono flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-black mb-4">SETUP REQUIRED</h1>
          <p className="font-bold mb-6">Please set your academic context first</p>
          <Link href="/dashboard">
            <Button className="bg-blue-600 text-white border-4 border-black font-bold">GO TO DASHBOARD</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-mono">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b-8 border-black bg-white">
        <div className="container flex h-20 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Link href="/resources">
              <Button variant="outline" className="border-4 border-black font-bold">
                <ArrowLeft className="h-4 w-4 mr-2 " />
                RESOURCES
              </Button>
            </Link>
            <div className="flex items-center">
              <Users className="h-8 w-8 mr-3" />
              <span className="font-black text-xl tracking-tighter text-black" style={{ color: 'black' }}>PEER NOTES</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-black tracking-tighter uppercase " style={{ color: 'black' }}>🤝 PEER NOTES</h1>
            <div className="flex justify-center gap-3 items-center">
              <div className="h-6 w-6 bg-orange-500"></div>
              <div className="h-6 w-6 bg-blue-600"></div>
              <div className="h-6 w-6 bg-green-600"></div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white border-8 border-black p-6 shadow-brutal max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              <Input
                type="search"
                placeholder="Search peer notes..."
                className="bg-white text-black border-4 border-black pl-12 h-12 font-mono shadow-brutal focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600"
                style={{ color: 'black' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Error State */}
          {error && <ErrorCard message={error.message || "Failed to load peer notes data"} onRetry={refetch} />}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Peer Notes Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPeerNotes.map((note) => (
                <ResourceCard key={note.id} type="peer_notes" data={note} onRate={handleRateNote} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredPeerNotes.length === 0 && (
            <div className="text-center py-16 bg-gray-100 border-4 border-dashed border-black">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-2xl font-black mb-2 text-black" style={{ color: 'black' }}>NO PEER NOTES FOUND</h3>
              <p className="font-bold text-gray-600 mb-6">
                {searchQuery
                  ? `No peer notes match "${searchQuery}"`
                  : `No peer notes available for ${academicInfo.branch} Semester ${academicInfo.semester}`}
              </p>
              <Button
                onClick={() => setSearchQuery("")}
                className="bg-blue-600 text-white border-4 border-black font-bold"
              >
                CLEAR SEARCH
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
