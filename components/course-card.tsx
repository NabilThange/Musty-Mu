'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Course } from '@/types/Course'; // Import the Course interface
import { useCoursesLocalStorage } from '@/hooks/useCoursesLocalStorage';

interface CourseCardProps {
  course: Course; // Now accepts a full Course object
  onEdit?: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit }) => {
  const { updateCourse, deleteCourse, archiveCourse } = useCoursesLocalStorage();
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleArchive = () => {
    archiveCourse(course.id);
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to permanently delete this course?')) {
      deleteCourse(course.id);
    }
    setIsMenuOpen(false);
  };

  const renderStatusBadge = () => {
    const statusColors = {
      'Not started': 'bg-red-500',
      'In progress': 'bg-yellow-500',
      'Completed': 'bg-green-500'
    };

    return (
      <div 
        className={`absolute top-4 right-4 px-2 py-1 text-xs font-black uppercase border-2 border-black ${statusColors[course.status]}`}
      >
        {course.status}
      </div>
    );
  };

  const renderCourseDetails = () => {
    const details = [
      { label: 'Topics', count: course.topics.length },
      { label: 'Assignments', count: course.assignments.length },
      { label: 'Exams', count: course.exams.length }
    ];

    return (
      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        {details.map(({ label, count }) => (
          <div 
            key={label} 
            className="bg-white border-2 border-black p-2 text-xs font-black uppercase"
          >
            <div className="text-lg">{count}</div>
            {label}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      className={`
        relative border-8 border-black shadow-brutal transition-all duration-300 
        ${course.cardBgColor} 
        ${isHovered ? '-translate-y-4 shadow-none' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {renderStatusBadge()}

      {/* Course Menu Dropdown */}
      {isHovered && (
        <div className="absolute top-4 left-4 z-10">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-white border-4 border-black p-2 hover:bg-gray-100"
          >
            ⋯
          </button>
          
          {isMenuOpen && (
            <div className="absolute left-0 mt-2 bg-white border-4 border-black shadow-brutal">
              <button 
                onClick={() => onEdit?.(course)}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 border-b-2 border-black"
              >
                Edit Course
              </button>
              <button 
                onClick={handleArchive}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 border-b-2 border-black"
              >
                Archive Course
              </button>
              <button 
                onClick={handleDelete}
                className="block w-full px-4 py-2 text-left hover:bg-red-100 text-red-600"
              >
                Delete Course
              </button>
            </div>
          )}
        </div>
      )}

      <Link href={`/study/${course.id}`} className="block p-6 text-left">
        <div className="flex items-center mb-4">
          <div className="flex-grow">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-black">
              {course.name}
            </h3>
            <p className="text-sm font-bold uppercase text-gray-700">
              {course.courseCode || 'No Course Code'}
            </p>
          </div>
          <div className="text-4xl ml-4">📚</div>
        </div>

        <p className="text-sm font-bold uppercase mb-4 text-black">
          {course.subtext || 'No description available'}
        </p>

        {renderCourseDetails()}

        <div className="mt-4 text-xs font-bold uppercase text-right text-gray-600">
          Created: {new Date(course.createdAt || Date.now()).toLocaleDateString()}
        </div>
      </Link>
    </div>
  );
};

export default CourseCard; 