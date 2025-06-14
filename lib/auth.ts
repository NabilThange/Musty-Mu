// Simple utility functions for the new MUSTY architecture
// No authentication required - everything is public

export interface User {
  id: string
  name: string
  academic_context?: {
    year: string
    semester: string
    branch: string
  }
}

// Legacy compatibility - these functions now return mock data or handle localStorage
export const authService = {
  // Mock user for any legacy components that might still reference it
  getCurrentUser: (): User | null => {
    return {
      id: "public-user",
      name: "Student",
      academic_context: JSON.parse(localStorage.getItem("musty_academic_context") || "{}"),
    }
  },

  // Always return true since everything is public now
  isAuthenticated: (): boolean => {
    return true
  },

  // No-op logout
  logout: (): void => {
    // Clear academic context if needed
    localStorage.removeItem("musty_academic_context")
    localStorage.removeItem("musty_returning_user")
  },
}
