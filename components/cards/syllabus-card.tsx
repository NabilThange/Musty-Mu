"use client"

import type React from "react"

import { Download, BookOpen } from "lucide-react"
import Link from "next/link"

export interface SyllabusCardProps {
  id: string
  subject_code: string
  subject_name: string
  semester: number
  year: string
  branch: string
  pdf_url: string
  credits?: number
  type?: "core" | "elective"
  onDownload?: (url: string) => void
  onAIChat?: (context: { subject_code: string; semester: number; branch: string }) => void
}

export function SyllabusCard({
  id,
  subject_code,
  subject_name,
  semester,
  year,
  branch,
  pdf_url,
  credits = 4,
  type = "core",
  onDownload,
  onAIChat,
}: SyllabusCardProps) {
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onDownload) {
      onDownload(pdf_url)
    } else {
      // Default download behavior
      const link = document.createElement("a")
      link.href = pdf_url
      link.download = `${subject_code}-syllabus.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleAIChat = () => {
    if (onAIChat) {
      onAIChat({ subject_code, semester, branch })
    }
  }

  return (
    <div className="bg-white border-8 border-black p-6 shadow-brutal">
      {/* Syllabus Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 border-4 border-black font-black text-sm bg-blue-600 text-white">📖 SYLLABUS</span>
          <span className="font-bold text-gray-600">{credits} Credits</span>
        </div>
        <h3 className="text-xl font-black mb-2 text-black">{subject_name}</h3>
        <p className="font-bold text-gray-600">{subject_code}</p>
        <p className="text-sm font-bold text-blue-600 mt-2">
          {year} • Sem {semester} • {branch}
        </p>
        <span
          className={`inline-block mt-2 px-2 py-1 border-2 border-black font-bold text-xs ${
            type === "core" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {type.toUpperCase()}
        </span>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={handleDownload}
          className="w-full bg-blue-600 text-white border-4 border-black p-4 font-black text-center hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
        >
          <Download className="h-5 w-5" />
          DOWNLOAD SYLLABUS
        </button>

        <Link
          href={`/ai-assistant?mode=chat&subject=${subject_code}`}
          onClick={handleAIChat}
          className="w-full bg-green-600 text-white border-4 border-black p-4 font-black text-center hover:bg-green-500 transition-colors flex items-center justify-center gap-2"
        >
          <BookOpen className="h-5 w-5" />
          STUDY WITH AI
        </Link>
      </div>
    </div>
  )
}
