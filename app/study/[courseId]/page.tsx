'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import { useCoursesLocalStorage } from '@/hooks/useCoursesLocalStorage';
import { Course, Topic, Assignment, Exam } from '@/types/Course';
import { Button } from '@/components/ui/button';

const CourseDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const { getCourseById, updateCourse, deleteCourse, courses } = useCoursesLocalStorage();
  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [activeTab, setActiveTab] = useState('topics');

  useEffect(() => {
    if (courseId) {
      // Ensure courseId is a string and not empty
      if (typeof courseId !== 'string' || courseId.trim() === '') {
        console.error('Invalid course ID:', courseId);
        router.push('/study');
        return;
      }

      // Log available courses for debugging
      console.log('Available courses:', courses);
      
      // Attempt to find the course
      const foundCourse = getCourseById(courseId);
      
      if (foundCourse) {
        setCourse(foundCourse);
        setEditedTitle(foundCourse.name);
      } else {
        console.error('Course not found with ID:', courseId);
        console.log('Searched course ID:', courseId);
        console.log('Available course IDs:', courses.map(c => c.id));
        
        // Redirect back to study page if course not found
        router.push('/study');
      }
    }
  }, [courseId, getCourseById, router, courses]);

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white font-mono">
        <p className="font-black text-2xl uppercase text-black">Loading Course...</p>
      </div>
    );
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    if (editedTitle.trim() && editedTitle !== course.name) {
      updateCourse(course.id, { name: editedTitle.trim() });
      setCourse(prev => prev ? { ...prev, name: editedTitle.trim() } : prev);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    }
  };

  const handlePropertyChange = (field: keyof Course, value: any) => {
    updateCourse(course.id, { [field]: value });
    setCourse(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleDeleteCourse = () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      deleteCourse(course.id);
      router.push('/study');
    }
  };

  const renderEditableProperty = (label: string, field: keyof Course, value?: any) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValue, setEditedValue] = useState(value || '');

    useEffect(() => { // Sync internal state with prop changes
      setEditedValue(value || '');
    }, [value]);

    const handleBlur = () => {
      if (editedValue.trim() !== (value || '')) {
        handlePropertyChange(field, editedValue.trim());
      }
      setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleBlur();
      }
    };

    if (isEditing) {
      if (field === 'status') {
        return (
          <select
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            onBlur={handleBlur}
            className="input-brutalist w-full text-lg uppercase"
            autoFocus
          >
            <option value="Not started">Not started</option>
            <option value="In progress">In progress</option>
            <option value="Completed">Completed</option>
          </select>
        );
      } else {
        return (
          <input
            type="text"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="input-brutalist w-full text-lg uppercase"
            autoFocus
          />
        );
      }
    } else {
      return (
        <p className="font-bold text-sm uppercase text-gray-600 cursor-pointer hover:scale-105 transition-transform" onClick={() => setIsEditing(true)}>
          <span className="text-black mr-2">{label}:</span>
          {value || <span className="text-gray-400">EMPTY</span>}
        </p>
      );
    }
  };

  const renderListSection = (items: Topic[] | Assignment[] | Exam[], type: 'topic' | 'assignment' | 'exam') => {
    const addItem = () => {
      const newItem: any = {
        name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        details: 'Enter details',
        status: type === 'topic' ? 'not started' : type === 'assignment' ? 'pending' : 'scheduled',
      };
      handlePropertyChange(`${type}s` as keyof Course, [...items, newItem]);
    };

    const updateItem = (index: number, field: string, value: string) => {
      const updatedItems = items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      );
      handlePropertyChange(`${type}s` as keyof Course, updatedItems);
    };

    const deleteItem = (index: number) => {
      const updatedItems = items.filter((_, i) => i !== index);
      handlePropertyChange(`${type}s` as keyof Course, updatedItems);
    };

    return (
      <div className="border-8 border-black p-6 bg-white shadow-brutal">
        <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-black">{type.charAt(0).toUpperCase() + type.slice(1)}s</h3>
        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="font-bold text-sm uppercase text-gray-600">No {type}s added yet.</p>
          ) : (
            items.map((item, index) => (
              <div key={index} className="border-4 border-black p-4 bg-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <input 
                    type="text" 
                    value={item.name} 
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    className="input-brutalist w-full font-black text-xl uppercase mb-1"
                  />
                  <input 
                    type="date" 
                    value={item.date} 
                    onChange={(e) => updateItem(index, 'date', e.target.value)}
                    className="input-brutalist w-full font-bold text-sm text-gray-600 mb-1"
                  />
                  <textarea 
                    value={item.details} 
                    onChange={(e) => updateItem(index, 'details', e.target.value)}
                    className="input-brutalist w-full font-bold text-sm text-gray-800 h-20"
                    placeholder="Enter details..."
                  />
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {(type === 'topic' || type === 'assignment' || type === 'exam') && (
                    <select
                      value={item.status}
                      onChange={(e) => updateItem(index, 'status', e.target.value)}
                      className="input-brutalist text-sm uppercase"
                    >
                      {type === 'topic' && (
                        <>
                          <option value="not started">Not Started</option>
                          <option value="in progress">In Progress</option>
                          <option value="done">Done</option>
                        </>
                      )}
                      {type === 'assignment' && (
                        <>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="overdue">Overdue</option>
                        </>
                      )}
                      {type === 'exam' && (
                        <>
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </>
                      )}
                    </select>
                  )}
                  <button 
                    onClick={() => deleteItem(index)} 
                    className="btn-brutalist bg-red-500 text-white hover:bg-red-600 !px-4 !py-2 !shadow-none !translate-y-0 text-sm"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <button 
          onClick={addItem} 
          className="btn-brutalist bg-brutalist-blue text-white mt-6 w-full"
          style={{ color: 'var(--force-black)' }}
        >
          ADD NEW {type.toUpperCase()}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white font-mono">
      <Navbar onShowChangeClick={() => router.push('/study')} /> {/* Or a more specific action if needed */}

      <div className="container mx-auto px-4 py-8 max-w-[1200px]">
        {/* Header Section */}
        <div className="mb-8 border-b-8 border-black pb-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">📚</span>
            {isEditingTitle ? (
              <input
                type="text"
                value={editedTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="font-mono text-4xl font-black uppercase tracking-tighter text-black bg-transparent border-none outline-none w-full"
                autoFocus
              />
            ) : (
              <h1
                className="font-mono text-4xl font-black uppercase tracking-tighter text-black cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setIsEditingTitle(true)}
              >
                <span className="bg-primary-blue text-black px-2 py-1">{course.name.split(' ')[0]}</span>
                {course.name.split(' ').slice(1).join(' ')}
              </h1>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {renderEditableProperty('Professor', 'professor', course.professor)}
            {renderEditableProperty('Email', 'email', course.email)}
            {renderEditableProperty('Website', 'website', course.website)}
            {renderEditableProperty('Course Code', 'courseCode', course.courseCode)}
            {renderEditableProperty('Status', 'status', course.status)}
          </div>

          <button 
            onClick={handleDeleteCourse} 
            className="btn-brutalist bg-red-500 text-white mt-8 hover:bg-red-600 !px-6 !py-3 !shadow-none !translate-y-0 text-lg"
          >
            DELETE COURSE
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 p-4 bg-gray-100 border-8 border-black shadow-brutal mb-8">
          {[ 'topics', 'assignments', 'exams', 'analytics' ].map((tab) => (
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
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */} 
        <div>
          {activeTab === 'topics' && renderListSection(course.topics, 'topic')}
          {activeTab === 'assignments' && renderListSection(course.assignments, 'assignment')}
          {activeTab === 'exams' && renderListSection(course.exams, 'exam')}
          {activeTab === 'analytics' && (
            <div className="border-8 border-black p-6 bg-white shadow-brutal flex flex-col items-center justify-center h-64">
              <p className="font-black text-2xl uppercase text-black tracking-tighter">ANALYTICS MODULE</p>
              <p className="text-sm uppercase font-bold text-gray-600">UNDER CONSTRUCTION</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CourseDetailPage; 