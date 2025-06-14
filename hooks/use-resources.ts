"use client"

import { useState, useEffect } from "react"
import { DatabaseService } from "@/lib/database-service"

export type ResourceType = "syllabus" | "pyqs" | "pyq_solutions" | "question_banks" | "peer_notes" | "all"

export interface AcademicContext {
  year: string
  semester: number
  branch: string
}

export interface UseResourcesResult {
  data: any[] | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useResources(type: ResourceType, context: AcademicContext): UseResourcesResult {
  const [data, setData] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      let result: any[] = []

      // Always fetch from database
      switch (type) {
        case "syllabus":
          result = await DatabaseService.getSyllabus(context.year, context.semester, context.branch)
          break
        case "pyqs":
          result = await DatabaseService.getPYQs(context.semester, context.branch)
          break
        case "pyq_solutions":
          result = await DatabaseService.getPYQSolutions(context.semester, context.branch)
          break
        case "question_banks":
          result = await DatabaseService.getQuestionBanks(context.semester, context.branch)
          break
        case "peer_notes":
          result = await DatabaseService.getPeerNotes(context.semester, context.branch)
          break
        case "all":
          const allData = await DatabaseService.getAllResources(context.year, context.semester, context.branch)
          result = [
            ...allData.syllabus,
            ...allData.pyqs,
            ...allData.pyq_solutions,
            ...allData.question_banks,
            ...allData.peer_notes,
          ]
          break
        default:
          throw new Error(`Unknown resource type: ${type}`)
      }

      setData(result)
    } catch (err) {
      console.error(`Error in useResources for ${type}:`, err)
      setError(err instanceof Error ? err : new Error("Unknown error"))
      // Set data to empty array on error instead of mock data
      setData([])
    } finally {
      setIsLoading(false)
    }
  }

  const refetch = () => {
    fetchData()
  }

  useEffect(() => {
    // Only fetch if context is fully set or if it's syllabus for FE year
    if (context.year && context.semester && (context.branch || context.year === 'FE')) {
      console.log("Fetching resources with context:", context);
      fetchData()
    } else {
      // Reset data if context is not fully set
      console.log("Academic context not fully set, not fetching:", context);
      setData([])
      setIsLoading(false)
    }
  }, [type, context.year, context.semester, context.branch])

  return { data, isLoading, error, refetch }
}
