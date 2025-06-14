-- ============================================================================
-- MUSTY STORAGE BUCKETS CREATION
-- ============================================================================

-- Note: Storage buckets are created via Supabase Dashboard or JavaScript API
-- This file contains the SQL policies for the buckets

-- ============================================================================
-- STORAGE BUCKET POLICIES
-- ============================================================================

-- 1. Syllabus bucket policies
INSERT INTO storage.buckets (id, name, public) 
VALUES ('syllabus', 'syllabus', true)
ON CONFLICT (id) DO NOTHING;

-- 2. PYQs bucket policies
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pyqs', 'pyqs', true)
ON CONFLICT (id) DO NOTHING;

-- 3. PYQ Solutions bucket policies
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pyq-solutions', 'pyq-solutions', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Question Banks bucket policies
INSERT INTO storage.buckets (id, name, public) 
VALUES ('question-banks', 'question-banks', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Peer Notes bucket policies
INSERT INTO storage.buckets (id, name, public) 
VALUES ('peer-notes', 'peer-notes', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Timetables bucket policies
INSERT INTO storage.buckets (id, name, public) 
VALUES ('timetables', 'timetables', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES FOR PUBLIC ACCESS
-- ============================================================================

-- Allow public read access to all buckets
CREATE POLICY "Public read access" ON storage.objects 
FOR SELECT USING (bucket_id IN ('syllabus', 'pyqs', 'pyq-solutions', 'question-banks', 'peer-notes', 'timetables'));

-- Allow authenticated users to upload (optional - for future use)
CREATE POLICY "Authenticated upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id IN ('peer-notes') AND auth.role() = 'authenticated');

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Check if all buckets were created
SELECT id, name, public FROM storage.buckets 
WHERE id IN ('syllabus', 'pyqs', 'pyq-solutions', 'question-banks', 'peer-notes', 'timetables');
