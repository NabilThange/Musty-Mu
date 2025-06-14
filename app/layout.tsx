import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AcademicProvider } from "@/contexts/academic-context"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { CustomCursor } from "@/components/ui/custom-cursor"
import { StagewiseToolbar } from '@stagewise/toolbar-next'
import { ReactPlugin } from '@stagewise-plugins/react'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

// Update the metadata for MUSTY
export const metadata: Metadata = {
  title: "MUSTY - AI Study Companion for Mumbai University",
  description:
    "Free AI-powered study platform with syllabus PDFs, flashcards, quizzes & mindmaps for Mumbai University students",
  keywords: "Mumbai University, study, AI, syllabus, flashcards, quiz, mindmap, education",
  generator: 'v0.dev',
  authors: [{ name: 'MUSTY Team' }],
  creator: 'MUSTY Development Team',
  publisher: 'MUSTY',
  icons: {
    icon: '/images/musty-logo.png',
    shortcut: '/images/musty-logo.png',
    apple: '/images/musty-logo.png',
  },
  openGraph: {
    title: 'MUSTY - AI Study Companion',
    description: 'Free AI-powered study platform for Mumbai University students',
    images: ['/images/musty-logo.png'],
    type: 'website',
    url: 'https://musty.study',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MUSTY - AI Study Companion',
    description: 'Free AI-powered study platform for Mumbai University students',
    images: ['/images/musty-logo.png'],
  },
}

const stagewiseConfig = {
  plugins: [ReactPlugin],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body className={inter.className} data-gptw="">
        <AcademicProvider>
          <ThemeProvider attribute="class" forcedTheme="dark" enableSystem={false} disableTransitionOnChange>
            <CustomCursor />
            {children}
          </ThemeProvider>
        </AcademicProvider>
        <StagewiseToolbar config={stagewiseConfig} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
