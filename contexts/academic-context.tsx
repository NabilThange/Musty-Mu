"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface AcademicInfo {
  year: string
  semester: string
  branch: string
  electives: string[]
}

interface AcademicContextType {
  academicInfo: AcademicInfo
  setAcademicInfo: (info: AcademicInfo) => void
  isContextSet: boolean
  clearContext: () => void
}

const defaultAcademicInfo: AcademicInfo = {
  year: "",
  semester: "",
  branch: "",
  electives: [],
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined)

export function AcademicProvider({ children }: { children: React.ReactNode }) {
  const [academicInfo, setAcademicInfoState] = useState<AcademicInfo>(defaultAcademicInfo)
  const [isContextSet, setIsContextSet] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("musty_academic_context")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setAcademicInfoState(parsed)
          setIsContextSet(true)
        } catch (error) {
          console.error("Error loading academic context:", error)
        }
      }
    }
  }, [])

  const setAcademicInfo = (info: AcademicInfo) => {
    setAcademicInfoState(info)
    setIsContextSet(true)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("musty_academic_context", JSON.stringify(info))
      localStorage.setItem("musty_returning_user", "true")
    }
  }

  const clearContext = () => {
    setAcademicInfoState(defaultAcademicInfo)
    setIsContextSet(false)

    if (typeof window !== "undefined") {
      localStorage.removeItem("musty_academic_context")
      localStorage.removeItem("musty_returning_user")
    }
  }

  return (
    <AcademicContext.Provider
      value={{
        academicInfo,
        setAcademicInfo,
        isContextSet,
        clearContext,
      }}
    >
      {children}
    </AcademicContext.Provider>
  )
}

export function useAcademicContext() {
  const context = useContext(AcademicContext)
  if (context === undefined) {
    throw new Error("useAcademicContext must be used within an AcademicProvider")
  }
  return context
}

// Academic data constants - Updated for Mumbai University B.E. structure
export const ACADEMIC_DATA = {
  years: [
    { value: "FE", label: "First Year (F.E.)" },
    { value: "SE", label: "Second Year (S.E.)" },
    { value: "TE", label: "Third Year (T.E.)" },
    { value: "BE", label: "Final Year (B.E.)" },
  ],

  // Semester mapping by year
  semestersByYear: {
    FE: [
      { value: "1", label: "Semester 1" },
      { value: "2", label: "Semester 2" },
    ],
    SE: [
      { value: "3", label: "Semester 3" },
      { value: "4", label: "Semester 4" },
    ],
    TE: [
      { value: "5", label: "Semester 5" },
      { value: "6", label: "Semester 6" },
    ],
    BE: [
      { value: "7", label: "Semester 7" },
      { value: "8", label: "Semester 8" },
    ],
  },

  // All Mumbai University B.E. branches
  branches: [
    { value: "AUTO", label: "Automobile Engineering" },
    { value: "BIOMED", label: "Biomedical Engineering" },
    { value: "BIOTECH", label: "Biotechnology" },
    { value: "CHEM", label: "Chemical Engineering" },
    { value: "CIVIL", label: "Civil Engineering" },
    { value: "COMP", label: "Computer Engineering" },
    { value: "ELEC", label: "Electrical Engineering" },
    { value: "ETRX", label: "Electronics Engineering" },
    { value: "EXTC", label: "Electronics & Telecommunication Engineering" },
    { value: "IT", label: "Information Technology" },
    { value: "INST", label: "Instrumentation Engineering" },
    { value: "MECH", label: "Mechanical Engineering" },
    { value: "MECA", label: "Mechatronics Engineering" },
    { value: "PRINT", label: "Printing & Packaging Technology" },
    { value: "PROD", label: "Production Engineering" },
    { value: "AIDS", label: "Artificial Intelligence and Data Science" },
    { value: "CYBER", label: "Cyber Security Engineering" },
    { value: "IOT", label: "Internet of Things (IoT) Engineering" },
    { value: "CIVIL_INFRA", label: "Civil & Infrastructure Engineering" },
  ],

  // Electives by year (more specialized in later years)
  electives: {
    FE: [], // No electives in first year - common curriculum
    SE: ["Advanced Mathematics", "Environmental Studies", "Engineering Economics", "Professional Communication"],
    TE: [
      "Machine Learning Fundamentals",
      "Web Development",
      "Mobile Computing",
      "Cyber Security Basics",
      "Data Analytics",
      "Cloud Computing Intro",
      "Entrepreneurship Development",
    ],
    BE: [
      "Advanced Artificial Intelligence",
      "Blockchain Technology",
      "Internet of Things",
      "Advanced Data Science",
      "Cloud Computing & DevOps",
      "Research Methodology",
      "Industry 4.0",
      "Project Management",
      "Innovation & Design Thinking",
    ],
  },
}

// Helper functions
export function getSemestersForYear(year: string) {
  return ACADEMIC_DATA.semestersByYear[year as keyof typeof ACADEMIC_DATA.semestersByYear] || []
}

export function isBranchSelectionRequired(year: string) {
  // Branches are only selected from Second Year onwards
  return year !== "FE"
}

export function getYearLabel(year: string) {
  const yearData = ACADEMIC_DATA.years.find((y) => y.value === year)
  return yearData?.label || year
}

export function getBranchLabel(branch: string) {
  const branchData = ACADEMIC_DATA.branches.find((b) => b.value === branch)
  return branchData?.label || branch
}
