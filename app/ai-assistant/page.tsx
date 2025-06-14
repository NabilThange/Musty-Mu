"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { MessageCircle, CreditCard, HelpCircle, Brain, Menu, X, ArrowLeft, Send, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAcademicContext } from "@/contexts/academic-context"
import Link from "next/link"
import CustomMarkdown from '@/components/ui/markdown'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip'
import { Flashcard, FlashcardDeck } from '@/components/ui/flashcard'
import { FlashcardProps } from '@/components/ui/flashcard'
import { QuizDeck } from '@/components/ui/QuizDeck'
import { QuizItem } from '@/components/ui/QuizCard'

// Define AI modes as constants
const AI_MODES = {
  CHAT: 'chat',
  FLASHCARDS: 'flashcards',
  QUIZ: 'quiz',
  MINDMAP: 'mindmap'
} as const

type AIMode = typeof AI_MODES[keyof typeof AI_MODES]

export default function AIAssistantPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { academicInfo, isContextSet } = useAcademicContext()
  const [activeMode, setActiveMode] = useState<AIMode>(AI_MODES.CHAT)
  const [contextType, setContextType] = useState<"syllabus" | "upload">("syllabus")
  const [messages, setMessages] = useState<Array<{ 
    role: "user" | "assistant"; 
    content: string; 
    flashcards?: FlashcardProps[];
    quizData?: QuizItem[];
  }>>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  // Log initial mode
  useEffect(() => {
    console.log('Initial Active Mode:', activeMode)
  }, [])

  // Add this custom hook for mobile detection
  const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
      const mediaQuery = window.matchMedia(query)
      setMatches(mediaQuery.matches)

      const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
      mediaQuery.addEventListener('change', handler)

      return () => mediaQuery.removeEventListener('change', handler)
    }, [query])

    return matches
  }

  // Use media query for mobile detection
  const isMobile = useMediaQuery('(max-width: 768px)')

  // Set mode from URL params
  useEffect(() => {
    const mode = searchParams.get("mode") as AIMode
    console.log('URL Mode Parameter:', mode)
    
    if (mode && Object.values(AI_MODES).includes(mode)) {
      setActiveMode(mode)
      console.log('Mode Set From URL:', mode)
    } else {
      setActiveMode(AI_MODES.CHAT)
      console.log('Defaulted to Chat Mode')
    }
  }, [searchParams])

  // Handle mode switching with URL update
  const handleModeSwitch = (newMode: AIMode) => {
    console.log('Switching Mode:', {
      fromMode: activeMode,
      toMode: newMode
    })

    setActiveMode(newMode)
    // Clear messages when switching modes for better UX
    setMessages([])
    // Update URL with new mode
    router.push(`/ai-assistant?mode=${newMode}`)
    
    // Close sidebar on mode switch for mobile
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  // Log mode changes
  useEffect(() => {
    console.log('Current Active Mode:', activeMode)
  }, [activeMode])

  const handleSendMessage = async () => {
    console.log('Sending Message in Mode:', activeMode)

    if (!inputMessage.trim()) return

    const newMessage = { role: "user" as const, content: inputMessage }
    setMessages((prev) => [...prev, newMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      // Check for uploaded note context
      const uploadedNoteContext = localStorage.getItem('uploadedNoteContext')

      // Call actual API route with Groq integration
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [
            ...(uploadedNoteContext 
              ? [{ 
                  role: "system", 
                  content: `Context from uploaded note: ${uploadedNoteContext}` 
                }] 
              : []),
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            newMessage
          ],
          mode: activeMode,
          context: {
            year: academicInfo.year,
            semester: academicInfo.semester,
            branch: academicInfo.branch,
            uploadedNoteContext: uploadedNoteContext || undefined
          }
        })
      })

      const data = await response.json()

      console.log('API Response for Mode:', {
        mode: activeMode,
        hasFlashcards: !!data.flashcards,
        hasError: !!data.error
      })

      if (data.error) {
        // Handle API errors with more detailed messaging
        const errorMessage = {
          role: "assistant" as const, 
          content: `🤖 AI Error: ${data.error}\n\n${data.details ? `Details: ${JSON.stringify(data.details)}` : 'Please check your configuration and try again.'}`
        }
        setMessages((prev) => [...prev, errorMessage])
      } else {
        // Special handling for flashcards
        if (activeMode === AI_MODES.FLASHCARDS && data.flashcards) {
          console.group('🃏 Flashcard Generation')
          console.log('Raw API Response:', data)
          console.log('Generated Flashcards:', data.flashcards)
          console.log('Flashcard Count:', data.flashcards.length)
          
          // Log detailed information about each flashcard
          data.flashcards.forEach((card: FlashcardProps, index: number) => {
            console.log(`Flashcard #${index + 1}:`, {
              question: card.question,
              answer: card.answer,
              subject: card.subject || 'No Subject',
              difficulty: card.difficulty || 'No Difficulty'
            })
          })
          console.groupEnd()

          // Add a message about flashcard generation
          const flashcardMessage = {
            role: "assistant" as const,
            content: `🃏 Generated ${data.flashcards.length} flashcards for you to study!`,
            flashcards: data.flashcards
          }
          setMessages((prev) => [...prev, flashcardMessage])
        } else if (activeMode === AI_MODES.FLASHCARDS && data.error) {
          // Enhanced error logging for flashcard generation
          console.error('Flashcard Generation Error:', {
            mode: activeMode,
            error: data.error,
            details: data.details
          })

          // Add an error message to the chat
          const errorMessage = {
            role: "assistant" as const,
            content: `🤖 Error Generating Flashcards:\n\n${data.error}\n\n${data.details || 'Please try again or check your input.'}`
          }
          setMessages((prev) => [...prev, errorMessage])
        } else if (activeMode === AI_MODES.QUIZ && data.quizData) {
          console.group('❓ Quiz Generation')
          console.log('Raw API Response:', data)
          console.log('Generated Quiz Data:', data.quizData)
          console.log('Question Count:', data.quizData.length)

          const quizMessage = {
            role: "assistant" as const,
            content: `❓ Generated a quiz with ${data.quizData.length} questions for you!`,
            quizData: data.quizData
          }
          setMessages((prev) => [...prev, quizMessage])
        } else if (activeMode === AI_MODES.QUIZ && data.error) {
          console.error('Quiz Generation Error:', {
            mode: activeMode,
            error: data.error,
            details: data.details
          })

          const errorMessage = {
            role: "assistant" as const,
            content: `🤖 Error Generating Quiz:\n\n${data.error}\n\n${data.details || 'Please try again or check your input.'}`
          }
          setMessages((prev) => [...prev, errorMessage])
        } else {
          // Add AI response to messages
          const aiResponse = {
            role: "assistant" as const,
            content: data.content
          }
          setMessages((prev) => [...prev, aiResponse])
        }

        // Clear uploaded note context after first use
        localStorage.removeItem('uploadedNoteContext')
      }
    } catch (error) {
      console.error('Message Sending Error in Mode:', {
        mode: activeMode,
        error: error
      })

      // Handle network or other errors
      const errorMessage = {
        role: "assistant" as const,
        content: `🤖 Connection Error: Sorry, there was a problem connecting to the AI. 
        
Error Details: ${error instanceof Error ? error.message : String(error)}

Please check your internet connection and try again.`
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Sidebar Component
  const Sidebar = () => (
    <div>
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="h-8 w-8 bg-yellow-500 border-2 border-black rotate-12"></div>
        <div className="h-8 w-8 bg-blue-600 border-2 border-black -ml-2 -rotate-12"></div>
        <span className="font-black text-base tracking-tighter text-black">STUDGEM AI</span>
      </div>

      {/* Context Selector */}
      <div className="mb-4">
        <h3 className="text-sm font-bold mb-2 uppercase border-b-2 border-black pb-1 text-black">📁 Context</h3>
        <div className="space-y-4">
          <button
            onClick={() => {
              setContextType("syllabus")
              if (isMobile) setIsSidebarOpen(false)
            }}
            className={`
              w-full 
              p-6 
              border-2 
              border-black 
              text-left 
              uppercase 
              tracking-tight 
              transition-all 
              text-sm
              text-black
              ${contextType === "syllabus" 
                ? "bg-green-600 text-white" 
                : "bg-white hover:bg-gray-100"}
            `}
          >
            <div className="font-bold flex items-center gap-2 text-black">
              📚 Use Syllabus
              <span className="text-xs opacity-70 ml-auto">
                {academicInfo.year} {academicInfo.branch}
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              setContextType("upload")
              setIsUploadModalOpen(true)
              if (isMobile) setIsSidebarOpen(false)
            }}
            className={`
              w-full 
              p-6 
              border-2 
              border-black 
              text-left 
              uppercase 
              tracking-tight 
              transition-all 
              text-sm
              text-black
              ${contextType === "upload" 
                ? "bg-yellow-500 text-white" 
                : "bg-white hover:bg-gray-100"}
            `}
          >
            <div className="font-bold flex items-center gap-2 text-black">
              📤 Upload Notes
              <span className="text-xs opacity-70 ml-auto">Custom</span>
            </div>
          </button>
        </div>
      </div>

      {/* AI Modes */}
      <div className="flex-1 overflow-hidden">
        <h3 className="text-sm font-bold mb-2 uppercase border-b-2 border-black pb-1 text-black">🛠 Study Modes</h3>
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-300px)]">
          {[
            { mode: AI_MODES.CHAT, icon: MessageCircle, label: "CHAT", desc: "Ask questions" },
            { mode: AI_MODES.FLASHCARDS, icon: CreditCard, label: "FLASHCARDS", desc: "Study cards" },
            { mode: AI_MODES.QUIZ, icon: HelpCircle, label: "QUIZ", desc: "Test knowledge" },
            { mode: AI_MODES.MINDMAP, icon: Brain, label: "MINDMAP", desc: "Visualize concepts" },
          ].map(({ mode, icon: Icon, label, desc }) => (
            <button
              key={mode}
              onClick={() => handleModeSwitch(mode)}
              className={`
                w-full 
                p-4 
                border-2 
                border-black 
                text-left 
                uppercase 
                tracking-tight 
                transition-all 
                text-sm
                text-black
                ${activeMode === mode 
                  ? "bg-blue-600 text-white" 
                  : "bg-white hover:bg-gray-100"}
              `}
            >
              <div className="flex items-center gap-3 text-black">
                <Icon className="h-6 w-6 stroke-[2]" />
                <div className="flex-1">
                  <div className="font-bold text-base">{label}</div>
                  <div className="text-xs opacity-70">{desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  // Backdrop for mobile sidebar
  const Backdrop = () => (
    isMobile && isSidebarOpen ? (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-30 cursor-pointer"
        onClick={() => setIsSidebarOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setIsSidebarOpen(false)
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Close sidebar"
      />
    ) : null
  )

  // Add useEffect to handle body scroll prevention
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
    console.log('Academic Info:', {
      year: academicInfo.year,
      semester: academicInfo.semester,
      branch: academicInfo.branch
    })
  }, [academicInfo])

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
    <main className="
      h-screen 
      bg-white 
      font-mono 
      grid 
      md:grid-cols-[260px_1fr] 
      grid-cols-1 
      overflow-hidden 
      relative
    ">
      {/* Sidebar for Desktop and Mobile */}
      <aside 
        className={`
          fixed 
          md:static 
          top-0 
          left-0 
          h-full 
          w-[260px] 
          bg-white 
          border-r-4 
          border-black 
          p-3 
          flex 
          flex-col 
          text-sm 
          tracking-tight 
          z-50
          transform 
          transition-transform 
          duration-300 
          ease-in-out
          ${isMobile 
            ? (isSidebarOpen 
              ? "translate-x-0" 
              : "-translate-x-full") 
            : "translate-x-0"}
        `}
        aria-hidden={isMobile ? !isSidebarOpen : false}
      >
        {Sidebar()}
      </aside>

      {/* Backdrop for Mobile Sidebar */}
      {Backdrop()}

      {/* Main Content Area */}
      <div className="
        flex 
        flex-col 
        overflow-hidden 
        md:ml-0 
        ml-0 
        w-full 
        md:w-[calc(100vw-260px)] 
        relative 
        z-10
        ${isMobile ? 'mt-16' : ''}
      ">
        {/* Mobile Burger Menu */}
        {isMobile && (
          <div className="absolute top-0 left-0 right-0 z-30 border-b-8 border-black p-4 bg-gray-50 flex flex-col items-center justify-between">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="mr-4 focus:outline-none text-black"
                  aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isSidebarOpen}
                >
                  {isSidebarOpen ? <X className="h-6 w-6 text-black" /> : <Menu className="h-6 w-6 text-black" />}
                </button>
                <h2 className="text-xl font-black uppercase text-black">
                  {activeMode === AI_MODES.CHAT && "💬 AI CHAT"}
                  {activeMode === AI_MODES.FLASHCARDS && "🃏 FLASHCARD GENERATOR"}
                  {activeMode === AI_MODES.QUIZ && "❓ QUIZ MAKER"}
                  {activeMode === AI_MODES.MINDMAP && "🧠 MINDMAP CREATOR"}
                </h2>
              </div>
              <Link href="/dashboard">
                <Button 
                  variant="outline" 
                  className="border-4 border-black font-bold text-xs px-2 py-1"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  DASHBOARD
                </Button>
              </Link>
            </div>
            {contextType === "syllabus" && (
              <p className="text-xs font-bold text-gray-600 mt-1 w-full text-center ml-[-52px]">
                {(() => {
                  console.log('Render Academic Info:', {
                    year: academicInfo.year,
                    semester: academicInfo.semester,
                    branch: academicInfo.branch
                  });
                  const branchDisplay = academicInfo.year === 'FE' && ['1', '2', 'SEM 1', 'SEM 2'].includes(academicInfo.semester) ? 'ALL BRANCHES' : academicInfo.branch;
                  return `Using syllabus of ${academicInfo.year} • ${branchDisplay} • ${academicInfo.semester}`;
                })()}
              </p>
            )}
          </div>
        )}

        {/* Desktop Header */}
        {!isMobile && (
          <header className="
            border-b-8 
            border-black 
            p-4 
            bg-gray-50 
            flex-shrink-0 
            flex 
            justify-between 
            items-center
          ">
            <div>
              <h2 className="text-xl font-black uppercase text-black">
                {activeMode === AI_MODES.CHAT && "💬 AI CHAT"}
                {activeMode === AI_MODES.FLASHCARDS && "🃏 FLASHCARD GENERATOR"}
                {activeMode === AI_MODES.QUIZ && "❓ QUIZ MAKER"}
                {activeMode === AI_MODES.MINDMAP && "🧠 MINDMAP CREATOR"}
              </h2>
              <p className="text-xs font-bold text-gray-600 mt-1">
                {contextType === "syllabus"
                  ? (() => {
                      console.log('Desktop Header Academic Info:', {
                        year: academicInfo.year,
                        semester: academicInfo.semester,
                        branch: academicInfo.branch
                      });
                      const branchDisplay = academicInfo.year === 'FE' && ['1', '2', 'SEM 1', 'SEM 2'].includes(academicInfo.semester) ? 'ALL BRANCHES' : academicInfo.branch;
                      return `Using Syllabus of ${academicInfo.year} • ${branchDisplay} • ${academicInfo.semester}`;
                    })()
                  : "Using uploaded study materials"}
              </p>
            </div>
            <Link href="/dashboard">
              <Button 
                variant="outline" 
                className="border-4 border-black font-bold text-xs px-2 py-1"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                DASHBOARD
              </Button>
            </Link>
          </header>
        )}

        {/* Empty State with Engaging Prompt */}
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-6 bg-gray-50 min-h-[calc(100%-200px)]">
            <div className="text-[8rem] mb-6 animate-pulse">
              {activeMode === AI_MODES.CHAT && "💬"}
              {activeMode === AI_MODES.FLASHCARDS && "🃏"}
              {activeMode === AI_MODES.QUIZ && "❓"}
              {activeMode === AI_MODES.MINDMAP && "🧠"}
            </div>
            <h3 className="text-4xl font-black mb-4 text-black tracking-tight">
              Let's Get Started!
            </h3>
            <p className="text-xl text-gray-700 mb-6 max-w-xl">
              Ask me about anything from your syllabus or notes.
            </p>
            <div className="text-base text-gray-600 italic space-y-2">
              <p>• What is the difference between stack and queue?</p>
              <p>• Summarize Module 3 of DSA</p>
              <p>• Create flashcards for Signals & Systems</p>
            </div>
          </div>
        )}

        {/* Messages Area - Scrollable */}
        <div className="
          flex-1 
          overflow-y-auto 
          p-4 
          space-y-4 
          min-h-0 
          max-h-[calc(100vh-200px)]
        ">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`
                p-4 border-4 border-black 
                ${msg.role === 'user' ? 'bg-gray-100' : 'bg-blue-100'}
              `}
            >
              <div className="font-black mb-2 text-sm text-black">
                {msg.role === 'user' ? '👤 YOU' : '🤖 STUDGEM AI'}
              </div>
              {msg.flashcards ? (
                <div>
                  <CustomMarkdown>{`🃏 Generated ${msg.flashcards.length} flashcards for your study session!`}</CustomMarkdown>
                  <FlashcardDeck flashcards={msg.flashcards} />
                  </div>
              ) : msg.quizData ? (
                <div>
                   <CustomMarkdown>{`❓ Generated a quiz with ${msg.quizData.length} questions for you!`}</CustomMarkdown>
                   <QuizDeck questions={msg.quizData} />
                </div>
              ) : (
                <CustomMarkdown>{msg.content}</CustomMarkdown>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="
          border-t-8 
          border-black 
          p-4 
          bg-gray-50 
          flex-shrink-0 
          h-[86px] 
          relative 
          top-[-8px]
        ">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask about ${academicInfo.branch} topics...`}
              className="flex-1 border-4 border-black font-mono bg-white text-black text-sm h-[52px]"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-blue-600 text-white border-4 border-black font-bold px-4 py-2 h-[52px] group"
            >
              <Send className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </main>
  )
}

const UploadModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type and size
      const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'text/plain',
        'image/png',
        'image/jpeg',
        'image/jpg'
      ]
      const maxSize = 10 * 1024 * 1024 // 10MB

      if (!allowedTypes.includes(file.type)) {
        setUploadError('Unsupported file type. Please upload PDF, DOC, TXT, PNG, JPG, or JPEG files.')
        return
      }

      if (file.size > maxSize) {
        setUploadError('File is too large. Maximum size is 10MB.')
        return
      }

      setSelectedFile(file)
      setUploadError(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadError(null)

    try {
      // Create FormData to send file
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('fileName', selectedFile.name)

      // Send file to backend API
      const response = await fetch('/api/upload-notes', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'File upload failed')
      }

      const uploadResult = await response.json()

      // If upload successful, use the extracted text with Groq
      if (uploadResult.extractedText) {
        // Store context for AI interaction
        localStorage.setItem('uploadedNoteContext', uploadResult.extractedText)
        
        // Optional: Show summary to user
        alert(`File uploaded successfully!\n\nSummary: ${uploadResult.summary}`)
      }

      // Close modal and reset state
      onClose()
      setSelectedFile(null)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setIsUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white border-8 border-black p-8 text-center relative max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black hover:text-gray-700 focus:outline-none"
          aria-label="Close"
        >
          <X className="h-6 w-6 stroke-[3]" />
        </button>
        
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="text-black mb-4 flex items-center justify-center">
            <div className="relative w-32 h-32 border-4 border-black bg-white flex items-center justify-center">
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              />
              <div className="absolute inset-0 border-2 border-dashed border-black opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex flex-col items-center">
                {selectedFile ? (
                  <div className="text-center">
                    <p className="font-bold text-sm truncate max-w-[200px]">{selectedFile.name}</p>
                    <p className="text-xs text-gray-600">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-12 w-12 text-black stroke-[2]" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" 
                      />
                    </svg>
                    <p className="text-xs font-bold uppercase mt-2">Upload Note</p>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {uploadError && (
            <div className="text-red-600 font-bold text-sm text-center">
              {uploadError}
            </div>
          )}
          
          <div className="w-full">
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full bg-blue-600 text-white border-4 border-black font-bold uppercase tracking-tight hover:bg-blue-700 disabled:opacity-50"
            >
              {isUploading 
                ? 'Uploading...' 
                : (selectedFile ? `Upload ${selectedFile.name}` : 'Select a File')
              }
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-600 font-bold uppercase">
              Supported Formats: PDF, DOC, TXT, PNG, JPG, JPEG (Max 10MB)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
