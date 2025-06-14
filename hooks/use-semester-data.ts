"use client"

import { useState, useEffect } from "react"
import { DatabaseService } from "@/lib/database-service"

export function useSemesterData(semesterId?: string) {
  const [subjects, setSubjects] = useState<any[]>([])
  const [progress, setProgress] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSemesterData() {
      if (!semesterId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const [subjectsData, progressData] = await Promise.all([
          DatabaseService.getSubjectsForSemester(semesterId),
          DatabaseService.getUserProgressForSemester("public-user", semesterId),
        ])

        setSubjects(subjectsData)
        setProgress(progressData)

      } catch (err) {
        console.error("Error fetching semester data:", err)
        setError("Failed to load semester data")
      } finally {
        setLoading(false)
      }
    }

    fetchSemesterData()
  }, [semesterId])

  const progressStats = {
    totalTopics: progress.length,
    completedTopics: progress.filter((p) => p.is_completed).length,
    completionPercentage:
      progress.length > 0 ? Math.round((progress.filter((p) => p.is_completed).length / progress.length) * 100) : 0,
  }

  return {
    subjects,
    progress,
    progressStats,
    loading,
    error,
  }
}
