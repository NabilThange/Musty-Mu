-- ============================================================================
-- JAVASCRIPT CODE TO CREATE STORAGE BUCKETS
-- ============================================================================

-- Note: This SQL file contains JavaScript code that should be run in the browser console
-- or in a Node.js script to create the storage buckets

/*
// Run this JavaScript code in your browser console while logged into Supabase Dashboard
// or in a Node.js script with Supabase client

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseServiceKey = 'YOUR_SERVICE_ROLE_KEY' // Use service role key for admin operations

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAllBuckets() {
  const buckets = [
    { name: 'syllabus', public: true },
    { name: 'pyqs', public: true },
    { name: 'pyq-solutions', public: true },
    { name: 'question-banks', public: true },
    { name: 'peer-notes', public: true },
    { name: 'timetables', public: true }
  ]

  for (const bucket of buckets) {
    try {
      const { data, error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        fileSizeLimit: 50 * 1024 * 1024, // 50MB
        allowedMimeTypes: ['application/pdf']
      })

      if (error) {
        console.error(`Error creating bucket ${bucket.name}:`, error)
      } else {
        console.log(`✅ Bucket ${bucket.name} created successfully`)
      }
    } catch (err) {
      console.error(`Failed to create bucket ${bucket.name}:`, err)
    }
  }
}

// Run the function
createAllBuckets()

*/

-- ============================================================================
-- ALTERNATIVE: SQL COMMANDS TO INSERT BUCKET RECORDS
-- ============================================================================

-- Insert bucket records directly (if the above JavaScript doesn't work)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
('syllabus', 'syllabus', true, 52428800, ARRAY['application/pdf']),
('pyqs', 'pyqs', true, 52428800, ARRAY['application/pdf']),
('pyq-solutions', 'pyq-solutions', true, 52428800, ARRAY['application/pdf']),
('question-banks', 'question-banks', true, 52428800, ARRAY['application/pdf']),
('peer-notes', 'peer-notes', true, 52428800, ARRAY['application/pdf']),
('timetables', 'timetables', true, 52428800, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for public access
CREATE POLICY "Public read access for syllabus" ON storage.objects 
FOR SELECT USING (bucket_id = 'syllabus');

CREATE POLICY "Public read access for pyqs" ON storage.objects 
FOR SELECT USING (bucket_id = 'pyqs');

CREATE POLICY "Public read access for pyq-solutions" ON storage.objects 
FOR SELECT USING (bucket_id = 'pyq-solutions');

CREATE POLICY "Public read access for question-banks" ON storage.objects 
FOR SELECT USING (bucket_id = 'question-banks');

CREATE POLICY "Public read access for peer-notes" ON storage.objects 
FOR SELECT USING (bucket_id = 'peer-notes');

CREATE POLICY "Public read access for timetables" ON storage.objects 
FOR SELECT USING (bucket_id = 'timetables');

-- Allow authenticated users to upload to peer-notes (for future use)
CREATE POLICY "Authenticated upload to peer-notes" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'peer-notes' AND auth.role() = 'authenticated');
