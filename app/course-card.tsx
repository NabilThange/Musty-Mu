"use client"

import type React from "react"
import Link from "next/link"

interface CourseCardProps {
  title: string
  code: string
  progress: number
  color: string
  textColor: string
  assignments: number
  totalAssignments: number
  nextExam: string
  completed?: boolean
}

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  code,
  progress,
  color,
  textColor,
  assignments,
  totalAssignments,
  nextExam,
  completed = false,
}) => {
  return (
    <div className={`${color} ${textColor} border-8 border-black p-6 shadow-brutal relative overflow-hidden`}>
      {/* Completion Badge */}
      {completed && (
        <div className="absolute top-4 right-4 bg-green-500 text-black border-4 border-black px-3 py-1 font-black text-xs">
          ✓ COMPLETED
        </div>
      )}

      {/* Course Header */}
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-black mb-2 uppercase leading-tight">{title}</h3>
        <p className="text-lg font-bold opacity-90">{code}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-sm">PROGRESS</span>
          <span className="font-bold text-sm">{progress}%</span>
        </div>
        <div className="w-full h-4 bg-black border-2 border-white">
          <div className="h-full bg-white transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-black">{assignments}</div>
          <div className="text-xs font-bold opacity-75">COMPLETED</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black">{totalAssignments}</div>
          <div className="text-xs font-bold opacity-75">TOTAL</div>
        </div>
      </div>

      {/* Next Exam/Assignment */}
      <div className="mb-6 p-3 bg-black bg-opacity-20 border-2 border-white">
        <p className="text-xs font-bold opacity-75 mb-1">NEXT:</p>
        <p className="font-bold text-sm">{nextExam}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Link
          href={`/syllabus?course=${code}`}
          className="flex-1 bg-white text-black border-4 border-black px-4 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all text-center text-sm"
        >
          STUDY
        </Link>
        <Link
          href={`/resources?course=${code}`}
          className="flex-1 bg-white text-black border-4 border-black px-4 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all text-center text-sm"
        >
          RESOURCES
        </Link>
      </div>
    </div>
  )
}

export default CourseCard
