"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  useAcademicContext,
  ACADEMIC_DATA,
  type AcademicInfo,
  getSemestersForYear,
  isBranchSelectionRequired,
} from "@/contexts/academic-context"
import { Check, AlertCircle } from "lucide-react"

interface AcademicSelectorProps {
  onComplete?: () => void
  showAsModal?: boolean
}

export function AcademicSelector({ onComplete, showAsModal = false }: AcademicSelectorProps) {
  const { academicInfo, setAcademicInfo } = useAcademicContext()
  const [tempInfo, setTempInfo] = useState<AcademicInfo>(academicInfo)

  const handleSave = () => {
    setAcademicInfo(tempInfo)
    onComplete?.()
  }

  // Validation logic
  const isYearSelected = tempInfo.year !== ""
  const isSemesterSelected = tempInfo.semester !== ""
  const isBranchRequired = isBranchSelectionRequired(tempInfo.year)
  const isBranchSelected = !isBranchRequired || tempInfo.branch !== ""
  const isComplete = isYearSelected && isSemesterSelected && isBranchSelected

  // Get available semesters for selected year
  const availableSemesters = getSemestersForYear(tempInfo.year)

  // Reset semester and branch when year changes
  const handleYearChange = (year: string) => {
    setTempInfo({
      ...tempInfo,
      year,
      semester: "",
      branch: isBranchSelectionRequired(year) ? tempInfo.branch : "",
      electives: [],
    })
  }

  const containerClass = showAsModal
    ? "bg-white border-8 border-black p-8 shadow-brutal max-w-3xl mx-auto"
    : "bg-white border-8 border-black p-8 shadow-brutal"

  return (
    <div className={containerClass}>
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-4 text-black">SELECT YOUR ACADEMICS</h2>
        <p className="text-lg font-bold text-gray-600">Choose your year & semester to get personalized content</p>
      </div>

      <div className="space-y-8">
        {/* Year Selection */}
        <div className="space-y-4">
          <h3 className="text-xl font-black uppercase border-b-4 border-black pb-2 text-black">📚 YEAR OF STUDY</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ACADEMIC_DATA.years.map((year) => (
              <button
                key={year.value}
                onClick={() => handleYearChange(year.value)}
                className={`p-4 border-4 border-black font-bold text-center transition-all ${
                  tempInfo.year === year.value ? "bg-blue-600 text-white shadow-brutal" : "bg-white hover:bg-gray-100 text-black"
                }`}
              >
                {year.label}
              </button>
            ))}
          </div>
        </div>

        {/* Semester Selection */}
        {isYearSelected && (
          <div className="space-y-4">
            <h3 className="text-xl font-black uppercase border-b-4 border-black pb-2 text-black">📅 SEMESTER</h3>
            <div className="grid grid-cols-2 gap-4">
              {availableSemesters.map((semester) => (
                <button
                  key={semester.value}
                  onClick={() => setTempInfo({ ...tempInfo, semester: semester.value })}
                  className={`p-4 border-4 border-black font-bold text-center transition-all ${
                    tempInfo.semester === semester.value
                      ? "bg-red-600 text-white shadow-brutal"
                      : "bg-white hover:bg-gray-100 text-black"
                  }`}
                >
                  {semester.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Branch Selection - Only for SE, TE, BE */}
        {isSemesterSelected && isBranchRequired && (
          <div className="space-y-4">
            <h3 className="text-xl font-black uppercase border-b-4 border-black pb-2 text-black">🔧 ENGINEERING BRANCH</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {ACADEMIC_DATA.branches.map((branch) => (
                <button
                  key={branch.value}
                  onClick={() => setTempInfo({ ...tempInfo, branch: branch.value })}
                  className={`p-4 border-4 border-black font-bold text-left transition-all ${
                    tempInfo.branch === branch.value
                      ? "bg-yellow-500 text-black shadow-brutal"
                      : "bg-white hover:bg-gray-100 text-black"
                  }`}
                >
                  <div className="text-sm font-black text-gray-600">{branch.value}</div>
                  <div className="text-sm">{branch.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* First Year Notice */}
        {tempInfo.year === "FE" && isSemesterSelected && (
          <div className="bg-blue-100 border-4 border-blue-600 p-6 space-y-2">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-blue-600" />
              <h4 className="font-black text-blue-800 uppercase">First Year - Common Curriculum</h4>
            </div>
            <p className="font-bold text-blue-700">
              All F.E. students follow the same curriculum regardless of future branch preference. Branch selection
              happens in Second Year (S.E.).
            </p>
          </div>
        )}

        {/* Electives Selection */}
        {isComplete && ACADEMIC_DATA.electives[tempInfo.year as keyof typeof ACADEMIC_DATA.electives]?.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-black uppercase border-b-4 border-black pb-2 text-black">⭐ ELECTIVES (OPTIONAL)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACADEMIC_DATA.electives[tempInfo.year as keyof typeof ACADEMIC_DATA.electives].map((elective) => (
                <button
                  key={elective}
                  onClick={() => {
                    const newElectives = tempInfo.electives.includes(elective)
                      ? tempInfo.electives.filter((e) => e !== elective)
                      : [...tempInfo.electives, elective]
                    setTempInfo({ ...tempInfo, electives: newElectives })
                  }}
                  className={`p-4 border-4 border-black font-bold text-left transition-all ${
                    tempInfo.electives.includes(elective)
                      ? "bg-green-600 text-white shadow-brutal"
                      : "bg-white hover:bg-gray-100 text-black"
                  }`}
                >
                  {tempInfo.electives.includes(elective) && <Check className="inline h-5 w-5 mr-2" />}
                  {elective}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        {isComplete && (
          <div className="pt-8 border-t-4 border-black">
            <Button
              onClick={handleSave}
              className="w-full bg-green-600 hover:bg-green-500 text-white border-4 border-black font-black text-xl py-6 shadow-brutal hover:translate-y-1 hover:shadow-none transition-all"
            >
              <Check className="h-6 w-6 mr-3" />
              SAVE & CONTINUE
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export function AcademicSelectorModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="max-w-5xl w-full max-h-[calc(100vh-2rem)] overflow-y-auto">
        <AcademicSelector onComplete={onClose} showAsModal />
      </div>
    </div>
  )
}
