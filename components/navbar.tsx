'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import { useAcademicContext } from '@/contexts/academic-context'
import React from 'react'

interface NavbarProps {
  onShowChangeClick: () => void;
}

export default function Navbar({ onShowChangeClick }: NavbarProps) {
  const { academicInfo } = useAcademicContext();

  return (
    <header className="sticky top-0 z-40 w-full border-b-8 border-black bg-white">
      <div className="container flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/landing" className="flex items-center gap-3 md:gap-4 hover:opacity-80 transition-opacity">
            <Image
              src="/images/musty-logo.png"
              alt="MUSTY Logo"
              width={48}
              height={48}
              className="w-10 h-10 md:w-12 md:h-12 border-2 border-black"
            />
            <span className="font-black text-2xl tracking-tighter text-black">MUSTY</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="default" className="text-uppercase border-4 border-black font-black shadow-brutal h-12 text-black">
              DASHBOARD
            </Button>
          </Link>
          <Link href="/study">
            <Button variant="default" className="text-uppercase border-4 border-black font-black shadow-brutal h-12 text-black">
              STUDY
            </Button>
          </Link>
          <div className="hidden md:flex items-center gap-2 bg-blue-100 border-4 border-black px-4 py-2">
            <span className="font-bold text-sm text-black">
              {academicInfo.year} • Sem {academicInfo.semester}
              {academicInfo.branch && ` • ${academicInfo.branch}`}
            </span>
          </div>
          <Button onClick={onShowChangeClick} variant="outline" className="border-4 border-black font-bold">
            <Settings className="h-4 w-4 mr-2" />
            CHANGE
          </Button>
        </div>
      </div>
    </header>
  );
} 