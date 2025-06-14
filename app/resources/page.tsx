"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Search, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAcademicContext } from "@/contexts/academic-context"
import { useResources } from "@/hooks/use-resources"
import { ResourceCard } from "@/components/cards/resource-card"
import { SyllabusCard } from "@/components/cards/syllabus-card"
import { CardSkeleton } from "@/components/cards/card-skeleton"
import { ErrorCard } from "@/components/cards/error-card"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

export default function ResourcesPage() {
  const { academicInfo, isContextSet } = useAcademicContext()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")

  // Get type from URL params and update state
  useEffect(() => {
    const typeParam = searchParams.get("type")
    if (typeParam) {
      setSelectedType(typeParam)
    } else {
      setSelectedType("all")
    }
  }, [searchParams])

  const {
    data: allResourcesData,
    isLoading,
    error,
    refetch,
  } = useResources("all", {
    year: academicInfo.year,
    semester: Number.parseInt(academicInfo.semester),
    branch: academicInfo.branch,
  })

  // Handle resource type switching with URL update
  const handleTypeSwitch = (newType: string) => {
    if (newType === "all") {
      router.push("/resources")
    } else {
      router.push(`/resources?type=${newType}`)
    }
  }

  const filteredResources = allResourcesData
    ? allResourcesData.filter((resource) => {
        const matchesSearch =
          resource.subject_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.subject_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.uploader_name?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = selectedType === "all" || resource.type === selectedType
        return matchesSearch && matchesType
      })
    : []

  const getPageTitle = () => {
    switch (selectedType) {
      case "pyq":
        return "📄 PREVIOUS YEAR QUESTIONS"
      case "pyq_solutions":
        return "🧾 PYQ SOLUTIONS"
      case "question_bank":
        return "📚 QUESTION BANKS"
      case "peer_notes":
        return "🤝 PEER NOTES"
      case "syllabus":
        return "📖 SYLLABUS"
      default:
        return "📚 ALL STUDY RESOURCES"
    }
  }

  const getResourceStats = () => {
    if (!allResourcesData) return { pyq: 0, pyq_solutions: 0, question_bank: 0, peer_notes: 0, syllabus: 0 }

    return {
      pyq: allResourcesData.filter((r) => r.type === "pyq").length,
      pyq_solutions: allResourcesData.filter((r) => r.type === "pyq_solutions").length,
      question_bank: allResourcesData.filter((r) => r.type === "question_bank").length,
      peer_notes: allResourcesData.filter((r) => r.type === "peer_notes").length,
      syllabus: allResourcesData.filter((r) => r.type === "syllabus").length,
    }
  }

  const stats = getResourceStats()

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
      <header className="sticky top-0 z-40 w-full border-b-8 border-black bg-white text-black">
        <div className="container flex h-20 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Link href="/dashboard">
              <Button variant="outline" className="border-4 border-black font-bold">
                <ArrowLeft className="h-4 w-4 mr-2" />
                DASHBOARD
              </Button>
            </Link>
            <div className="flex items-center">
              <FileText className="h-8 w-8 mr-3" />
              <span className="font-black text-xl tracking-tighter ">RESOURCES</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-blue-100 border-4 border-black px-4 py-2">
              <span className="font-bold text-sm">
                {academicInfo.year} • Sem {academicInfo.semester}
                {academicInfo.branch && ` • ${academicInfo.branch}`}
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
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-black">{getPageTitle()}</h1>
            <div className="flex justify-center gap-3 items-center">
              <div className="h-6 w-6 bg-yellow-500"></div>
              <div className="h-6 w-6 bg-green-600"></div>
              <div className="h-6 w-6 bg-purple-600"></div>
              <div className="h-6 w-6 bg-orange-500"></div>
            </div>
            <p className="text-xl font-bold">
              {academicInfo.year} {academicInfo.branch && academicInfo.branch} • Semester {academicInfo.semester}
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white border-8 border-black p-6 shadow-brutal">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search resources, subjects..."
                  className="bg-white text-black border-4 border-black pl-12 h-12 font-mono shadow-brutal focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: "all", label: "ALL", icon: "📄", color: "bg-gray-600" },
                  { value: "syllabus", label: "SYLLABUS", icon: "📖", color: "bg-blue-600" },
                  { value: "pyq", label: "PYQs", icon: "📄", color: "bg-yellow-500" },
                  { value: "pyq_solutions", label: "SOLUTIONS", icon: "🧾", color: "bg-green-600" },
                  { value: "question_bank", label: "QUESTIONS", icon: "📚", color: "bg-purple-600" },
                  { value: "peer_notes", label: "NOTES", icon: "🤝", color: "bg-orange-500" },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleTypeSwitch(type.value)}
                    className={`px-4 py-3 border-4 border-black font-bold transition-all text-white hover:opacity-80 ${
                      selectedType === type.value ? `${type.color} shadow-brutal` : "bg-gray-400 hover:bg-gray-500"
                    }`}
                  >
                    {type.icon} {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resource Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button
              key="syllabus-stats"
              onClick={() => handleTypeSwitch('syllabus')}
              className="bg-blue-600 text-white border-8 border-black p-4 shadow-brutal text-center hover:opacity-80 transition-opacity"
            >
              <div className="text-3xl font-black">{stats.syllabus}</div>
              <div className="font-bold ">SYLLABUS</div>
            </button>
            <button
              key="pyq-stats"
              onClick={() => handleTypeSwitch('pyq')}
              className="bg-yellow-500 text-white border-8 border-black p-4 shadow-brutal text-center hover:opacity-80 transition-opacity"
            >
              <div className="text-3xl font-black">{stats.pyq}</div>
              <div className="font-bold">PYQ PAPERS</div>
            </button>
            <button
              key="solutions-stats"
              onClick={() => handleTypeSwitch('pyq_solutions')}
              className="bg-green-600 text-white border-8 border-black p-4 shadow-brutal text-center hover:opacity-80 transition-opacity"
            >
              <div className="text-3xl font-black">{stats.pyq_solutions}</div>
              <div className="font-bold">SOLUTIONS</div>
            </button>
            <button
              key="question-banks-stats"
              onClick={() => handleTypeSwitch('question_bank')}
              className="bg-purple-600 text-white border-8 border-black p-4 shadow-brutal text-center hover:opacity-80 transition-opacity"
            >
              <div className="text-3xl font-black">{stats.question_bank}</div>
              <div className="font-bold">QUESTION BANKS</div>
            </button>
            <button
              key="peer-notes-stats"
              onClick={() => router.push('/peer-notes')}
              className="bg-orange-500 text-white border-8 border-black p-4 shadow-brutal text-center hover:opacity-80 transition-opacity"
            >
              <div className="text-3xl font-black">{stats.peer_notes}</div>
              <div className="font-bold">PEER NOTES</div>
            </button>
          </div>

          {/* Error State */}
          {error && <ErrorCard message={error.message || "Failed to load resources"} onRetry={refetch} />}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Resources Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                if (resource.type === "syllabus") {
                  return (
                    <SyllabusCard
                      key={resource.id}
                      id={resource.id}
                      subject_code={resource.subject_code}
                      subject_name={resource.subject_name}
                      semester={resource.semester}
                      year={resource.year}
                      branch={resource.branch}
                      pdf_url={resource.pdf_url}
                    />
                  )
                } else {
                  return <ResourceCard key={resource.id} type={resource.type as any} data={resource} />
                }
              })}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredResources.length === 0 && (
            <div className="text-center py-16 bg-gray-100 border-4 border-dashed border-black">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-2xl font-black mb-2 text-black">NO RESOURCES FOUND</h3>
              <p className="font-bold text-gray-600 mb-6">
                {searchQuery
                  ? `No resources match "${searchQuery}"`
                  : `No ${selectedType === "all" ? "" : getPageTitle().toLowerCase()} resources available`}
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  handleTypeSwitch("all")
                }}
                className="bg-blue-600 text-white border-4 border-black font-bold"
              >
                CLEAR FILTERS
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
