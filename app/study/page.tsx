'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import { useAcademicContext } from '@/contexts/academic-context'
import { AcademicSelector, AcademicSelectorModal } from '@/components/academic-selector'
import CourseCard from '@/components/course-card'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid' // Import for week/day views

const motivationalQuotes = [
    "I refuse to let my comfort zone become my prison of mediocrity.",
    "I would rather stumble forward than stand still in perfect laziness.",
    "I am not lazy, I am just saving energy for my breakthrough moment.",
    "I choose progress over perfection, action over endless planning.",
    "I will turn my potential into power through small daily victories.",
    "I am too talented to waste my gifts on temporary comfort.",
    "I transform my laziness into focused energy when it truly matters.",
    "I would rather fail trying than succeed at doing nothing.",
    "I am building my empire one uncomfortable step at a time.",
    "I refuse to let yesterday's laziness define tomorrow's possibilities.",
    "I choose to be uncomfortable now rather than regretful later.",
    "I am not behind, I am just getting started at my own pace.",
    "I turn my procrastination into preparation for the right moment.",
    "I would rather be exhausted from pursuing dreams than rested in regret.",
    "I am too smart to settle for the easy path forever.",
    "I choose growth over comfort, discipline over temporary pleasure.",
    "I am not wasting time, I am gathering strength for my comeback.",
    "I refuse to let my talent die with my excuses.",
    "I would rather struggle upward than coast downward in comfort.",
    "I am transforming my potential into purpose, one day at a time."
  ];

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

interface Course {
  id: string;
  name: string;
  subtext: string;
  thumbnailText?: string;
  cardBgColor: string;
}

interface CalendarEvent {
  id?: string;
  title: string;
  date: string;
  type?: 'assignment' | 'exam' | 'review' | 'general';
  color?: string;
}

// Custom Event Add Modal Component
const EventAddModal = ({ isOpen, onClose, onAdd, selectedDate }: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: CalendarEvent) => void;
  selectedDate: string;
}) => {
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<'assignment' | 'exam' | 'review' | 'general'>('general');

  const eventTypeColors = {
    assignment: 'var(--brutalist-red)',
    exam: 'var(--brutalist-blue)',
    review: 'var(--brutalist-purple)',
    general: 'var(--brutalist-green)'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({
        title: title.trim(),
        date: selectedDate,
        type: eventType,
        color: eventTypeColors[eventType], // Pass color here, will be transformed in handleAddEvent
        id: Date.now().toString()
      });
      setTitle('');
      setEventType('general');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-brutalist">
      <div className="modal-brutalist-content">
        <div className="modal-brutalist-header">
          <h3 className="text-2xl font-black uppercase tracking-tighter" style={{ color: 'var(--force-black)' }}>ADD EVENT</h3>
          <button 
            onClick={onClose}
            className="btn-brutalist bg-red-500 text-white hover:bg-red-600 !p-2 !shadow-none !translate-y-0"
          >
            ×
          </button>
        </div>
        
        <div className="modal-brutalist-body" style={{ color: 'var(--force-black)' }}>
          <div className="mb-4 p-3 bg-yellow-100 border-4 border-black">
            <p className="font-bold text-sm uppercase">DATE: {new Date(selectedDate).toLocaleDateString()}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-black uppercase mb-2">EVENT TITLE</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-brutalist w-full text-lg uppercase"
                placeholder="ENTER EVENT NAME"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-black uppercase mb-2">EVENT TYPE</label>
              <div className="grid grid-cols-2 gap-2">
                {(['general', 'assignment', 'exam', 'review'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setEventType(type)}
                    className={`btn-brutalist text-sm ${eventType === type ? `bg-[${eventTypeColors[type]}] text-black` : 'bg-white text-black'}`}
                    style={{ backgroundColor: eventType === type ? eventTypeColors[type] : undefined, boxShadow: eventType === type ? 'var(--shadow-brutal-sm)' : 'var(--shadow-brutal-md)' }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="btn-brutalist bg-brutalist-blue flex-1"
                style={{ color: 'var(--force-black)' }}
              >
                ADD EVENT
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-brutalist bg-brutalist-gray text-black flex-1"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function StudyPage() {
  const { academicInfo, isContextSet, clearContext } = useAcademicContext()
  const [showSelector, setShowSelector] = useState(false)
  const [pageTitle, setPageTitle] = useState<string>('Study Schedule')
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false)
  const [currentQuote, setCurrentQuote] = useState<string>('')
  const [courses, setCourses] = useState<Course[]>([])
  const [calendarEvents, setCalendarEvents] = useState<any[]>([])
  const [activeCalendarTab, setActiveCalendarTab] = useState<string>('Week')
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const calendarRef = useRef<FullCalendar>(null);
  const [showChangeCoverButton, setShowChangeCoverButton] = useState(false);

  useEffect(() => {
    if (!isContextSet) {
      setShowSelector(true)
    }
  }, [isContextSet])

  useEffect(() => {
    const savedTitle = localStorage.getItem('studyPageTitle')
    if (savedTitle) {
      setPageTitle(savedTitle)
    }

    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[randomIndex]);

    const initialCourses: Course[] = [
      { id: '1', name: 'YOUR COURSE', subtext: 'www.yourcourse', thumbnailText: 'Thumbnail Placeholder', cardBgColor: '' },
      { id: '2', name: 'writing', subtext: 'something about this course', thumbnailText: 'Thumbnail Placeholder', cardBgColor: '' },
    ];

    const coursesWithRandomColors = initialCourses.map(course => ({
      ...course,
      cardBgColor: cardBackgrounds[Math.floor(Math.random() * cardBackgrounds.length)],
    }));
    setCourses(coursesWithRandomColors);

    // Initialize calendar events
    const initialEvents: any[] = [
      { 
        id: '1',
        title: 'IIT : ORIENTATION', 
        date: '2026-06-09',
        extendedProps: { 
          type: 'general',
          color: '#96CEB4'
        }
      },
      { 
        id: '2',
        title: 'Assignment Due', 
        date: '2026-06-15',
        extendedProps: { 
          type: 'assignment',
          color: '#FF6B6B'
        }
      }
    ];
    setCalendarEvents(initialEvents);

  }, [])

  useEffect(() => {
    localStorage.setItem('studyPageTitle', pageTitle)
  }, [pageTitle])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageTitle(e.target.value)
  }

  const handleTitleBlur = () => {
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false)
    }
  }

  const handleNewCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: 'NEW COURSE',
      subtext: 'Placeholder for new course details',
      thumbnailText: 'New Course Thumbnail',
      cardBgColor: cardBackgrounds[Math.floor(Math.random() * cardBackgrounds.length)],
    };
    setCourses(prevCourses => [...prevCourses, newCourse]);
  };

  const handleDateClick = (info: any) => {
    setSelectedDate(info.dateStr);
    setShowEventModal(true);
  };

  const handleAddEvent = (newEvent: CalendarEvent) => {
    // Transform newEvent to FullCalendar's expected structure
    const fcEvent = {
      id: newEvent.id,
      title: newEvent.title,
      date: newEvent.date,
      extendedProps: {
        type: newEvent.type,
        color: newEvent.color // Store color in extendedProps
      }
    };
    setCalendarEvents(prev => [...prev, fcEvent]);
  };

  const handleCalendarViewChange = (view: string) => {
    setActiveCalendarTab(view);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      if (view === 'Week') {
        calendarApi.changeView('timeGridWeek');
      } else if (view === 'Month') {
        calendarApi.changeView('dayGridMonth');
      }
    }
  };

  const handleChangeCover = () => {
    // Placeholder for actual cover change logic
    console.log("Change cover clicked!");
    // In a real application, this would open a file picker or a modal
  };

  const renderTitle = () => {
    const parts = pageTitle.split(' ')
    const studyIndex = parts.indexOf('Study')
    
    if (isEditingTitle) {
      return (
        <input
          type="text"
          value={pageTitle}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          onKeyDown={handleTitleKeyDown}
          className="font-mono text-4xl font-black uppercase tracking-tighter text-black bg-transparent border-none outline-none w-full"
          autoFocus
        />
      )
    } else {
      return (
        <h1 className="font-mono text-4xl font-black uppercase tracking-tighter text-black" onClick={() => setIsEditingTitle(true)}>
            {pageTitle.split(' ').map((word, index) => (
              <React.Fragment key={index}>
                {word === 'Study' ? (
                  <span className="bg-primary-blue text-black px-2 py-1">{word}</span>
                ) : (
                  <span className="text-black">{word}</span>
                )}
                {index < pageTitle.split(' ').length - 1 && ' '}
              </React.Fragment>
            ))}
          </h1>
      )
    }
  }

  if (!isContextSet) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white font-mono px-4">
        <AcademicSelector onComplete={() => setShowSelector(false)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-mono">
      <Navbar onShowChangeClick={() => setShowSelector(true)} />

      {/* Cover Image (Banner on Top) */}
      <div
        className="w-full h-48 bg-gray-200 flex items-center justify-center border-b-8 border-black relative overflow-hidden"
        onMouseEnter={() => setShowChangeCoverButton(true)}
        onMouseLeave={() => setShowChangeCoverButton(false)}
      >
        <img
          src="/images/study.png" // Path to the image
          alt="Study banner"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none zoom-out-75"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Dark overlay for text readability */}
        {/* <h2 className="font-black text-4xl uppercase tracking-tighter text-white z-10">Study Schedule</h2> */} {/* Changed text to white for contrast */}

        {showChangeCoverButton && (
          <button
            onClick={handleChangeCover}
            className="absolute top-4 right-4 bg-white text-black border-4 border-black font-black uppercase text-sm px-4 py-2 shadow-brutal transition-all hover:translate-y-1 hover:shadow-none z-20"
          >
            Change Cover
          </button>
        )}
      </div>

      <div className="container mx-auto px-4 py-8 max-w-[1200px]">
        {/* Page Icon and Title */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-5xl">📘</span>
          {renderTitle()}
        </div>

        {/* Welcome Text / Instructions */}
        <div className="border-4 border-black p-4 mb-8 bg-yellow-100 font-bold">
          <span className="text-black">{currentQuote}</span>
        </div>

        {/* Courses Section */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-black">Courses</h2>
            <div className="flex gap-2">
              <Button variant="default" size="default">Active</Button>
              <Button variant="default" size="default">Past</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <CourseCard
                key={course.id}
                id={course.id}
                name={course.name}
                subtext={course.subtext}
                thumbnailText={course.thumbnailText}
                cardBgColor={course.cardBgColor}
              />
            ))}
            <div className="bg-white border-8 border-black p-8 shadow-brutal hover:-translate-y-4 hover:shadow-none transition-all text-left flex flex-col items-center justify-center cursor-pointer" onClick={handleNewCourse}>
              <span className="text-6xl mb-4 text-black">+</span>
              <h3 className="font-black text-xl uppercase text-black">New Page</h3>
            </div>
          </div>
        </div>

        {/* Enhanced Brutalist Calendar Section */}
        <div className="mb-12">
          {/* Calendar Header with Bauhaus-inspired design */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">📅</span>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-black">Calendar Scheduler</h2>
            </div>
            
            {/* Brutalist Tab Navigation */}
            <div className="flex flex-wrap gap-2 p-4 bg-gray-100 border-8 border-black shadow-brutal">
              {[ 
                { key: 'Week', color: 'bg-blue-400', icon: '📊' },
                { key: 'Month', color: 'bg-green-400', icon: '🗓️' },
                { key: 'Review', color: 'bg-yellow-400', icon: '📝' },
                { key: 'Assignments', color: 'bg-red-400', icon: '📋' },
                { key: 'Exams', color: 'bg-purple-400', icon: '📖' },
                { key: 'Analytics', color: 'bg-orange-400', icon: '📈' }
              ].map(({ key, color, icon }) => (
                <button
                  key={key}
                  onClick={() => handleCalendarViewChange(key)}
                  className={`
                    flex items-center gap-2 px-4 py-3 border-4 border-black font-black uppercase text-sm
                    transition-all shadow-brutal hover:translate-y-1 hover:shadow-none
                    ${activeCalendarTab === key 
                      ? `${color} text-black` 
                      : 'bg-white text-black hover:bg-gray-200'
                    }
                  `}
                >
                  <span>{icon}</span>
                  {key}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Calendar Container */}
          <div className="relative">
            {/* Calendar Geometric Background Elements (Bauhaus-inspired) */}
            <div className="absolute top-4 left-4 w-16 h-16 bg-red-500 opacity-20 rotate-45 z-0"></div>
            <div className="absolute top-8 right-8 w-12 h-12 bg-yellow-400 opacity-30 rounded-full z-0"></div>
            <div className="absolute bottom-4 left-1/4 w-20 h-8 bg-blue-400 opacity-25 z-0"></div>
            
            <div className="relative z-10 border-8 border-black bg-white shadow-brutal">
              {/* Custom Calendar Header */}
              <div className="bg-black text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500"></div>
                  <div className="w-4 h-4 bg-yellow-400"></div>
                  <div className="w-4 h-4 bg-blue-400"></div>
                </div>
                <h3 className="font-black uppercase tracking-wider">Schedule Matrix</h3>
                <div className="text-right text-sm">
                  <div className="font-bold">ACTIVE VIEW</div>
                  <div className="text-xs opacity-75">{activeCalendarTab.toUpperCase()}</div>
                </div>
              </div>

              {/* Calendar Content */}
              <div className="p-6">
                {(activeCalendarTab === 'Week' || activeCalendarTab === 'Month') ? (
                  <div className="brutalist-calendar-wrapper">
                    <FullCalendar
                      ref={calendarRef}
                      plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                      initialView={activeCalendarTab === 'Week' ? 'timeGridWeek' : 'dayGridMonth'}
                      headerToolbar={{
                        left: 'prev,next',
                        center: 'title',
                        right: 'today'
                      }}
                      events={calendarEvents}
                      dateClick={handleDateClick}
                      height={activeCalendarTab === 'Week' ? '485px' : 'auto'}
                      eventDisplay="block"
                      dayMaxEvents={3}
                      eventContent={(eventInfo) => (
                        <div 
                          className="brutalist-event"
                          style={{ backgroundColor: eventInfo.event.extendedProps.color }}
                        >
                          <div className="brutalist-event-title">
                            {eventInfo.event.title}
                          </div>
                        </div>
                      )}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-black animate-pulse"></div>
                      <div className="w-12 h-8 bg-red-500 animate-pulse delay-100"></div>
                      <div className="w-6 h-8 bg-yellow-400 animate-pulse delay-200"></div>
                    </div>
                    <p className="font-black text-2xl uppercase text-black tracking-tighter">
                      {activeCalendarTab} MODULE
                    </p>
                    <p className="text-sm uppercase font-bold text-gray-600">
                      UNDER CONSTRUCTION
                    </p>
                  </div>
                )}
              </div>

              {/* Calendar Legend/Info Bar */}
              <div className="bg-gray-100 border-t-4 border-black p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="font-black text-sm uppercase" style={{ color: 'var(--force-black)' }}>EVENT TYPES:</span>
                    <div className="flex gap-2">
                      {[ 
                        { type: 'general', color: 'var(--brutalist-green)', label: 'General' },
                        { type: 'assignment', color: 'var(--brutalist-red)', label: 'Assignment' },
                        { type: 'exam', color: 'var(--brutalist-blue)', label: 'Exam' },
                        { type: 'review', color: 'var(--brutalist-purple)', label: 'Review' }
                      ].map(({ type, color, label }) => (
                        <div key={type} className="flex items-center gap-1">
                          <div 
                            className="w-4 h-4 border-2 border-black" 
                            style={{ backgroundColor: color }}
                          ></div>
                          <span className="text-xs font-bold uppercase">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold uppercase" style={{ color: 'var(--force-black)' }}>
                      Click any date to add events
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Event Modal */}
      <EventAddModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onAdd={handleAddEvent}
        selectedDate={selectedDate}
      />

      <AcademicSelectorModal isOpen={showSelector} onClose={() => setShowSelector(false)} />
    </div>
  );
} 