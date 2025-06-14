'use client'

import React from 'react'
import Link from 'next/link'

interface CourseCardProps {
  id: string;
  name: string;
  subtext: string;
  thumbnailText?: string;
  cardBgColor: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ id, name, subtext, thumbnailText, cardBgColor }) => {
  return (
    <Link href={`/study/${id}`}>
      <div className={`${cardBgColor} border-8 border-black p-8 shadow-brutal hover:-translate-y-1 hover:shadow-none transition-all text-left`}>
        <div className="w-full h-32 bg-white mb-4 flex items-center justify-center font-bold text-black">
          {thumbnailText || "Thumbnail Placeholder"}
        </div>
        <h3 className="font-black text-xl uppercase mb-2 text-black">{name}</h3>
        <p className="font-bold text-sm text-black">{subtext}</p>
      </div>
    </Link>
  );
};

export default CourseCard; 