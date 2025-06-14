-- MUSTY Database Schema for Supabase
-- Simplified schema focused on core functionality

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Subjects table (core data)
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  year VARCHAR(10) NOT NULL, -- FY, SY, TY, BE
  semester VARCHAR(10) NOT NULL, -- 1, 2
  branch VARCHAR(50) NOT NULL, -- COMP, IT, EXTC, etc.
  credits INTEGER NOT NULL DEFAULT 3,
  type VARCHAR(20) NOT NULL CHECK (type IN ('core', 'elective')),
  syllabus_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study resources table (PYQs, notes, question banks)
CREATE TABLE IF NOT EXISTS study_resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('pyq', 'notes', 'question_bank')),
  subject_code VARCHAR(50) REFERENCES subjects(code) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  uploader_name VARCHAR(255),
  year VARCHAR(10), -- For PYQs
  exam_type VARCHAR(50), -- Mid-Sem, End-Sem, etc.
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI sessions table (for analytics and usage tracking)
CREATE TABLE IF NOT EXISTS ai_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  mode VARCHAR(50) NOT NULL CHECK (mode IN ('chat', 'flashcards', 'quiz', 'mindmap')),
  context_type VARCHAR(50) NOT NULL CHECK (context_type IN ('syllabus', 'upload')),
  academic_context JSONB NOT NULL, -- {year, semester, branch}
  subject_code VARCHAR(50),
  interaction_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences (optional, for returning users)
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_identifier VARCHAR(255) NOT NULL, -- Could be IP hash or localStorage ID
  academic_context JSONB NOT NULL,
  last_visited TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  visit_count INTEGER DEFAULT 1
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subjects_academic ON subjects(year, semester, branch);
CREATE INDEX IF NOT EXISTS idx_subjects_code ON subjects(code);
CREATE INDEX IF NOT EXISTS idx_study_resources_subject ON study_resources(subject_code);
CREATE INDEX IF NOT EXISTS idx_study_resources_type ON study_resources(type);
CREATE INDEX IF NOT EXISTS idx_ai_sessions_created ON ai_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_sessions_mode ON ai_sessions(mode);

-- Insert sample data for Computer Engineering
INSERT INTO subjects (name, code, year, semester, branch, credits, type, syllabus_url, description) VALUES
-- First Year Computer Engineering
('Engineering Mathematics I', 'FEC101', 'FY', '1', 'COMP', 4, 'core', '/pdfs/engineering-math-1.pdf', 'Calculus, Linear Algebra, Differential Equations'),
('Programming Fundamentals', 'PCC101', 'FY', '1', 'COMP', 4, 'core', '/pdfs/programming-fundamentals.pdf', 'C Programming, Data Types, Control Structures'),
('Digital Logic Design', 'PCC102', 'FY', '1', 'COMP', 3, 'core', '/pdfs/digital-logic.pdf', 'Boolean Algebra, Logic Gates, Sequential Circuits'),
('Communication Skills', 'BSC101', 'FY', '1', 'COMP', 2, 'core', '/pdfs/communication-skills.pdf', 'Technical Writing, Presentation Skills'),
('Engineering Physics', 'BSC102', 'FY', '1', 'COMP', 3, 'core', '/pdfs/engineering-physics.pdf', 'Mechanics, Thermodynamics, Optics'),

-- Second Year Computer Engineering
('Engineering Mathematics II', 'FEC102', 'FY', '2', 'COMP', 4, 'core', '/pdfs/engineering-math-2.pdf', 'Complex Analysis, Probability, Statistics'),
('Data Structures', 'PCC201', 'SY', '1', 'COMP', 4, 'core', '/pdfs/data-structures.pdf', 'Arrays, Linked Lists, Trees, Graphs'),
('Computer Graphics', 'PCC202', 'SY', '1', 'COMP', 3, 'core', '/pdfs/computer-graphics.pdf', '2D/3D Graphics, Transformations, Rendering'),
('Operating Systems', 'PCC203', 'SY', '2', 'COMP', 4, 'core', '/pdfs/operating-systems.pdf', 'Process Management, Memory Management, File Systems'),
('Computer Networks', 'PCC204', 'SY', '2', 'COMP', 4, 'core', '/pdfs/computer-networks.pdf', 'OSI Model, TCP/IP, Network Protocols'),

-- Third Year Computer Engineering
('Database Management', 'PCC301', 'TY', '1', 'COMP', 4, 'core', '/pdfs/database-management.pdf', 'SQL, Normalization, Transaction Management'),
('Software Engineering', 'PCC302', 'TY', '1', 'COMP', 4, 'core', '/pdfs/software-engineering.pdf', 'SDLC, Design Patterns, Testing'),
('Web Technologies', 'PCC303', 'TY', '2', 'COMP', 3, 'core', '/pdfs/web-technologies.pdf', 'HTML, CSS, JavaScript, Frameworks'),
('Compiler Design', 'PCC304', 'TY', '2', 'COMP', 4, 'core', '/pdfs/compiler-design.pdf', 'Lexical Analysis, Parsing, Code Generation'),

-- Final Year Computer Engineering
('Machine Learning', 'PCC401', 'BE', '1', 'COMP', 4, 'elective', '/pdfs/machine-learning.pdf', 'Supervised Learning, Neural Networks, Deep Learning'),
('Artificial Intelligence', 'PCC402', 'BE', '1', 'COMP', 4, 'elective', '/pdfs/artificial-intelligence.pdf', 'Search Algorithms, Knowledge Representation'),
('Blockchain Technology', 'PCC403', 'BE', '2', 'COMP', 3, 'elective', '/pdfs/blockchain.pdf', 'Cryptocurrency, Smart Contracts, DApps'),
('Cloud Computing', 'PCC404', 'BE', '2', 'COMP', 3, 'elective', '/pdfs/cloud-computing.pdf', 'AWS, Azure, Distributed Systems');

-- Insert sample study resources
INSERT INTO study_resources (title, type, subject_code, file_url, uploader_name, year, exam_type) VALUES
('Programming Fundamentals PYQ 2023', 'pyq', 'PCC101', '/pdfs/pyq-programming-2023.pdf', 'Student Community', '2023', 'Mid-Sem'),
('Data Structures Complete Notes', 'notes', 'PCC201', '/pdfs/notes-data-structures.pdf', 'Rahul Sharma', NULL, NULL),
('Database MCQ Question Bank', 'question_bank', 'PCC301', '/pdfs/mcq-database.pdf', 'Priya Patel', NULL, NULL),
('Digital Logic PYQ 2022', 'pyq', 'PCC102', '/pdfs/pyq-digital-logic-2022.pdf', 'Student Community', '2022', 'End-Sem'),
('Computer Graphics Lab Manual', 'notes', 'PCC202', '/pdfs/cg-lab-manual.pdf', 'Lab Instructor', NULL, NULL),
('Operating Systems Practice Questions', 'question_bank', 'PCC203', '/pdfs/os-practice.pdf', 'Study Group', NULL, NULL),
('Machine Learning PYQ 2023', 'pyq', 'PCC401', '/pdfs/pyq-ml-2023.pdf', 'Student Community', '2023', 'End-Sem'),
('Web Technologies Project Guide', 'notes', 'PCC303', '/pdfs/web-tech-projects.pdf', 'Faculty', NULL, NULL);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for subjects table
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optional, for future use)
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no auth required)
CREATE POLICY "Allow public read access on subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Allow public read access on study_resources" ON study_resources FOR SELECT USING (true);
CREATE POLICY "Allow public insert on ai_sessions" ON ai_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public access on user_preferences" ON user_preferences FOR ALL USING (true);
