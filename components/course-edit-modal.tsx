'use client'

import React, { useState, useEffect } from 'react';
import { CourseMetadata } from '@/types/Course';
import { Button } from '@/components/ui/button';
import { useCoursesLocalStorage } from '@/hooks/useCoursesLocalStorage';

interface CourseEditModalProps {
  isOpen: boolean;
  course: CourseMetadata;
  onClose: () => void;
}

const cardBackgrounds = [
  "bg-subtle-concrete-gray",
  "bg-subtle-whisper-red",
  "bg-subtle-steel-blue",
  "bg-subtle-warm-dust",
  "bg-subtle-faded-yellow",
  "bg-subtle-charcoal-mist",
  "bg-subtle-sage-concrete",
  "bg-subtle-ivory-shadow",
  "bg-subtle-rust-whisper",
  "bg-subtle-cool-slate",
];

export default function CourseEditModal({ 
  isOpen, 
  course, 
  onClose 
}: CourseEditModalProps) {
  const { updateCourse, deleteCourse } = useCoursesLocalStorage();
  const [editedCourse, setEditedCourse] = useState<CourseMetadata>(course);
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEditedCourse(course);
      setIsDeleteConfirming(false);
    }
  }, [isOpen, course]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCourse(course.id, editedCourse);
    onClose();
  };

  const handleDeleteCourse = () => {
    if (isDeleteConfirming) {
      deleteCourse(course.id);
      onClose();
    } else {
      setIsDeleteConfirming(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl bg-white border-8 border-black shadow-brutal p-8 text-black">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-black">
            Edit Course
          </h2>
          <button 
            onClick={onClose}
            className="btn-brutalist bg-red-500 text-black hover:bg-red-600 !p-2 !shadow-none !translate-y-0"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black uppercase mb-2 text-black">Course Name</label>
              <input
                type="text"
                name="name"
                value={editedCourse.name}
                onChange={handleChange}
                className="input-brutalist w-full text-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-black uppercase mb-2 text-black">Course Code</label>
              <input
                type="text"
                name="courseCode"
                value={editedCourse.courseCode || ''}
                onChange={handleChange}
                className="input-brutalist w-full text-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black uppercase mb-2 text-black">Professor</label>
              <input
                type="text"
                name="professor"
                value={editedCourse.professor || ''}
                onChange={handleChange}
                className="input-brutalist w-full text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-black uppercase mb-2 text-black">Email</label>
              <input
                type="email"
                name="email"
                value={editedCourse.email || ''}
                onChange={handleChange}
                className="input-brutalist w-full text-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black uppercase mb-2 text-black">Website</label>
              <input
                type="text"
                name="website"
                value={editedCourse.website || ''}
                onChange={handleChange}
                className="input-brutalist w-full text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-black uppercase mb-2 text-black">Status</label>
              <select
                name="status"
                value={editedCourse.status}
                onChange={handleChange}
                className="input-brutalist w-full text-black"
              >
                <option value="Not Started" className="text-black">Not Started</option>
                <option value="In Progress" className="text-black">In Progress</option>
                <option value="Completed" className="text-black">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black uppercase mb-2 text-black">Card Background</label>
              <div className="grid grid-cols-5 gap-2">
                {cardBackgrounds.map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setEditedCourse(prev => ({ ...prev, cardBgColor: bg }))}
                    className={`
                      w-full h-12 border-4 border-black 
                      ${bg} 
                      ${editedCourse.cardBgColor === bg ? 'ring-4 ring-blue-500' : ''}
                    `}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="text-black"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-brutalist-blue text-black"
            >
              Save Changes
            </Button>
          </div>

          <div className="border-t-4 border-black mt-8 pt-6">
            <h3 className="text-xl font-black uppercase mb-4 text-black">Danger Zone</h3>
            <Button 
              type="button"
              onClick={handleDeleteCourse}
              className={`
                w-full 
                ${isDeleteConfirming 
                  ? 'bg-red-700 text-white hover:bg-red-800' 
                  : 'bg-red-500 text-white hover:bg-red-600'}
              `}
            >
              {isDeleteConfirming 
                ? 'CONFIRM DELETE COURSE' 
                : 'DELETE COURSE'}
            </Button>
            {isDeleteConfirming && (
              <p className="text-sm text-red-600 mt-2 text-center">
                This will permanently remove the course and all its associated data.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 