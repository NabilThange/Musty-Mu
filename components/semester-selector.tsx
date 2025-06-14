"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { useAcademicContext } from "@/contexts/academic-context"
import { getUserAvailableSemesters } from "@/lib/semester-utils"

interface SemesterOption {
  id: string
  semester_number: number
  year_level: number
  year_label: string
  semester_label: string
}

interface SemesterSelectorProps {
  onSemesterChange: (semesterId: string, semesterInfo: SemesterOption) => void
  selectedSemesterId?: string
}

export function SemesterSelector({ onSemesterChange, selectedSemesterId }: SemesterSelectorProps) {
  const { academicInfo, isContextSet } = useAcademicContext()
  const [semesters, setSemesters] = useState<SemesterOption[]>([])
  const [availableSemesters, setAvailableSemesters] = useState<SemesterOption[]>([])
  const [selectedSemester, setSelectedSemester] = useState<SemesterOption | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSemesters() {
      if (!isContextSet || !academicInfo.year) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        const userYear = academicInfo.year || "FE"
        const availableMapping = getUserAvailableSemesters(userYear)

        if (!availableMapping) {
          setLoading(false)
          return
        }

        const semesterOptions = availableMapping.semesters.map((semNum, index) => ({
          id: `sem-${semNum}`,
          semester_number: semNum,
          year_level: semNum,
          year_label: availableMapping.yearLabel,
          semester_label: availableMapping.semesterLabels[index],
        }))

        setSemesters(semesterOptions)
        setAvailableSemesters(semesterOptions)

        const defaultSemester = selectedSemesterId
          ? semesterOptions.find((s) => s.id === selectedSemesterId)
          : semesterOptions.find((s) => s.semester_number === parseInt(academicInfo.semester)) || semesterOptions[0]

        if (defaultSemester) {
          setSelectedSemester(defaultSemester)
          onSemesterChange(defaultSemester.id, defaultSemester)
        }
      } catch (error) {
        console.error("Error fetching semesters:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSemesters()
  }, [isContextSet, academicInfo.year, academicInfo.semester, selectedSemesterId])

  const handleSemesterChange = (semesterId: string) => {
    const semester = availableSemesters.find((s) => s.id === semesterId)
    if (semester) {
      setSelectedSemester(semester)
      onSemesterChange(semesterId, semester)
      localStorage.setItem("selected_semester_id", semesterId)
    }
  }

  if (loading) {
    return (
      <div className="bg-white border-4 border-black p-4 shadow-brutal">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    )
  }

  if (availableSemesters.length === 0) {
    return (
      <div className="bg-white border-4 border-black p-4 shadow-brutal">
        <p className="font-bold text-gray-600">No semesters available</p>
      </div>
    )
  }

  return (
    <div className="bg-white border-4 border-black p-4 shadow-brutal">
      <label className="block text-sm font-bold text-gray-700 mb-2">SELECT SEMESTER</label>
      <div className="relative">
        <select
          value={selectedSemester?.id || ""}
          onChange={(e) => handleSemesterChange(e.target.value)}
          className="w-full h-12 px-4 pr-10 bg-white border-4 border-black font-mono font-bold text-lg appearance-none focus:outline-none focus:border-blue-600 shadow-brutal"
        >
          {availableSemesters.map((semester) => (
            <option key={semester.id} value={semester.id}>
              {semester.year_label} - {semester.semester_label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 pointer-events-none" />
      </div>

      {selectedSemester && (
        <div className="mt-3 p-3 bg-gray-100 border-2 border-black">
          <p className="text-sm font-bold">
            📚 Showing: <span className="text-blue-600">{selectedSemester.semester_label}</span>
          </p>
          <p className="text-xs text-gray-600">
            Academic Year: {selectedSemester.year_label} | Available:{" "}
            {availableSemesters.map((s) => s.semester_label).join(", ")}
          </p>
        </div>
      )}
    </div>
  )
}
