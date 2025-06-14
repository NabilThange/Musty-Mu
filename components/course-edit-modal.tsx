import React, { useState, useEffect } from 'react';
import { Course } from '@/types/Course';
import { useCoursesLocalStorage } from '@/hooks/useCoursesLocalStorage';

interface CourseEditModalProps {
  isOpen: boolean;
  course: Course;
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

const CourseEditModal: React.FC<CourseEditModalProps> = ({ 
  isOpen, 
  course, 
  onClose 
}) => {
  const { updateCourse } = useCoursesLocalStorage();
  const [editedCourse, setEditedCourse] = useState<Course>(course);

  useEffect(() => {
    if (isOpen) {
      setEditedCourse(course);
    }
  }, [isOpen, course]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl bg-white border-8 border-black shadow-brutal p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-black">
            Edit Course
          </h2>
          <button 
            onClick={onClose}
            className="btn-brutalist bg-red-500 text-white hover:bg-red-600 !p-2 !shadow-none !translate-y-0"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black uppercase mb-2">Course Name</label>
              <input
                type="text"
                name="name"
                value={editedCourse.name}
                onChange={handleChange}
                className="input-brutalist w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-black uppercase mb-2">Course Code</label>
              <input
                type="text"
                name="courseCode"
                value={editedCourse.courseCode || ''}
                onChange={handleChange}
                className="input-brutalist w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-black uppercase mb-2">Description</label>
            <textarea
              name="subtext"
              value={editedCourse.subtext}
              onChange={handleChange}
              className="input-brutalist w-full h-24"
              placeholder="Enter course description"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black uppercase mb-2">Professor</label>
              <input
                type="text"
                name="professor"
                value={editedCourse.professor || ''}
                onChange={handleChange}
                className="input-brutalist w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-black uppercase mb-2">Course Status</label>
              <select
                name="status"
                value={editedCourse.status}
                onChange={handleChange}
                className="input-brutalist w-full"
              >
                <option value="Not started">Not Started</option>
                <option value="In progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-black uppercase mb-2">Card Background</label>
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

          <div className="grid grid-cols-2 gap-4">
            <button
              type="submit"
              className="btn-brutalist bg-brutalist-blue text-black"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-brutalist bg-brutalist-gray text-black"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseEditModal; 