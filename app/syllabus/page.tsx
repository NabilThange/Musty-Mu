"use client"

import { useState } from "react"
import { ArrowLeft, Search, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAcademicContext } from "@/contexts/academic-context"
import { useResources } from "@/hooks/use-resources"
import { SyllabusCard } from "@/components/cards/syllabus-card"
import { CardSkeleton } from "@/components/cards/card-skeleton"
import { ErrorCard } from "@/components/cards/error-card"
import Link from "next/link"

export default function SyllabusPage() {
  const { academicInfo, isContextSet } = useAcademicContext()
  const [searchQuery, setSearchQuery] = useState("")

  const {
    data: syllabusData,
    isLoading,
    error,
    refetch,
  } = useResources("syllabus", {
    year: academicInfo.year,
    semester: Number.parseInt(academicInfo.semester),
    branch: academicInfo.branch,
  })

  const filteredSubjects = syllabusData
    ? syllabusData.filter(
        (subject) =>
          subject.subject_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          subject.subject_code?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

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
            <Link href="/dashboard">
              <Button variant="outline" className="border-4 border-black font-bold">
                <ArrowLeft className="h-4 w-4 mr-2" />
                DASHBOARD
              </Button>
            </Link>
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 mr-3" />
              <span className="font-black text-xl tracking-tighter text-black">SYLLABUS</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-blue-100 border-4 border-black text-black px-4 py-2">
              <span className="font-bold text-sm">
                {academicInfo.year} • Sem {academicInfo.semester} • {academicInfo.branch}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-black tracking-tighter uppercase">SYLLABUS DOWNLOADS</h1>
            <div className="flex justify-center gap-3 items-center">
              <div className="h-6 w-6 bg-red-600"></div>
              <div className="h-6 w-6 bg-blue-600"></div>
              <div className="h-6 w-6 bg-yellow-500"></div>
            </div>
            <p className="text-xl font-bold text-black">
              {academicInfo.year} • Semester {academicInfo.semester} • {academicInfo.branch}
            </p>
          </div>

          {/* Search */}
          <div className="bg-white border-8 border-black p-6 shadow-brutal max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              <Input
                type="search"
                placeholder="Search subjects..."
                className="bg-white text-black border-4 border-black pl-12 h-12 font-mono shadow-brutal focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Error State */}
          {error && <ErrorCard message={error.message || "Failed to load syllabus data"} onRetry={refetch} />}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Subjects Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects.map((subject) => (
                <SyllabusCard
                  key={subject.id}
                  id={subject.id}
                  subject_code={subject.subject_code}
                  subject_name={subject.subject_name}
                  semester={subject.semester}
                  year={subject.year}
                  branch={subject.branch}
                  pdf_url={subject.pdf_url}
                  credits={4} // Default or from subject data
                  type="core" // Default or from subject data
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredSubjects.length === 0 && (
            <div className="text-center py-16 bg-gray-100 border-4 border-dashed border-black">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-2xl font-black mb-2 text-red-600">NO SUBJECTS FOUND</h3>
              <p className="font-bold text-gray-600 mb-6">
                {searchQuery
                  ? `No subjects match "${searchQuery}"`
                  : `No syllabus available for ${academicInfo.year} ${academicInfo.branch} Semester ${academicInfo.semester}`}
              </p>
              <Button
                onClick={() => setSearchQuery("")}
                className="bg-blue-600 text-white border-4 border-black font-bold"
              >
                CLEAR SEARCH
              </Button>
            </div>
          )}

          {/* Study Tips */}
          <div className="bg-gradient-to-br from-green-500 to-blue-500 border-8 border-black p-8 shadow-brutal">
            <h2 className="text-3xl font-black text-black mb-6 uppercase text-center">📚 STUDY TIPS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border-4 border-black p-4 text-center">
                <div className="text-3xl mb-2">📖</div>
                <div className="font-black text-black">READ SYLLABUS</div>
                <div className="text-sm font-bold text-gray-600">Understand what's covered</div>
              </div>
              <div className="bg-white border-4 border-black p-4 text-center">
                <div className="text-3xl mb-2">🤖</div>
                <div className="font-black text-black">USE AI HELP</div>
                <div className="text-sm font-bold text-gray-600">Get explanations & practice</div>
              </div>
              <div className="bg-white border-4 border-black p-4 text-center">
                <div className="text-3xl mb-2">📝</div>
                <div className="font-black text-black">PRACTICE REGULARLY</div>
                <div className="text-sm font-bold text-gray-600">Consistent study wins</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
