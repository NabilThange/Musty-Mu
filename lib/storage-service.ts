import { supabase } from "./supabase"

// ============================================================================
// STORAGE SERVICE FOR FILE MANAGEMENT
// ============================================================================

export class StorageService {
  // ============================================================================
  // UPLOAD METHODS
  // ============================================================================

  static async uploadFile(
    bucket: string,
    filePath: string,
    file: File,
  ): Promise<{ url: string | null; error: string | null }> {
    try {
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        return { url: null, error: error.message }
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath)

      return { url: urlData.publicUrl, error: null }
    } catch (error) {
      return { url: null, error: `Upload failed: ${error}` }
    }
  }

  // ============================================================================
  // DOWNLOAD METHODS
  // ============================================================================

  static async getFileUrl(bucket: string, filePath: string): Promise<string | null> {
    try {
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error("Error getting file URL:", error)
      return null
    }
  }

  static async downloadFile(bucket: string, filePath: string): Promise<Blob | null> {
    try {
      const { data, error } = await supabase.storage.from(bucket).download(filePath)

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error downloading file:", error)
      return null
    }
  }

  // ============================================================================
  // DELETE METHODS
  // ============================================================================

  static async deleteFile(bucket: string, filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([filePath])

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting file:", error)
      return false
    }
  }

  // ============================================================================
  // LIST METHODS
  // ============================================================================

  static async listFiles(bucket: string, folder?: string): Promise<any[]> {
    try {
      const { data, error } = await supabase.storage.from(bucket).list(folder, {
        limit: 100,
        offset: 0,
      })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error listing files:", error)
      return []
    }
  }

  // ============================================================================
  // BUCKET MANAGEMENT
  // ============================================================================

  static async createBucket(bucketName: string, isPublic = true): Promise<boolean> {
    try {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
        fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
        allowedMimeTypes: ["application/pdf"],
      })

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error creating bucket:", error)
      return false
    }
  }

  static async getBuckets(): Promise<any[]> {
    try {
      const { data, error } = await supabase.storage.listBuckets()

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error getting buckets:", error)
      return []
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  static generateFilePath(
    type: "syllabus" | "pyqs" | "pyq-solutions" | "question-banks" | "peer-notes" | "timetables",
    semester: number,
    branch: string,
    filename: string,
  ): string {
    const timestamp = Date.now()
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_")
    return `${type}/${branch}/sem${semester}/${timestamp}_${cleanFilename}`
  }

  static validatePDFFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (file.type !== "application/pdf") {
      return { valid: false, error: "Only PDF files are allowed" }
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return { valid: false, error: "File size must be less than 50MB" }
    }

    return { valid: true }
  }
}
