'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import { useAcademicContext } from '@/contexts/academic-context'
import { AcademicSelector, AcademicSelectorModal } from '@/components/academic-selector'
import CourseCard from '@/components/course-card'
import { useParams } from 'next/navigation'

interface CourseDetails {
  id: string;
  name: string;
  icon: string;
  professor: string;
  email: string;
  website: string;
  courseCode: string;
  status: 'Not started' | 'Ongoing' | 'Done';
}

interface Topic {
  id: string;
  name: string;
  date: string;
  mastery: 'Not started' | 'Learning' | 'Mastered';
  details: string;
}

interface ReviewItem {
  id: string;
  topicName: string;
  lastReviewed: string;
  reviewNotes: string;
}

interface Assignment {
  id: string;
  name: string;
  dueDate: string;
  status: 'Pending' | 'Completed' | 'Overdue';
  submissionLink: string;
}

interface Exam {
  id: string;
  name: string;
  date: string;
  syllabus: string;
  prepStatus: 'Not started' | 'Studying' | 'Ready';
}

interface AnalyticsData {
  id: string;
  subject: string;
  topicMastered: number;
  score: number;
}

// Mock Data (placeholder for actual fetching)
const mockCourseDetails: Record<string, CourseDetails> = {
  'iit-indore': {
    id: 'iit-indore',
    name: 'IIT INDORE',
    icon: '📚',
    professor: 'Dr. Ananya Sharma',
    email: 'ananya.sharma@iiti.ac.in',
    website: 'https://lms.iiti.ac.in/cs201',
    courseCode: 'CS201',
    status: 'Ongoing',
  },
  'math-101': {
    id: 'math-101',
    name: 'MATHEMATICS I',
    icon: '➕',
    professor: 'Prof. Rajesh Kumar',
    email: 'rajesh.kumar@university.edu',
    website: 'https://mathdept.university.edu/m101',
    courseCode: 'MA101',
    status: 'Not started',
  },
};

const mockTopics: Record<string, Topic[]> = {
  'iit-indore': [
    { id: 't1', name: 'Introduction to Algorithms', date: '2026-06-01', mastery: 'Mastered', details: 'Covered basics of algorithm analysis.' },
    { id: 't2', name: 'Data Structures', date: '2026-06-08', mastery: 'Learning', details: 'Focus on linked lists and arrays.' },
    { id: 't3', name: 'Graph Algorithms', date: '2026-06-15', mastery: 'Not started', details: 'Introduction to BFS and DFS.' },
  ],
  'math-101': [
    { id: 't4', name: 'Calculus Fundamentals', date: '2026-07-01', mastery: 'Not started', details: 'Limits, derivatives, and integrals.' },
  ],
};

const mockReviews: Record<string, ReviewItem[]> = {
  'iit-indore': [
    { id: 'r1', topicName: 'Introduction to Algorithms', lastReviewed: '2026-06-05', reviewNotes: 'Need to re-check time complexity for sorting algorithms.' },
  ],
  'math-101': [],
};

const mockAssignments: Record<string, Assignment[]> = {
  'iit-indore': [
    { id: 'a1', name: 'Assignment 1: Sorting', dueDate: '2026-06-10', status: 'Completed', submissionLink: 'https://lms.iiti.ac.in/assignment1' },
    { id: 'a2', name: 'Assignment 2: Trees', dueDate: '2026-06-17', status: 'Pending', submissionLink: '' },
  ],
  'math-101': [
    { id: 'a3', name: 'Problem Set 1', dueDate: '2026-07-15', status: 'Pending', submissionLink: '' },
  ],
};

const mockExams: Record<string, Exam[]> = {
  'iit-indore': [
    { id: 'e1', name: 'Midterm Exam', date: '2026-06-25', syllabus: 'Modules 1-5', prepStatus: 'Studying' },
  ],
  'math-101': [],
};

const mockAnalytics: Record<string, AnalyticsData[]> = {
  'iit-indore': [
    { id: 'an1', subject: 'Algorithms', topicMastered: 70, score: 85 },
  ],
  'math-101': [],
};

export default function StudyPage() {
  const { academicInfo, isContextSet, clearContext } = useAcademicContext()
  const [showSelector, setShowSelector] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false)
  const [showChangeCoverButton, setShowChangeCoverButton] = useState(false);

  const params = useParams();
  const courseId = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId;

  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [activeTab, setActiveTab] = useState<string>('Topics');

  useEffect(() => {
    if (!isContextSet) {
      setShowSelector(true)
    }
  }, [isContextSet])

  useEffect(() => {
    if (courseId) {
      setCourseDetails(mockCourseDetails[courseId] || null);
      setTopics(mockTopics[courseId] || []);
      setReviews(mockReviews[courseId] || []);
      setAssignments(mockAssignments[courseId] || []);
      setExams(mockExams[courseId] || []);
      setAnalytics(mockAnalytics[courseId] || []);
    }
  }, [courseId, isContextSet])

  const handleChangeCover = () => {
    console.log("Change cover clicked!");
  };

  const renderTitle = () => {
    if (isEditingTitle) {
      return (
        <input
          type="text"
          value={courseDetails?.name || ''}
          onChange={(e) => setCourseDetails(prev => prev ? { ...prev, name: e.target.value } : null)}
          onBlur={() => setIsEditingTitle(false)}
          onKeyDown={(e) => { if (e.key === 'Enter') setIsEditingTitle(false); }}
          className="font-mono text-4xl font-black uppercase tracking-tighter text-black bg-transparent border-none outline-none w-full"
          autoFocus
        />
      )
    } else {
      return (
        <h1 className="font-mono text-4xl font-black uppercase tracking-tighter text-black" onClick={() => setIsEditingTitle(true)}>
          {courseDetails?.name || 'Loading Course...'}
        </h1>
      )
    }
  }

  if (!isContextSet) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white font-mono px-4">
        <AcademicSelector onComplete={() => setShowSelector(false)} />
      </div>
    )
  }

  if (!courseDetails) {
    return (
      <div className="min-h-screen bg-white font-mono flex items-center justify-center">
        <p className="text-black font-black text-2xl uppercase">Course Not Found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-mono">
      <Navbar onShowChangeClick={() => setShowSelector(true)} />

      {/* Cover Image */}
      <div
        className="w-full h-48 bg-gray-200 flex items-center justify-center border-b-8 border-black relative overflow-hidden"
        onMouseEnter={() => setShowChangeCoverButton(true)}
        onMouseLeave={() => setShowChangeCoverButton(false)}
      >
        <img
          src={`/images/course-covers/${courseId}.png`}
          alt={`${courseDetails.name} banner`}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        
        {showChangeCoverButton && (
          <button
            onClick={handleChangeCover}
            className="absolute top-4 right-4 bg-white text-black border-4 border-black font-black uppercase text-sm px-4 py-2 shadow-brutal transition-all hover:translate-y-1 hover:shadow-none z-20"
          >
            Change Cover
          </button>
        )}
      </div>

      <div className="container mx-auto px-4 py-8 max-w-[1200px]">
        {/* Icon and Title */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-5xl">{courseDetails.icon}</span>
          {renderTitle()}
        </div>

        {/* Properties Section */}
        <div className="border-8 border-black p-6 mb-8 bg-gray-100 shadow-brutal">
          <h3 className="font-black uppercase text-xl mb-4 text-black">Course Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm uppercase text-gray-700">Professor:</span>
              <span className="font-bold text-base text-black">{courseDetails.professor}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm uppercase text-gray-700">Email:</span>
              <a href={`mailto:${courseDetails.email}`} className="font-bold text-base text-blue-600 hover:scale-105 transition-transform">{courseDetails.email}</a>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm uppercase text-gray-700">Website:</span>
              <a href={courseDetails.website} target="_blank" rel="noopener noreferrer" className="font-bold text-base text-blue-600 hover:scale-105 transition-transform">{courseDetails.website}</a>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm uppercase text-gray-700">Course Code:</span>
              <span className="font-bold text-base text-black">{courseDetails.courseCode}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm uppercase text-gray-700">Status:</span>
              <select
                value={courseDetails.status}
                onChange={(e) => setCourseDetails({ ...courseDetails, status: e.target.value as 'Not started' | 'Ongoing' | 'Done' })}
                className="input-brutalist bg-white text-black text-sm font-bold uppercase"
              >
                <option value="Not started">Not started</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs/Sections */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 p-4 bg-gray-100 border-8 border-black shadow-brutal mb-8">
            {['Topics', 'Review', 'Assignments', 'Exams', 'Analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex items-center gap-2 px-4 py-3 border-4 border-black font-black uppercase text-sm
                  transition-all shadow-brutal hover:translate-y-1 hover:shadow-none
                  ${activeTab === tab 
                    ? 'bg-primary-blue text-black' 
                    : 'bg-white text-black hover:bg-gray-200'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="border-8 border-black p-6 bg-white shadow-brutal">
            {activeTab === 'Topics' && (
              <div>
                <h3 className="font-black text-xl uppercase mb-4 text-black">Topics</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left table-auto border-collapse brutalist-table">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border-b-4 border-black font-black uppercase text-xs">Lecture/Assignment</th>
                        <th className="px-4 py-2 border-b-4 border-black font-black uppercase text-xs">Date</th>
                        <th className="px-4 py-2 border-b-4 border-black font-black uppercase text-xs">Mastery</th>
                        <th className="px-4 py-2 border-b-4 border-black font-black uppercase text-xs">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topics.map((topic) => (
                        <tr key={topic.id} className="border-b-2 border-gray-200 last:border-b-0">
                          <td className="px-4 py-3 text-sm font-bold text-black">{topic.name}</td>
                          <td className="px-4 py-3 text-sm font-bold text-black">{topic.date}</td>
                          <td className="px-4 py-3 text-sm font-bold text-black">{topic.mastery}</td>
                          <td className="px-4 py-3 text-sm font-bold text-black">{topic.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'Review' && (
              <div>
                <h3 className="font-black text-xl uppercase mb-4 text-black">Review</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left table-auto border-collapse brutalist-table">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border-b-4 border-black font-black uppercase text-xs">Topic Name</th>
                        <th className="px-4 py-2 border-b-4 border-black font-black uppercase text-xs">Last Reviewed</th>
                        <th className="px-4 py-2 border-b-4 border-black font-black uppercase text-xs">Review Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map((item) => (
                        <tr key={item.id} className="border-b-2 border-gray-200 last:border-b-0">
                          <td className="px-4 py-3 text-sm font-bold text-black">{item.topicName}</td>
                          <td className="px-4 py-3 text-sm font-bold text-black">{item.lastReviewed}</td>
                          <td className="px-4 py-3 text-sm font-bold text-black">{item.reviewNotes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'Assignments' && (
              <div>
                <h3 className="font-black text-xl uppercase mb-4 text-black">Assignments</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left table-auto border-collapse brutalist-table">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border-b-4 border-black font-black uppercase text-xs">Name</th>
                        <th className="px-4 py-2 border-b-4 border-black font-black uppercase text-xs">Due Date</th>
                        <th className="px-4 py-2 border-b-4 border-black font-black uppercase text-xs">Status</th>
                        <th className="px-4 py-2 border-b-4 border-black font-black uppercase text-xs">Submission Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map((assignment) => (
                        <tr key={assignment.id} className="border-b-2 border-gray-200 last:border-b-0">
                          <td className="px-4 py-3 text-sm font-bold text-black">{assignment.name}</td>
                          <td className="px-4 py-3 text-sm font-bold text-black">{assignment.dueDate}</td>
                          <td className="px-4 py-3 text-sm font-bold text-black">{assignment.status}</td>
                          <td className="px-4 py-3 text-sm font-bold text-black">
                            {assignment.submissionLink ? (
                              <a href={assignment.submissionLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:scale-105 transition-transform">Link</a>
                            ) : (
                              'N/A'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'Exams' && (
              <div>
                <h3 className="font-black text-xl uppercase mb-4 text-black">Exams</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left table-auto border-collapse brutalist-table">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border-b-4 border-black font-black uppercase text-xs">Exam Name</th>
                        <th className="px-4 py-2 border-b-4 border-black font-black uppercase text-xs">Date</th>
                        <th className="px-4 py-2 border-b-4 border-black font-black uppercase text-xs">Syllabus</th>
                        <th className="px-4 py-2 border-b-4 border-black font-black uppercase text-xs">Prep Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exams.map((exam) => (
                        <tr key={exam.id} className="border-b-2 border-gray-200 last:border-b-0">
                          <td className="px-4 py-3 text-sm font-bold text-black">{exam.name}</td>
                          <td className="px-4 py-3 text-sm font-bold text-black">{exam.date}</td>
                          <td className="px-4 py-3 text-sm font-bold text-black">{exam.syllabus}</td>
                          <td className="px-4 py-3 text-sm font-bold text-black">{exam.prepStatus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'Analytics' && (
              <div>
                <h3 className="font-black text-xl uppercase mb-4 text-black">Analytics</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left table-auto border-collapse brutalist-table">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border-b-4 border-black font-black uppercase text-xs">Subject</th>
                        <th className="px-4 py-2 border-b-4 border-black font-black uppercase text-xs">Topic Mastered (%)</th>
                        <th className="px-4 py-2 border-b-4 border-black font-black uppercase text-xs">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.map((data) => (
                        <tr key={data.id} className="border-b-2 border-gray-200 last:border-b-0">
                          <td className="px-4 py-3 text-sm font-bold text-black">{data.subject}</td>
                          <td className="px-4 py-3 text-sm font-bold text-black">{data.topicMastered}%</td>
                          <td className="px-4 py-3 text-sm font-bold text-black">{data.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comment Section */}
        <div className="mb-12 border-8 border-black p-6 bg-gray-100 shadow-brutal">
          <h3 className="font-black text-xl uppercase mb-4 text-black">Comments</h3>
          <textarea
            className="w-full p-3 border-4 border-black font-bold uppercase focus:outline-none focus:bg-yellow-100"
            rows={6}
            placeholder="ADD YOUR NOTES OR COMMENTS HERE..."
          ></textarea>
        </div>
      </div>

      <AcademicSelectorModal isOpen={showSelector} onClose={() => setShowSelector(false)} />
    </div>
  );
} 