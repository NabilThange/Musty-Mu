"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export function DatabaseStatus() {
  const [status, setStatus] = useState<{
    connected: boolean
    userCount: number
    subjectCount: number
    loading: boolean
    error?: string
  }>({
    connected: false,
    userCount: 0,
    subjectCount: 0,
    loading: true,
  })

  useEffect(() => {
    async function checkDatabase() {
      try {
        // Test connection and get counts
        const [usersResult, subjectsResult] = await Promise.all([
          supabase.from("users").select("id", { count: "exact", head: true }),
          supabase.from("subjects").select("id", { count: "exact", head: true }),
        ])

        setStatus({
          connected: true,
          userCount: usersResult.count || 0,
          subjectCount: subjectsResult.count || 0,
          loading: false,
        })
      } catch (error) {
        console.error("Database check failed:", error)
        setStatus({
          connected: false,
          userCount: 0,
          subjectCount: 0,
          loading: false,
          error: "Connection failed",
        })
      }
    }

    checkDatabase()
  }, [])

  if (status.loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Checking database...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status.connected ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          Database Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Connection:</span>
            <span className={status.connected ? "text-green-600" : "text-red-600"}>
              {status.connected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Users:</span>
            <span>{status.userCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Subjects:</span>
            <span>{status.subjectCount}</span>
          </div>
          {status.error && <div className="text-red-600 text-sm mt-2">Error: {status.error}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
