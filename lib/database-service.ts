import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export class DatabaseService {
  // Syllabus methods
  static async getSyllabus(year: string, semester: number, branch: string) {
    try {
      let query = supabase
        .from("syllabus")
        .select("*")
        .eq("year", year)
        .eq("semester", semester)
      
      // Conditionally add branch filter for years other than FE
      if (year !== 'FE') {
          query = query.eq("branch", branch);
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching syllabus:", error)
      return []
    }
  }

  // PYQ methods
  static async getPYQs(semester: number, branch: string) {
    try {
      const { data, error } = await supabase
        .from("pyqs")
        .select("*")
        .eq("semester", semester)
        .eq("branch", branch)
        .order("exam_date", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching PYQs:", error)
      return []
    }
  }

  // PYQ Solutions methods
  static async getPYQSolutions(semester: number, branch: string) {
    try {
      const { data, error } = await supabase
        .from("pyq_solutions")
        .select("*")
        .eq("semester", semester)
        .eq("branch", branch)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching PYQ solutions:", error)
      return []
    }
  }

  // Question Banks methods
  static async getQuestionBanks(semester: number, branch: string) {
    try {
      const { data, error } = await supabase
        .from("question_banks")
        .select("*")
        .eq("semester", semester)
        .eq("branch", branch)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching question banks:", error)
      return []
    }
  }

  // Peer Notes methods
  static async getPeerNotes(semester: number, branch: string) {
    try {
      const { data, error } = await supabase
        .from("peer_notes")
        .select("*")
        .eq("semester", semester)
        .eq("branch", branch)
        .order("rating", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching peer notes:", error)
      return []
    }
  }

  // Unified resources method
  static async getAllResources(year: string, semester: number, branch: string) {
    try {
      const [syllabus, pyqs, pyqSolutions, questionBanks, peerNotes] = await Promise.all([
        this.getSyllabus(year, semester, branch),
        this.getPYQs(semester, branch),
        this.getPYQSolutions(semester, branch),
        this.getQuestionBanks(semester, branch),
        this.getPeerNotes(semester, branch),
      ])

      return {
        syllabus: syllabus.map((item) => ({ ...item, type: "syllabus" })),
        pyqs: pyqs.map((item) => ({ ...item, type: "pyq" })),
        pyq_solutions: pyqSolutions.map((item) => ({ ...item, type: "pyq_solutions" })),
        question_banks: questionBanks.map((item) => ({ ...item, type: "question_bank" })),
        peer_notes: peerNotes.map((item) => ({ ...item, type: "peer_notes" })),
      }
    } catch (error) {
      console.error("Error fetching all resources:", error)
      return {
        syllabus: [],
        pyqs: [],
        pyq_solutions: [],
        question_banks: [],
        peer_notes: [],
      }
    }
  }
}

// Export individual methods for easier importing
export const { getSyllabus, getPYQs, getPYQSolutions, getQuestionBanks, getPeerNotes, getAllResources } =
  DatabaseService
