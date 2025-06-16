import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  CourseMetadata, 
  Topic, 
  Assignment, 
  Exam, 
  Review, 
  Analytics, 
  CourseEvent 
} from '@/types/Course';

interface CourseStorageSchema {
  version: string;
  lastUpdated: number;
  courses: CourseMetadata[];
  topics: Topic[];
  assignments: Assignment[];
  exams: Exam[];
  reviews: Review[];
  analytics: Analytics[];
  events: CourseEvent[];
}

const STORAGE_KEY = 'musty_courses_v2';
const CURRENT_VERSION = '2.0.0';

export function useCoursesLocalStorage() {
  const [storage, setStorage] = useState<CourseStorageSchema>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          const parsedData: CourseStorageSchema = JSON.parse(storedData);
          
          // Ensure all required fields exist
          return {
            version: parsedData.version || CURRENT_VERSION,
            lastUpdated: parsedData.lastUpdated || Date.now(),
            courses: parsedData.courses || [],
            topics: parsedData.topics || [],
            assignments: parsedData.assignments || [],
            exams: parsedData.exams || [],
            reviews: parsedData.reviews || [],
            analytics: parsedData.analytics || [],
            events: parsedData.events || []
          };
        }
      } catch (error) {
        console.error('Failed to load courses:', error);
      }
    }
    
    // Return default empty storage if no data or error
    return {
      version: CURRENT_VERSION,
      lastUpdated: Date.now(),
      courses: [],
      topics: [],
      assignments: [],
      exams: [],
      reviews: [],
      analytics: [],
      events: []
    };
  });

  // Persist entire storage to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    }
  }, [storage]);

  // Course Management
  const addCourse = useCallback((course: Omit<CourseMetadata, 'id'>) => {
    const newCourse: CourseMetadata = {
      ...course,
      id: `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    setStorage(prev => {
      const updatedCourses = [...prev.courses, newCourse];
      return {
        ...prev,
        courses: updatedCourses,
        lastUpdated: Date.now()
      };
    });

    return newCourse;
  }, []);

  // Add a method to get a course by ID
  const getCourseById = useCallback((courseId: string) => {
    return storage.courses.find(course => course.id === courseId);
  }, [storage.courses]);

  const updateCourse = useCallback((courseId: string, updates: Partial<CourseMetadata>) => {
    setStorage(prev => ({
      ...prev,
      courses: prev.courses.map(course => 
        course.id === courseId ? { ...course, ...updates } : course
      ),
      lastUpdated: Date.now()
    }));
  }, []);

  const deleteCourse = useCallback((courseId: string) => {
    setStorage(prev => {
      // Remove the course
      const updatedCourses = prev.courses.filter(course => course.id !== courseId);
      
      // Remove associated entities
      const updatedTopics = prev.topics.filter(topic => topic.courseId !== courseId);
      const updatedAssignments = prev.assignments.filter(assignment => assignment.courseId !== courseId);
      const updatedExams = prev.exams.filter(exam => exam.courseId !== courseId);
      const updatedReviews = prev.reviews.filter(review => review.courseId !== courseId);
      const updatedAnalytics = prev.analytics.filter(analytics => analytics.courseId !== courseId);
      const updatedEvents = prev.events.filter(event => event.courseId !== courseId);

      return {
        ...prev,
        courses: updatedCourses,
        topics: updatedTopics,
        assignments: updatedAssignments,
        exams: updatedExams,
        reviews: updatedReviews,
        analytics: updatedAnalytics,
        events: updatedEvents,
        lastUpdated: Date.now()
      };
    });
  }, []);

  // Entity Management Methods (Generic)
  const addEntity = useCallback(<T extends { id: string; courseId: string }>(
    entityType: keyof Omit<CourseStorageSchema, 'version' | 'lastUpdated' | 'courses'>, 
    entity: Omit<T, 'id'> & { courseId: string }
  ) => {
    const newEntity = {
      ...entity,
      id: `${entityType.slice(0, -1)}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    } as T;

    setStorage(prev => ({
      ...prev,
      [entityType]: [...prev[entityType], newEntity],
      lastUpdated: Date.now()
    }));

    return newEntity;
  }, []);

  const updateEntity = useCallback(<T extends { id: string }>(
    entityType: keyof Omit<CourseStorageSchema, 'version' | 'lastUpdated' | 'courses'>, 
    entityId: string, 
    updates: Partial<T>
  ) => {
    setStorage(prev => ({
      ...prev,
      [entityType]: prev[entityType].map(entity => 
        entity.id === entityId ? { ...entity, ...updates } : entity
      ),
      lastUpdated: Date.now()
    }));
  }, []);

  // Filtering Methods
  const getEntitiesByCourseId = useCallback(<T extends { courseId: string }>(
    entityType: keyof Omit<CourseStorageSchema, 'version' | 'lastUpdated' | 'courses'>, 
    courseId: string
  ): T[] => {
    return storage[entityType].filter(entity => 
      (entity as T & { courseId: string }).courseId === courseId
    ) as T[];
  }, [storage]);

  return {
    ...storage,
    addCourse,
    getCourseById,
    updateCourse,
    deleteCourse,
    addEntity,
    updateEntity,
    getEntitiesByCourseId
  };
} 