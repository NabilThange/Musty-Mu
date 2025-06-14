"use client"

import { useState, useEffect } from "react"
import { BookOpen, Gem, ArrowRight, Download, Brain, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAcademicContext } from "@/contexts/academic-context"
import { AcademicSelector, AcademicSelectorModal } from "@/components/academic-selector"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/navbar"

export default function DashboardPage() {
  const { academicInfo, isContextSet, clearContext } = useAcademicContext()
  const [showSelector, setShowSelector] = useState(false)

  // Show selector if context not set
  useEffect(() => {
    if (!isContextSet) {
      setShowSelector(true)
    }
  }, [isContextSet])

  if (!isContextSet) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white font-mono px-4">
        <AcademicSelector onComplete={() => setShowSelector(false)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-mono">
      <Navbar onShowChangeClick={() => setShowSelector(true)} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          {/* Welcome Section */}
          <div className="text-center space-y-3">
            <div className="flex justify-center items-center gap-4 flex-wrap">
              <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase text-black">ACE THIS SEMESTER</h1>
              <div className="bg-blue-100 border-4 border-black px-3 py-1">
                <span className="font-black text-base tracking-tight uppercase text-black">
                  {academicInfo.year} • Semester {academicInfo.semester}
                  {academicInfo.branch && ` • ${academicInfo.branch}`}
                </span>
              </div>
            </div>
            {academicInfo.year === "FE" && (
              <div className="inline-block bg-blue-600 text-white border-4 border-black px-3 py-1">
                <span className="font-bold text-sm">📚 Common Curriculum for All Engineering Students</span>
              </div>
            )}
          </div>

          {/* Primary Actions - Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Syllabus Card */}
            <Link href="/syllabus" className="group">
              <div className="bg-red-600 text-white border-8 border-black p-8 shadow-brutal group-hover:translate-y-2 group-hover:shadow-none transition-all">
                <BookOpen className="h-16 w-16 mb-6" />
                <h3 className="text-2xl font-black mb-4 uppercase">SYLLABUS PDFs</h3>
                <p className="font-bold text-lg mb-6">Download official syllabus documents for your subjects</p>
                <div className="flex items-center gap-2 font-black">
                  <Download className="h-5 w-5" />
                  VIEW SYLLABUS
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Link>

            {/* AI Study Buddy */}
            <Link href="/ai-assistant" className="group">
              <div className="bg-blue-600 text-white border-8 border-black p-8 shadow-brutal group-hover:translate-y-2 group-hover:shadow-none transition-all">
                <Gem className="h-16 w-16 mb-6" />
                <h3 className="text-2xl font-black mb-4 uppercase">AI STUDY BUDDY</h3>
                <p className="font-bold text-lg mb-6">Chat, create flashcards, quizzes & mindmaps with AI</p>
                <div className="flex items-center gap-2 font-black">
                  <Brain className="h-5 w-5" />
                  START STUDYING
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Link>
          </div>

          {/* Study Resources Section */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-4">STUDY RESOURCES</h2>
              <div className="flex justify-center gap-2 items-center">
                <div className="h-4 w-4 bg-yellow-500"></div>
                <div className="h-4 w-4 bg-green-600"></div>
                <div className="h-4 w-4 bg-purple-600"></div>
                <div className="h-4 w-4 bg-orange-500"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* PYQs */}
              <Link href="/resources?type=pyq" className="group">
                <div className="bg-yellow-500 text-white border-8 border-black p-6 shadow-brutal group-hover:translate-y-2 group-hover:shadow-none transition-all text-center">
                  <div className="text-4xl mb-4">📄</div>
                  <h3 className="text-xl font-black mb-3 uppercase">PYQs</h3>
                  <p className="font-bold text-sm mb-4">Previous Year Question Papers</p>
                  <div className="flex items-center justify-center gap-1 font-black text-sm">
                    BROWSE
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>

              {/* PYQ Solutions */}
              <Link href="/resources?type=pyq_solutions" className="group">
                <div className="bg-green-600 text-white border-8 border-black p-6 shadow-brutal group-hover:translate-y-2 group-hover:shadow-none transition-all text-center">
                  <div className="text-4xl mb-4">🧾</div>
                  <h3 className="text-xl font-black mb-3 uppercase">PYQ SOLUTIONS</h3>
                  <p className="font-bold text-sm mb-4">Solved Previous Papers</p>
                  <div className="flex items-center justify-center gap-1 font-black text-sm">
                    BROWSE
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>

              {/* Question Banks */}
              <Link href="/resources?type=question_bank" className="group">
                <div className="bg-purple-600 text-white border-8 border-black p-6 shadow-brutal group-hover:translate-y-2 group-hover:shadow-none transition-all text-center">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="text-xl font-black mb-3 uppercase">QUESTION BANKS</h3>
                  <p className="font-bold text-sm mb-4">Practice Question Sets</p>
                  <div className="flex items-center justify-center gap-1 font-black text-sm">
                    BROWSE
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>

              {/* Peer Notes */}
              <Link href="/resources?type=peer_notes" className="group">
                <div className="bg-orange-500 text-white border-8 border-black p-6 shadow-brutal group-hover:translate-y-2 group-hover:shadow-none transition-all text-center">
                  <div className="text-4xl mb-4">🤝</div>
                  <h3 className="text-xl font-black mb-3 uppercase">PEER NOTES</h3>
                  <p className="font-bold text-sm mb-4">Student Shared Notes</p>
                  <div className="flex items-center justify-center gap-1 font-black text-sm">
                    BROWSE
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* AI Features Quick Access */}
          <div className="bg-[#F0F2F5] border-8 border-black p-8 shadow-brutal">
            <h2 className="text-3xl font-black text-black mb-8 uppercase text-center">🤖 AI STUDY MODES</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/ai-assistant?mode=chat" className="group">
                <div className="bg-[#A8C8EC] text-black border-8 border-black p-6 text-center shadow-brutal group-hover:translate-y-2 group-hover:shadow-none transition-all">
                  <div className="text-4xl mb-4">💬</div>
                  <div className="font-black text-lg uppercase tracking-tight">CHAT</div>
                  <div className="font-bold text-sm mt-2">Ask AI Questions</div>
                </div>
              </Link>
              <Link href="/ai-assistant?mode=flashcards" className="group">
                <div className="bg-[#F9DC5C] text-black border-8 border-black p-6 text-center shadow-brutal group-hover:translate-y-2 group-hover:shadow-none transition-all">
                  <div className="text-4xl mb-4">🃏</div>
                  <div className="font-black text-lg uppercase tracking-tight">FLASHCARDS</div>
                  <div className="font-bold text-sm mt-2">Study with Cards</div>
                </div>
              </Link>
              <Link href="/ai-assistant?mode=quiz" className="group">
                <div className="bg-[#F8A5A5] text-black border-8 border-black p-6 text-center shadow-brutal group-hover:translate-y-2 group-hover:shadow-none transition-all">
                  <div className="text-4xl mb-4">❓</div>
                  <div className="font-black text-lg uppercase tracking-tight">QUIZ</div>
                  <div className="font-bold text-sm mt-2">Test Knowledge</div>
                </div>
              </Link>
              <Link href="/ai-assistant?mode=mindmap" className="group">
                <div className="bg-[#C6F1D6] text-black border-8 border-black p-6 text-center shadow-brutal group-hover:translate-y-2 group-hover:shadow-none transition-all">
                  <div className="text-4xl mb-4">🧠</div>
                  <div className="font-black text-lg uppercase tracking-tight">MINDMAP</div>
                  <div className="font-bold text-sm mt-2">Visual Learning</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Study Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white border-8 border-black p-6 shadow-brutal text-center">
              <div className="text-3xl font-black text-yellow-600 mb-2">150+</div>
              <div className="font-bold text-sm text-black">PYQ PAPERS</div>
            </div>
            <div className="bg-white border-8 border-black p-6 shadow-brutal text-center">
              <div className="text-3xl font-black text-green-600 mb-2">80+</div>
              <div className="font-bold text-sm text-black">SOLUTIONS</div>
            </div>
            <div className="bg-white border-8 border-black p-6 shadow-brutal text-center">
              <div className="text-3xl font-black text-purple-600 mb-2">200+</div>
              <div className="font-bold text-sm text-black">QUESTIONS</div>
            </div>
            <div className="bg-white border-8 border-black p-6 shadow-brutal text-center">
              <div className="text-3xl font-black text-orange-600 mb-2">50+</div>
              <div className="font-bold text-sm text-black">PEER NOTES</div>
            </div>
          </div>
        </div>
      </main>

      {/* Academic Selector Modal */}
      <AcademicSelectorModal isOpen={showSelector} onClose={() => setShowSelector(false)} />
    </div>
  )
}
