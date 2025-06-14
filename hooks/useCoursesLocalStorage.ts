import { useState, useEffect, useCallback, useMemo } from 'react';
import { Course, Topic, Assignment, Exam } from '@/types/Course';

interface CourseStorageSchema {
  version: string;
  lastUpdated: number;
  courses: Course[];
}

const STORAGE_KEY = 'musty_courses_v1';
const CURRENT_VERSION = '1.0.0';

export function useCoursesLocalStorage() {
  // Use useMemo to ensure consistent initial state
  const [courses, setCourses] = useState<Course[]>(() => {
    // Check if we're in browser environment to avoid hydration issues
    if (typeof window !== 'undefined') {
      try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          const parsedData: CourseStorageSchema = JSON.parse(storedData);
          return parsedData.courses || [];
        }
      } catch (error) {
        console.error('Failed to load courses:', error);
      }
    }
    return [];
  });

  // Memoize migration function to prevent unnecessary re-renders
  const migrateCourseData = useCallback((storedData: CourseStorageSchema) => {
    if (storedData.version !== CURRENT_VERSION) {
      const migratedCourses = storedData.courses.map(course => ({
        ...course,
        topics: course.topics || [],
        assignments: course.assignments || [],
        exams: course.exams || [],
        status: course.status || 'Not started',
        createdAt: course.createdAt || Date.now(),
        lastUpdated: course.lastUpdated || Date.now(),
        archived: course.archived || false
      }));

      return {
        version: CURRENT_VERSION,
        lastUpdated: Date.now(),
        courses: migratedCourses
      };
    }
    return storedData;
  }, []);

  // Persist courses to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storageData: CourseStorageSchema = {
        version: CURRENT_VERSION,
        lastUpdated: Date.now(),
        courses: courses
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
    }
  }, [courses]);

  // Memoize course management methods
  const addCourse = useCallback((newCourse: Omit<Course, 'id'>) => {
    let addedCourse: Course | null = null;
    
    setCourses(prevCourses => {
      const isDuplicate = prevCourses.some(course => 
        course.name.toLowerCase() === newCourse.name.toLowerCase()
      );

      if (isDuplicate) return prevCourses;

      const courseToAdd: Course = {
        ...newCourse,
        id: `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        lastUpdated: Date.now(),
        archived: false
      };

      addedCourse = courseToAdd;
      return [...prevCourses, courseToAdd];
    });

    return addedCourse;
  }, []);

  const updateCourse = useCallback((courseId: string, updates: Partial<Course>) => {
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === courseId 
          ? { 
              ...course, 
              ...updates, 
              lastUpdated: Date.now() 
            } 
          : course
      )
    );
  }, []);

  const deleteCourse = useCallback((courseId: string) => {
    setCourses(prevCourses => 
      prevCourses.filter(course => course.id !== courseId)
    );
  }, []);

  const archiveCourse = useCallback((courseId: string) => {
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === courseId 
          ? { 
              ...course, 
              archived: true, 
              archivedAt: Date.now(),
              lastUpdated: Date.now()
            } 
          : course
      )
    );
  }, []);

  // Memoize utility methods
  const getActiveCourses = useMemo(() => 
    () => courses.filter(course => !course.archived), 
    [courses]
  );

  const getArchivedCourses = useMemo(() => 
    () => courses.filter(course => course.archived), 
    [courses]
  );

  const getCourseById = useMemo(() => 
    (courseId: string) => courses.find(course => course.id === courseId), 
    [courses]
  );

  const searchCourses = useMemo(() => 
    (query: string) => courses.filter(course => 
      course.name.toLowerCase().includes(query.toLowerCase()) ||
      course.courseCode?.toLowerCase().includes(query.toLowerCase())
    ), 
    [courses]
  );

  // Export and import methods
  const exportCourses = useCallback(() => {
    const exportData = {
      version: CURRENT_VERSION,
      exportedAt: Date.now(),
      courses: courses
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `musty_courses_export_${new Date().toISOString().replace(/:/g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [courses]);

  const importCourses = useCallback((importedData: string) => {
    try {
      const parsedData = JSON.parse(importedData);
      
      if (!parsedData.courses || !Array.isArray(parsedData.courses)) {
        throw new Error('Invalid import data');
      }

      const importedCourses = parsedData.courses.map(course => ({
        ...course,
        id: `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        lastUpdated: Date.now(),
        archived: false
      }));

      setCourses(prevCourses => [...prevCourses, ...importedCourses]);
      return true;
    } catch (error) {
      console.error('Course import failed:', error);
      return false;
    }
  }, []);

  const calculateCourseProgress = useCallback((course: Course) => {
    const totalTopics = course.topics.length;
    const completedTopics = course.topics.filter(topic => topic.completed).length;
    
    const totalAssignments = course.assignments.length;
    const completedAssignments = course.assignments.filter(assignment => assignment.completed).length;
    
    const totalExams = course.exams.length;
    const completedExams = course.exams.filter(exam => exam.completed).length;
    
    const topicProgress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;
    const assignmentProgress = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;
    const examProgress = totalExams > 0 ? (completedExams / totalExams) * 100 : 0;
    
    const overallProgress = (topicProgress + assignmentProgress + examProgress) / 3;
    
    return {
      topicProgress,
      assignmentProgress,
      examProgress,
      overallProgress: Math.round(overallProgress)
    };
  }, []);

  const getUpcomingDeadlines = useCallback(() => {
    const now = Date.now();
    const upcomingDeadlines = courses.flatMap(course => [
      ...course.assignments
        .filter(assignment => !assignment.completed && new Date(assignment.deadline).getTime() > now)
        .map(assignment => ({
          courseId: course.id,
          courseName: course.name,
          type: 'assignment',
          title: assignment.title,
          deadline: assignment.deadline
        })),
      ...course.exams
        .filter(exam => !exam.completed && new Date(exam.date).getTime() > now)
        .map(exam => ({
          courseId: course.id,
          courseName: course.name,
          type: 'exam',
          title: exam.title,
          deadline: exam.date
        }))
    ]).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

    return upcomingDeadlines;
  }, [courses]);

  const getCourseAnalytics = useCallback(() => {
    const totalCourses = courses.length;
    const activeCourses = courses.filter(course => !course.archived).length;
    const archivedCourses = courses.filter(course => course.archived).length;
    
    const progressStats = courses.map(course => calculateCourseProgress(course));
    
    const averageProgress = progressStats.length > 0 
      ? Math.round(progressStats.reduce((sum, stat) => sum + stat.overallProgress, 0) / progressStats.length)
      : 0;
    
    return {
      totalCourses,
      activeCourses,
      archivedCourses,
      averageProgress,
      progressStats
    };
  }, [courses, calculateCourseProgress]);

  return {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    archiveCourse,
    exportCourses,
    importCourses,
    getActiveCourses,
    getArchivedCourses,
    searchCourses,
    getCourseById,
    calculateCourseProgress,
    getUpcomingDeadlines,
    getCourseAnalytics
  };
} 