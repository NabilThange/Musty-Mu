'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  CourseMetadata, 
  Topic, 
  Assignment, 
  Exam, 
  Review, 
  Analytics 
} from '@/types/Course'
import { useCoursesLocalStorage } from '@/hooks/useCoursesLocalStorage'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import CourseEditModal from '@/components/course-edit-modal'

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const { 
    courses, 
    addEntity, 
    updateEntity, 
    getEntitiesByCourseId,
    getCourseById,
    updateCourse 
  } = useCoursesLocalStorage()

  const [course, setCourse] = useState<CourseMetadata | null>(null)
  const [topics, setTopics] = useState<Topic[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [activeTab, setActiveTab] = useState<'topics' | 'assignments' | 'exams' | 'reviews'>('topics')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [editableFields, setEditableFields] = useState({
    name: course?.name || '',
    professor: course?.professor || '',
    email: course?.email || '',
    website: course?.website || '',
    status: course?.status || 'Not Started'
  })

  const [editingField, setEditingField] = useState<string | null>(null)

  const [editingEntity, setEditingEntity] = useState<{type: string, id: string} | null>(null)
  const [editableEntity, setEditableEntity] = useState<any>({})

  useEffect(() => {
    console.log('Course ID:', courseId);
    const currentCourse = getCourseById(courseId);
    console.log('Current Course:', currentCourse);
    
    if (currentCourse) {
      setCourse(currentCourse)
      const courseTopics = getEntitiesByCourseId<Topic>('topics', courseId);
      console.log('Course Topics:', courseTopics);
      setTopics(courseTopics);
      
      const courseAssignments = getEntitiesByCourseId<Assignment>('assignments', courseId);
      console.log('Course Assignments:', courseAssignments);
      setAssignments(courseAssignments);
      
      const courseExams = getEntitiesByCourseId<Exam>('exams', courseId);
      console.log('Course Exams:', courseExams);
      setExams(courseExams);
    } else {
      console.error('No course found with ID:', courseId);
    }
  }, [courseId, getCourseById, getEntitiesByCourseId]);

  useEffect(() => {
    if (course) {
      setEditableFields({
        name: course.name,
        professor: course.professor || '',
        email: course.email || '',
        website: course.website || '',
        status: course.status
      })
    }
  }, [course])

  const handleFieldChange = (field: string, value: string) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFieldSave = (field: string) => {
    if (course) {
      updateCourse(course.id, { [field]: editableFields[field as keyof typeof editableFields] })
      setEditingField(null)
    }
  }

  const handleEntityChange = (field: string, value: string) => {
    setEditableEntity(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEntitySave = (type: 'topics' | 'assignments' | 'exams') => {
    if (editingEntity) {
      updateEntity(type, editingEntity.id, editableEntity)
      setEditingEntity(null)
    }
  }

  const renderTopics = () => (
    <div className="grid gap-4">
      {topics.map(topic => (
        <div 
          key={topic.id} 
          className="border-4 border-black p-4 bg-white shadow-brutal"
        >
          {editingEntity?.type === 'topic' && editingEntity.id === topic.id ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Topic Name</label>
                <input
                  type="text"
                  value={editableEntity.name}
                  onChange={(e) => handleEntityChange('name', e.target.value)}
                  className="input-brutalist w-full text-black"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Date</label>
                <input
                  type="date"
                  value={editableEntity.date}
                  onChange={(e) => handleEntityChange('date', e.target.value)}
                  className="input-brutalist w-full text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Mastery</label>
                <select
                  value={editableEntity.mastery}
                  onChange={(e) => handleEntityChange('mastery', e.target.value)}
                  className="input-brutalist w-full text-black"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="Learning">Learning</option>
                  <option value="Mastered">Mastered</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Details</label>
                <textarea
                  value={editableEntity.details}
                  onChange={(e) => handleEntityChange('details', e.target.value)}
                  className="input-brutalist w-full text-black"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  onClick={() => handleEntitySave('topics')}
                  className="bg-brutalist-blue text-black"
                >
                  Save
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setEditingEntity(null)}
                  className="text-black"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black uppercase">{topic.name}</h3>
                <div className="text-xs text-gray-500 mt-2">
                  Date: {topic.date}
                </div>
                {topic.details && (
                  <p className="text-sm mt-2">{topic.details}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span 
                  className={`
                    px-2 py-1 text-xs uppercase font-bold 
                    ${topic.mastery === 'Mastered' ? 'bg-green-500' : 
                      topic.mastery === 'Learning' ? 'bg-yellow-500' : 'bg-red-500'}
                    text-white
                  `}
                >
                  {topic.mastery}
                </span>
                <Button 
                  size="sm"
                  onClick={() => {
                    setEditingEntity({ type: 'topic', id: topic.id })
                    setEditableEntity(topic)
                  }}
                  className="bg-brutalist-blue text-black"
                >
                  Edit
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
      <Button 
        onClick={() => {
          const newTopic: Omit<Topic, 'id'> = {
            courseId,
            name: 'New Topic',
            date: new Date().toISOString().split('T')[0],
            mastery: 'Not Started',
            details: ''
          }
          addEntity('topics', newTopic)
        }}
        className="mt-4 bg-brutalist-blue text-black"
      >
        Add Topic
      </Button>
    </div>
  )

  const renderAssignments = () => (
    <div className="grid gap-4">
      {assignments.map(assignment => (
        <div 
          key={assignment.id} 
          className="border-4 border-black p-4 bg-white shadow-brutal"
        >
          {editingEntity?.type === 'assignment' && editingEntity.id === assignment.id ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Assignment Name</label>
                <input
                  type="text"
                  value={editableEntity.name}
                  onChange={(e) => handleEntityChange('name', e.target.value)}
                  className="input-brutalist w-full text-black"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Due Date</label>
                <input
                  type="date"
                  value={editableEntity.dueDate}
                  onChange={(e) => handleEntityChange('dueDate', e.target.value)}
                  className="input-brutalist w-full text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Status</label>
                <select
                  value={editableEntity.status}
                  onChange={(e) => handleEntityChange('status', e.target.value)}
                  className="input-brutalist w-full text-black"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Submission Link</label>
                <input
                  type="text"
                  value={editableEntity.submissionLink || ''}
                  onChange={(e) => handleEntityChange('submissionLink', e.target.value)}
                  className="input-brutalist w-full text-black"
                  placeholder="Optional submission link"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  onClick={() => handleEntitySave('assignments')}
                  className="bg-brutalist-blue text-black"
                >
                  Save
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setEditingEntity(null)}
                  className="text-black"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black uppercase">{assignment.name}</h3>
                <div className="text-sm mt-2">
                  Due: {assignment.dueDate}
                </div>
                {assignment.submissionLink && (
                  <a 
                    href={assignment.submissionLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 text-xs mt-2 block"
                  >
                    Submission Link
                  </a>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span 
                  className={`
                    px-2 py-1 text-xs uppercase font-bold 
                    ${assignment.status === 'Completed' ? 'bg-green-500' : 
                      assignment.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'}
                    text-white
                  `}
                >
                  {assignment.status}
                </span>
                <Button 
                  size="sm"
                  onClick={() => {
                    setEditingEntity({ type: 'assignment', id: assignment.id })
                    setEditableEntity(assignment)
                  }}
                  className="bg-brutalist-blue text-black"
                >
                  Edit
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
      <Button 
        onClick={() => {
          const newAssignment: Omit<Assignment, 'id'> = {
            courseId,
            name: 'New Assignment',
            dueDate: new Date().toISOString().split('T')[0],
            status: 'Pending',
            submissionLink: ''
          }
          addEntity('assignments', newAssignment)
        }}
        className="mt-4 bg-brutalist-blue text-black"
      >
        Add Assignment
      </Button>
    </div>
  )

  const renderExams = () => (
    <div className="grid gap-4">
      {exams.map(exam => (
        <div 
          key={exam.id} 
          className="border-4 border-black p-4 bg-white shadow-brutal"
        >
          {editingEntity?.type === 'exam' && editingEntity.id === exam.id ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Exam Name</label>
                <input
                  type="text"
                  value={editableEntity.name}
                  onChange={(e) => handleEntityChange('name', e.target.value)}
                  className="input-brutalist w-full text-black"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Exam Date</label>
                <input
                  type="date"
                  value={editableEntity.date}
                  onChange={(e) => handleEntityChange('date', e.target.value)}
                  className="input-brutalist w-full text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Preparation Status</label>
                <select
                  value={editableEntity.prepStatus}
                  onChange={(e) => handleEntityChange('prepStatus', e.target.value)}
                  className="input-brutalist w-full text-black"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="Studying">Studying</option>
                  <option value="Ready">Ready</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Syllabus Link</label>
                <input
                  type="text"
                  value={editableEntity.syllabus || ''}
                  onChange={(e) => handleEntityChange('syllabus', e.target.value)}
                  className="input-brutalist w-full text-black"
                  placeholder="Optional syllabus link"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  onClick={() => handleEntitySave('exams')}
                  className="bg-brutalist-blue text-black"
                >
                  Save
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setEditingEntity(null)}
                  className="text-black"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black uppercase">{exam.name}</h3>
                <div className="text-sm mt-2">
                  Date: {exam.date}
                </div>
                {exam.syllabus && (
                  <div className="text-xs text-gray-500 mt-2">
                    Syllabus: {exam.syllabus}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span 
                  className={`
                    px-2 py-1 text-xs uppercase font-bold 
                    ${exam.prepStatus === 'Ready' ? 'bg-green-500' : 
                      exam.prepStatus === 'Studying' ? 'bg-yellow-500' : 'bg-red-500'}
                    text-white
                  `}
                >
                  {exam.prepStatus}
                </span>
                <Button 
                  size="sm"
                  onClick={() => {
                    setEditingEntity({ type: 'exam', id: exam.id })
                    setEditableEntity(exam)
                  }}
                  className="bg-brutalist-blue text-black"
                >
                  Edit
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
      <Button 
        onClick={() => {
          const newExam: Omit<Exam, 'id'> = {
            courseId,
            name: 'New Exam',
            date: new Date().toISOString().split('T')[0],
            prepStatus: 'Not Started',
            syllabus: ''
          }
          addEntity('exams', newExam)
        }}
        className="mt-4 bg-brutalist-blue text-black"
      >
        Add Exam
      </Button>
    </div>
  )

  if (!course) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-white font-mono text-black">
      <Navbar onShowChangeClick={() => {}} />
      
      <div className="container mx-auto px-4 py-8 max-w-[1200px] text-black">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-5xl">{course.icon || '��'}</span>
          {editingField === 'name' ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editableFields.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="text-4xl font-black uppercase tracking-tighter text-black input-brutalist"
                autoFocus
              />
              <Button 
                onClick={() => handleFieldSave('name')} 
                className="bg-brutalist-blue text-black"
              >
                Save
              </Button>
            </div>
          ) : (
            <h1 
              className="text-4xl font-black uppercase tracking-tighter text-black cursor-pointer"
              onClick={() => setEditingField('name')}
            >
              {editableFields.name}
            </h1>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-black">
          <div>
            <strong className="text-black">Professor:</strong>{' '}
            {editingField === 'professor' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editableFields.professor}
                  onChange={(e) => handleFieldChange('professor', e.target.value)}
                  className="input-brutalist w-full text-black"
                  autoFocus
                />
                <Button 
                  onClick={() => handleFieldSave('professor')} 
                  className="bg-brutalist-blue text-black"
                >
                  Save
                </Button>
              </div>
            ) : (
              <span 
                className="cursor-pointer" 
                onClick={() => setEditingField('professor')}
              >
                {editableFields.professor || 'Not specified'}
              </span>
            )}
          </div>
          <div>
            <strong className="text-black">Email:</strong>{' '}
            {editingField === 'email' ? (
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={editableFields.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="input-brutalist w-full text-black"
                  autoFocus
                />
                <Button 
                  onClick={() => handleFieldSave('email')} 
                  className="bg-brutalist-blue text-black"
                >
                  Save
                </Button>
              </div>
            ) : (
              <span 
                className="cursor-pointer" 
                onClick={() => setEditingField('email')}
              >
                {editableFields.email || 'Not specified'}
              </span>
            )}
          </div>
          <div>
            <strong className="text-black">Website:</strong>{' '}
            {editingField === 'website' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editableFields.website}
                  onChange={(e) => handleFieldChange('website', e.target.value)}
                  className="input-brutalist w-full text-black"
                  autoFocus
                />
                <Button 
                  onClick={() => handleFieldSave('website')} 
                  className="bg-brutalist-blue text-black"
                >
                  Save
                </Button>
              </div>
            ) : (
              <span 
                className="cursor-pointer" 
                onClick={() => setEditingField('website')}
              >
                {editableFields.website || 'Not specified'}
              </span>
            )}
          </div>
          <div>
            <strong className="text-black">Status:</strong>{' '}
            {editingField === 'status' ? (
              <div className="flex items-center gap-2">
                <select
                  value={editableFields.status}
                  onChange={(e) => handleFieldChange('status', e.target.value)}
                  className="input-brutalist w-full text-black"
                  autoFocus
                >
                  <option value="Not Started" className="text-black">Not Started</option>
                  <option value="In Progress" className="text-black">In Progress</option>
                  <option value="Completed" className="text-black">Completed</option>
                </select>
                <Button 
                  onClick={() => handleFieldSave('status')} 
                  className="bg-brutalist-blue text-black"
                >
                  Save
                </Button>
              </div>
            ) : (
              <span 
                className="cursor-pointer" 
                onClick={() => setEditingField('status')}
              >
                {editableFields.status}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          {['topics', 'assignments', 'exams', 'reviews'].map(tab => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab as any)}
              className="text-black"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {activeTab === 'topics' && renderTopics()}
        {activeTab === 'assignments' && renderAssignments()}
        {activeTab === 'exams' && renderExams()}
        {activeTab === 'reviews' && <div className="text-black">Reviews coming soon</div>}
      </div>

      {course && (
        <CourseEditModal
          isOpen={isEditModalOpen}
          course={course}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  )
} 