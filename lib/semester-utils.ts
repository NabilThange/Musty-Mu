export interface YearSemesterMapping {
  year: string
  yearLabel: string
  semesters: number[]
  semesterLabels: string[]
}

// Updated for Mumbai University B.E. structure
export const YEAR_SEMESTER_MAPPING: YearSemesterMapping[] = [
  {
    year: "FE",
    yearLabel: "First Year (F.E.)",
    semesters: [1, 2],
    semesterLabels: ["Semester I", "Semester II"],
  },
  {
    year: "SE",
    yearLabel: "Second Year (S.E.)",
    semesters: [3, 4],
    semesterLabels: ["Semester III", "Semester IV"],
  },
  {
    year: "TE",
    yearLabel: "Third Year (T.E.)",
    semesters: [5, 6],
    semesterLabels: ["Semester V", "Semester VI"],
  },
  {
    year: "BE",
    yearLabel: "Final Year (B.E.)",
    semesters: [7, 8],
    semesterLabels: ["Semester VII", "Semester VIII"],
  },
]

export function getUserAvailableSemesters(userYear: string): YearSemesterMapping | null {
  return YEAR_SEMESTER_MAPPING.find((mapping) => mapping.year === userYear) || null
}

export function getSemesterLabel(semesterNumber: number): string {
  for (const mapping of YEAR_SEMESTER_MAPPING) {
    const index = mapping.semesters.indexOf(semesterNumber)
    if (index !== -1) {
      return mapping.semesterLabels[index]
    }
  }
  return `Semester ${semesterNumber}`
}

export function getYearFromSemester(semesterNumber: number): string {
  for (const mapping of YEAR_SEMESTER_MAPPING) {
    if (mapping.semesters.includes(semesterNumber)) {
      return mapping.year
    }
  }
  return "FE"
}

export function mapUserYearToSemesters(yearOfStudy: string): number[] {
  const mapping = getUserAvailableSemesters(yearOfStudy)
  return mapping ? mapping.semesters : [1, 2] // Default to FE
}

export function isBranchRequired(year: string): boolean {
  // Branches are only required from Second Year onwards
  return year !== "FE"
}

export function getFullYearName(year: string): string {
  const mapping = getUserAvailableSemesters(year)
  return mapping?.yearLabel || year
}
