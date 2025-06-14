"use client"

import type React from "react"

import { Download, BookOpen, Star, ExternalLink } from "lucide-react"
import Link from "next/link"

export type ResourceType = "pyq" | "pyq_solutions" | "question_bank" | "peer_notes"

export interface ResourceCardData {
  id: string
  subject_code?: string
  semester?: number
  branch?: string
  pdf_url: string
  created_at: string
  type: ResourceType
  // PYQ specific
  exam_date?: string
  // PYQ Solutions specific (now directly available)
  pyq_id?: string
  // Question Bank specific
  source?: string
  // Peer Notes specific
  uploader_name?: string | null
  rating?: number
}

export interface ResourceCardProps {
  type: ResourceType
  data: ResourceCardData
  onDownload?: (url: string) => void
  onAIChat?: (context: { subject_code: string; semester: number; branch: string; resourceId: string }) => void
  onRate?: (resourceId: string, rating: number) => void
}

export function ResourceCard({ type, data, onDownload, onAIChat, onRate }: ResourceCardProps) {
  // Add a method to format month and year
  const formatPaperDate = (createdAt: string, yearPaper?: number) => {
    if (!createdAt || !yearPaper) return undefined;
    
    const date = new Date(createdAt);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    return `${months[date.getMonth()]} ${yearPaper}`;
  }

  const getResourceConfig = () => {
    // Combine paper_month and year_paper if both exist
    const paperDate = data.paper_month && data.year_paper 
      ? `${data.paper_month} ${data.year_paper}` 
      : undefined;

    switch (type) {
      case "pyq":
        return {
          icon: "📄",
          label: "PYQ",
          color: "bg-yellow-500",
          title: `${data.subject_code}`,
          subtitle: `Sem ${data.semester} • ${data.branch}`,
          badge: data.exam_date,
          downloadText: "DOWNLOAD PYQ",
          aiText: "ASK AI ABOUT THIS",
        }
      case "pyq_solutions":
        return {
          icon: "🧾",
          label: "PYQ SOLUTION",
          color: "bg-green-600",
          title: `${data.subject_code || 'Solution'} `,
          subtitle: `Sem ${data.semester} • ${data.branch}`,
          badge: data.exam_date,
          downloadText: "DOWNLOAD SOLUTION",
          aiText: "ASK AI ABOUT THIS",
        }
      case "question_bank":
        return {
          icon: "",
          label: "QUESTION BANK",
          color: "bg-purple-600",
          title: `${data.subject_code} Questions`,
          subtitle: `Sem ${data.semester} • ${data.branch}`,
          badge: data.source?.toUpperCase(),
          downloadText: "DOWNLOAD QUESTIONS",
          aiText: "PRACTICE WITH AI",
        }
      case "peer_notes":
        return {
          icon: "🤝",
          label: "PEER NOTES",
          color: "bg-orange-500",
          title: `${data.subject_code} Notes`,
          subtitle: `Sem ${data.semester} • ${data.branch}`,
          badge: data.rating ? `⭐ ${data.rating}` : undefined,
          downloadText: "DOWNLOAD NOTES",
          aiText: "ASK AI ABOUT THIS",
        }
      default:
        return {
          icon: "📄",
          label: "RESOURCE",
          color: "bg-gray-600",
          title: data.subject_code,
          subtitle: `Sem ${data.semester} • ${data.branch}`,
          badge: undefined,
          downloadText: "DOWNLOAD",
          aiText: "ASK AI",
        }
    }
  }

  const config = getResourceConfig()

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onDownload) {
      onDownload(data.pdf_url)
    } else {
      const link = document.createElement("a")
      link.href = data.pdf_url
      link.download = `${data.subject_code}-${type}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleAIChat = () => {
    if (onAIChat) {
      onAIChat({
        subject_code: data.subject_code,
        semester: data.semester,
        branch: data.branch,
        resourceId: data.id,
      })
    }
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-200 text-yellow-400" />)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return stars
  }

  return (
    <div className="bg-white border-8 border-black p-6 shadow-brutal">
      {/* Resource Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 border-4 border-black font-black text-sm text-white ${config.color}`}>
            {config.icon} {config.label}
          </span>
          {config.badge && <span className="font-bold text-gray-600">{config.badge}</span>}
        </div>

        <h3 className="text-xl font-black mb-2 text-black">{config.title}</h3>
        <p className="font-bold text-gray-600">{config.subtitle}</p>

        {/* Type-specific additional info */}
        {type === "pyq" && data.type && (
          <span
            className={`inline-block mt-2 px-2 py-1 border-2 border-black font-bold text-xs ${
              data.type === "main" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
            }`}
          >
            {data.type.toUpperCase()} {data.exam_date ? `• ${data.exam_date}` : ''}
          </span>
        )}

        {type === "pyq_solutions" && data.pyq && (
          <div className="mt-3 p-2 bg-blue-50 border-2 border-blue-200">
            <p className="text-sm font-bold text-blue-800">
              📄 Original: {data.pyq.subject_code} {data.pyq.type?.toUpperCase()} {data.pyq.year}
            </p>
          </div>
        )}

        {type === "question_bank" && (
          <div className="mt-3 p-2 bg-purple-50 border-2 border-purple-200">
            <p className="text-sm font-bold text-purple-800">📝 Comprehensive question collection for practice</p>
          </div>
        )}

        {type === "peer_notes" && (
          <>
            {data.uploader_name && <p className="text-sm font-bold text-blue-600 mt-2">by {data.uploader_name}</p>}
            {data.rating && (
              <div className="flex items-center gap-1 mt-2">
                {renderStars(data.rating)}
                <span className="ml-1 font-bold text-sm">({data.rating})</span>
              </div>
            )}
            <div className="mt-3 p-2 bg-orange-50 border-2 border-orange-200">
              <p className="text-sm font-bold text-orange-800">📝 Student-created study material</p>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={handleDownload}
          className={`w-full text-white border-4 border-black p-4 font-black text-center hover:opacity-80 transition-opacity flex items-center justify-center gap-2 ${config.color}`}
        >
          <Download className="h-5 w-5" />
          {config.downloadText}
        </button>

        {/* Special actions for different types */}
        {type === "pyq_solutions" && data.pyq_id && (
          <Link
            href={`/pyqs?highlight=${data.pyq_id}`}
            className="w-full bg-blue-600 text-white border-4 border-black p-4 font-black text-center hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink className="h-5 w-5" />
            VIEW ORIGINAL PYQ
          </Link>
        )}

        {type === "peer_notes" && onRate ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onRate(data.id, 5)}
              className="bg-yellow-500 text-black border-4 border-black font-bold text-xs p-2"
            >
              ⭐ RATE NOTES
            </button>
            <Link
              href={`/ai-assistant?mode=chat&subject=${data.subject_code}`}
              onClick={handleAIChat}
              className="bg-blue-600 text-white border-4 border-black font-bold text-xs p-2 text-center flex items-center justify-center"
            >
              <BookOpen className="h-3 w-3" />
            </Link>
          </div>
        ) : (
          <Link
            href={`/ai-assistant?mode=chat&subject=${data.subject_code}`}
            onClick={handleAIChat}
            className="w-full bg-green-600 text-white border-4 border-black p-4 font-black text-center hover:bg-green-500 transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen className="h-5 w-5" />
            {config.aiText}
          </Link>
        )}
      </div>
    </div>
  )
}
