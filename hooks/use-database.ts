"use client"

import { useState, useEffect } from "react"
import { DatabaseService } from "@/lib/database-service"
import { useAcademicContext } from "../contexts/academic-context"

// Hook for user progress
export function useUserProgress(subjectId?: string) {
  const [progress, setProgress] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProgress() {
      if (!subjectId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await DatabaseService.getUserProgress("public-user", subjectId)
        setProgress(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching progress:", err)
        setError("Failed to load progress")
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [subjectId])

  const markTopicComplete = async (topicId: string) => {
    try {
      await DatabaseService.markTopicComplete("public-user", topicId)
      const data = await DatabaseService.getUserProgress("public-user", subjectId!)
      setProgress(data)
    } catch (err) {
      console.error("Error marking topic complete:", err)
    }
  }

  return { progress, loading, error, markTopicComplete }
}

// Hook for user subjects
export function useUserSubjects() {
  const { academicInfo, isContextSet } = useAcademicContext()
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubjects() {
      if (!isContextSet || !academicInfo.year || !academicInfo.semester || !academicInfo.branch) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await DatabaseService.getSubjects(
          academicInfo.year,
          academicInfo.semester,
          academicInfo.branch
        )
        setSubjects(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching subjects:", err)
        setError("Failed to load subjects")
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [isContextSet, academicInfo.year, academicInfo.semester, academicInfo.branch])

  return { subjects, loading, error }
}

// Hook for notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoading(true)
        const data = await DatabaseService.getUserNotifications("public-user")
        setNotifications(data)
        setUnreadCount(data.filter((n: any) => !n.is_read).length)
      } catch (err) {
        console.error("Error fetching notifications:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const markAsRead = async (notificationId: string) => {
    try {
      await DatabaseService.markNotificationRead(notificationId)
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (err) {
      console.error("Error marking notification as read:", err)
    }
  }

  return { notifications, loading, unreadCount, markAsRead }
}

// Hook for study streak
export function useStudyStreak() {
  const [streak, setStreak] = useState<any[]>([])
  const [currentStreak, setCurrentStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStreak() {
      try {
        setLoading(true)
        const data = await DatabaseService.getUserStudyStreak("public-user")
        setStreak(data)

        if (data.length > 0) {
          setCurrentStreak(data[0].streak_count || 0)
        }
      } catch (err) {
        console.error("Error fetching study streak:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStreak()
  }, [])

  const updateStreak = async (studyData: {
    minutes_studied: number
    topics_completed: number
    assignments_submitted: number
  }) => {
    try {
      await DatabaseService.updateStudyStreak("public-user", studyData)
      const data = await DatabaseService.getUserStudyStreak("public-user")
      setStreak(data)
      if (data.length > 0) {
        setCurrentStreak(data[0].streak_count || 0)
      }
    } catch (err) {
      console.error("Error updating study streak:", err)
    }
  }

  return { streak, currentStreak, loading, updateStreak }
}

// Hook for assignments
export function useAssignments(subjectId?: string) {
  const [assignments, setAssignments] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAssignments() {
      if (!subjectId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const [assignmentData, submissionData] = await Promise.all([
          DatabaseService.getAssignmentsForSubject(subjectId),
          DatabaseService.getUserAssignmentSubmissions("public-user", subjectId),
        ])

        setAssignments(assignmentData)
        setSubmissions(submissionData)
      } catch (err) {
        console.error("Error fetching assignments:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [subjectId])

  const submitAssignment = async (assignmentId: string, submissionData: any) => {
    try {
      await DatabaseService.submitAssignment({
        user_id: "public-user",
        assignment_id: assignmentId,
        ...submissionData,
      })

      const submissionData2 = await DatabaseService.getUserAssignmentSubmissions("public-user", subjectId!)
      setSubmissions(submissionData2)
    } catch (err) {
      console.error("Error submitting assignment:", err)
      throw err
    }
  }

  return { assignments, submissions, loading, submitAssignment }
}
