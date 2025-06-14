"use client"

import { useEffect } from "react"
import { ArrowRight, FileText, Download, Brain, MessageSquare, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import GeometricMascot from "@/components/geometric-mascot"
import Image from "next/image"

export default function LandingPage() {
  const router = useRouter()

  // Check if user is returning
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isReturningUser = localStorage.getItem("musty_returning_user")
      if (isReturningUser) {
        router.push("/dashboard")
      }
    }
  }, [router])

  return (
    <div className="min-h-screen font-mono bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b-8 border-black bg-red-600">
        <div className="container flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3 md:gap-4">
            <Image
              src="/images/musty-logo.png"
              alt="MUSTY Logo"
              width={48}
              height={48}
              className="w-10 h-10 md:w-12 md:h-12 border-2 border-black"
            />
            <span className="font-black text-lg md:text-2xl tracking-tighter text-black">MUSTY</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-blue-600 to-yellow-500 border-b-8 border-black">
        {/* Subtle Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%)
            `,
            backgroundSize: "40px 40px",
            backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
          }}
        ></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-15"></div>

        <div className="relative container mx-auto px-4 md:px-6 py-20 md:py-28">
          <div className="max-w-7xl mx-auto">
            {/* 12-Column Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Mascot Column - 3 columns on desktop */}
              <div className="lg:col-span-3 flex justify-center lg:justify-end">
                <GeometricMascot />
              </div>

              {/* Content Column - 9 columns on desktop */}
              <div className="lg:col-span-9 text-center lg:text-left space-y-8">
                {/* Main Headline with Improved Typography */}
                <div className="space-y-4">
                  <h1 className="space-y-2">
                    {/* First Line - Enhanced */}
                    <span className="block text-3xl md:text-5xl lg:text-6xl font-black tracking-wider uppercase text-white leading-tight drop-shadow-lg">
                      THE FASTEST WAY TO
                    </span>
                    {/* Second Line - Balanced Styling */}
                    <span
                      className="block text-4xl md:text-6xl lg:text-7xl font-black tracking-tight uppercase text-yellow-300 leading-tight"
                      style={{
                        textShadow: "2px 2px 0px rgba(0,0,0,0.8)",
                        WebkitTextStroke: "1px rgba(0,0,0,0.3)",
                      }}
                    >
                      STUDY YOUR MU SYLLABUS
                    </span>
                  </h1>
                </div>

                {/* Value Proposition - Properly Aligned */}
                <div className="flex justify-center lg:justify-start">
                  <div
                    className="bg-white border-4 border-black p-4 shadow-brutal max-w-lg hover:shadow-brutal-lg hover:translate-y-1 transition-all duration-300"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 2px, transparent 2px),
                        radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 2px, transparent 2px)
                      `,
                      backgroundSize: "30px 30px",
                    }}
                  >
                    <p className="font-black text-black text-base md:text-lg text-center lg:text-left">
                      AI Tools • Flashcards • Notes • No Login Needed
                    </p>
                  </div>
                </div>

                {/* CTA Buttons - Properly Spaced */}
                <div className="space-y-6 pt-4">
                  {/* Primary CTA - Enhanced Balance */}
                  <div className="flex justify-center lg:justify-start">
                    <Link
                      href="/dashboard"
                      className="group inline-flex items-center gap-6 bg-yellow-500 text-black border-6 border-black px-12 md:px-16 py-6 md:py-7 font-black text-xl md:text-2xl shadow-brutal hover:translate-y-2 hover:shadow-none transition-all transform hover:scale-105 relative overflow-hidden"
                    >
                      {/* Animated background on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10">🔓 START STUDYING FREE</span>
                      <ArrowRight className="h-7 w-7 md:h-8 md:w-8 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                    </Link>
                  </div>

                  {/* Secondary CTAs - Better Alignment */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link
                      href="/syllabus"
                      className="group inline-flex items-center gap-3 bg-white text-black border-4 border-black px-8 py-4 font-bold text-lg shadow-brutal-sm hover:translate-y-1 hover:shadow-none transition-all hover:bg-gray-50"
                    >
                      <span className="group-hover:scale-110 transition-transform duration-200">📚</span>
                      EXPLORE MODULES
                    </Link>
                    <Link
                      href="/ai-assistant"
                      className="group inline-flex items-center gap-3 bg-blue-600 text-white border-4 border-black px-8 py-4 font-bold text-lg shadow-brutal-sm hover:translate-y-1 hover:shadow-none transition-all hover:bg-blue-700"
                    >
                      <span className="group-hover:scale-110 transition-transform duration-200">🧠</span>
                      USE STUDGEM AI
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Anchor - Properly Spaced */}
            <div className="flex justify-center items-center gap-6 pt-16 pb-8">
              <div className="h-12 w-12 bg-white border-4 border-black rotate-45 hover:rotate-90 transition-transform duration-500"></div>
              <div className="h-16 w-16 bg-yellow-300 border-4 border-black rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <Brain className="h-8 w-8 text-black" />
              </div>
              <div className="h-12 w-12 bg-white border-4 border-black -rotate-45 hover:-rotate-90 transition-transform duration-500"></div>
            </div>

            {/* Trust Indicators - Enhanced Layout */}
            <div className="text-center space-y-6">
              <p className="text-white font-bold text-xl drop-shadow-lg">TRUSTED BY 1000+ MU STUDENTS</p>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                {["NO SIGNUP", "100% FREE", "OFFICIAL SYLLABUS"].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white text-black font-black text-sm px-6 py-3 border-4 border-black shadow-brutal-sm hover:translate-y-1 hover:shadow-none transition-all cursor-default"
                  >
                    ✅ {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced with Better Spacing */}
      <section className="py-24 bg-white border-b-8 border-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-6">EVERYTHING YOU NEED</h2>
            <p className="text-xl font-bold text-gray-600">Four powerful tools. One platform. Zero hassle.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                bg: "bg-red-600",
                icon: Download,
                title: "SYLLABUS PDFs",
                desc: "Download official Mumbai University syllabus documents instantly",
              },
              {
                bg: "bg-blue-600",
                icon: MessageSquare,
                title: "AI STUDY BUDDY",
                desc: "Chat, generate flashcards, create quizzes & build mindmaps",
              },
              {
                bg: "bg-yellow-500",
                icon: FileText,
                title: "STUDY RESOURCES",
                desc: "Previous year papers, notes & question banks for exam prep",
                textColor: "text-black",
              },
              {
                bg: "bg-green-600",
                icon: Zap,
                title: "SMART TOOLS",
                desc: "Interactive flashcards, quizzes & visual mindmaps",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`${feature.bg} ${feature.textColor || "text-white"} border-8 border-black p-8 shadow-brutal hover:translate-y-2 hover:shadow-none transition-all duration-300 group cursor-pointer`}
              >
                <div
                  className={`${feature.textColor === "text-black" ? "bg-black" : "bg-white"} border-4 border-black p-4 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon
                    className={`h-12 w-12 ${feature.textColor === "text-black" ? "text-yellow-500" : feature.bg.replace("bg-", "text-")}`}
                  />
                </div>
                <h3 className="text-xl font-black mb-4 uppercase text-center group-hover:scale-105 transition-transform duration-300">
                  {feature.title}
                </h3>
                <p className="font-bold text-center">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-100 border-b-8 border-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-6">HOW IT WORKS</h2>
            <p className="text-xl font-bold text-gray-600">Three simple steps to academic success</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {[
              {
                bg: "bg-red-600",
                number: "1",
                title: "CHOOSE YOUR YEAR",
                desc: "Select your engineering year and semester",
              },
              {
                bg: "bg-blue-600",
                number: "2",
                title: "ACCESS CONTENT",
                desc: "Get syllabus, notes, and study materials",
              },
              {
                bg: "bg-yellow-500",
                number: "3",
                title: "STUDY WITH AI",
                desc: "Use AI tools to master your subjects",
                textColor: "text-black",
              },
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`${step.bg} border-8 border-black w-24 h-24 mx-auto mb-8 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}
                >
                  <span className={`${step.textColor || "text-white"} font-black text-4xl`}>{step.number}</span>
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase group-hover:scale-105 transition-transform duration-300">
                  {step.title}
                </h3>
                <p className="font-bold text-gray-700 text-lg">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-8">READY TO ACE YOUR EXAMS?</h2>

          <p className="text-xl md:text-2xl font-bold mb-16 text-gray-300">
            Join thousands of MU students already studying smarter
          </p>

          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-6 bg-yellow-500 text-black border-8 border-white px-20 py-8 font-black text-2xl md:text-3xl shadow-brutal-white hover:translate-y-2 hover:shadow-none transition-all relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">GET STARTED NOW</span>
            <ArrowRight className="h-8 w-8 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>

          <div className="mt-20 pt-8 border-t-4 border-white">
            <p className="font-bold text-gray-400 text-lg">Made with ❤️ for Mumbai University students</p>
          </div>
        </div>
      </section>
    </div>
  )
}
