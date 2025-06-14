import React, { useState, useEffect } from 'react'

export interface QuizItem {
  question: string
  options: string[]
  answer: string
  explanation: string
  type?: string
  importance?: string
}

interface QuizCardProps {
  item: QuizItem
  selected: string | null
  handleAnswer: (option: string) => void
}

export function QuizCard({ item, selected, handleAnswer }: QuizCardProps) {
  const [showElaboration, setShowElaboration] = useState(false);

  // Reset elaboration state when question changes
  useEffect(() => {
    setShowElaboration(false);
  }, [item.question]);

  const handleElaborateClick = () => {
    setShowElaboration(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto border-4 border-black bg-white p-6 space-y-4">
      {/* Metadata */}
      <div className="flex justify-between text-xs font-bold uppercase text-black">
        <span>Type: {item.type || 'N/A'}</span>
        {item.importance && <span>Importance: {item.importance}</span>}
      </div>

      {/* Question */}
      <h2 className="text-xl font-black text-black">{item.question}</h2>

      {/* Options */}
      <div className="grid gap-4">
        {item.options.map((option, i) => {
          const isCorrect = option === item.answer
          const isSelected = option === selected

          let optionClass =
            'border-2 border-black p-3 text-left font-bold cursor-pointer transition-all text-black'

          if (selected) {
            // If an option is selected, apply feedback colors
            if (isCorrect) {
              optionClass += ' bg-green-200' // Correct answer is green
            } else if (isSelected) {
              optionClass += ' bg-red-200' // Incorrect selected answer is red
            } else {
              optionClass += ' bg-gray-100' // Unselected incorrect answers are gray
            }
          } else {
            // No option selected yet, apply hover effect
            optionClass += ' hover:bg-yellow-100'
          }

          return (
            <button
              key={i}
              className={optionClass}
              onClick={() => !selected && handleAnswer(option)} // Only allow clicking if no option is selected
              disabled={!!selected || showElaboration} // Disable after selection or if elaboration is shown
            >
              {option}
            </button>
          )
        })}
      </div>

      {/* Elaborate Button */}
      {!showElaboration && selected && (
        <button
          className="mt-4 w-full bg-blue-500 text-white font-black uppercase py-3 border-4 border-black hover:bg-blue-600 transition-colors shadow-brutal"
          onClick={handleElaborateClick}
        >
          Elaborate
        </button>
      )}

      {/* Answer Details (shown after elaborating) */}
      {showElaboration && selected && (
        <div className="mt-4 p-4 border-t-2 border-black bg-yellow-100 text-black text-sm font-medium space-y-2">
          <p>✅ <strong>Correct Answer:</strong> {item.answer}</p>
          <p>🧠 <strong>Explanation:</strong> {item.explanation}</p>
          {item.importance && <p>🌟 <strong>Importance:</strong> {item.importance}</p>}
        </div>
      )}
    </div>
  )
}