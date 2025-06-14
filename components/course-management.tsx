import { useUserSubjects } from "@/hooks/use-database"

export function CourseManagement() {
  const { subjects, loading: subjectsLoading } = useUserSubjects()

  if (subjectsLoading) {
    return <div>Loading courses...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <CourseCard
            key={subject.id}
            course={{
              id: subject.id,
              code: subject.code,
              name: subject.name,
              credits: subject.credits,
              semester: subject.semester,
              type: subject.subject_type,
              // Add other required fields with defaults
              progress: 0,
              totalTopics: 0,
              completedTopics: 0,
              nextDeadline: null,
              assignments: {
                total: 0,
                completed: 0,
                pending: 0,
              },
            }}
          />
        ))}
      </div>
    </div>
  )
}
