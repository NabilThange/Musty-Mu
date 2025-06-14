'use client'

import React, { useState } from 'react'
import { QuizCard, QuizItem } from './QuizCard'
import { ScoreCard } from './ScoreCard'

export function QuizDeck({ questions }: { questions: QuizItem[] }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answersByType, setAnswersByType] = useState<Record<string, { correct: number, total: number }>>({});
  const [quizComplete, setQuizComplete] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto border-4 border-black bg-white p-6 text-center font-bold">
        No quiz questions available for this topic yet.
      </div>
    )
  }

  const handleAnswer = (selected: string) => {
    if (selectedOption !== null) return;

    setSelectedOption(selected);

    const currentQuizItem = questions[currentQuestionIndex];
    const isCorrect = selected === currentQuizItem.answer;

    if (isCorrect) {
      setScore(score + 1);
    }

    const type = currentQuizItem.type || 'General';
    setAnswersByType(prev => ({
      ...prev,
      [type]: {
        correct: (prev[type]?.correct || 0) + (isCorrect ? 1 : 0),
        total: (prev[type]?.total || 0) + 1
      }
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setQuizComplete(true);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
    }
  };

  const restartQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswersByType({});
    setQuizComplete(false);
  };

  const isNextEnabled = selectedOption !== null && currentQuestionIndex !== questions.length - 1;

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  if (quizComplete) {
    return (
      <ScoreCard 
        score={score}
        totalQuestions={totalQuestions}
        answersByType={answersByType}
        onRestart={restartQuiz}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center max-w-2xl mx-auto text-sm font-bold text-black">
        <span>Score: {score}/{currentQuestionIndex + 1}</span>
        <span>Progress: {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%</span>
      </div>

      <QuizCard item={currentQuestion} selected={selectedOption} handleAnswer={handleAnswer} />

      <div className="flex justify-between items-center max-w-2xl mx-auto mt-4">
        <button
          onClick={goToPrevQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 border-2 border-black bg-gray-200 font-bold uppercase disabled:opacity-50 text-black"
        >
          Prev
        </button>

        <span className="text-sm font-bold text-gray-600">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>

        <button
          onClick={goToNextQuestion}
          disabled={!isNextEnabled}
          className={`px-4 py-2 border-2 border-black font-bold uppercase disabled:opacity-50 text-black ${isNextEnabled ? 'bg-yellow-500 shadow-brutal' : 'bg-blue-500'}`}
        >
          Next
        </button>
      </div>
    </div>
  )
} 