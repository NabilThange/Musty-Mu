'use client'

import React from 'react';
import { QuizItem } from './QuizCard';

interface ScoreCardProps {
  score: number;
  totalQuestions: number;
  answersByType: Record<string, { correct: number, total: number }>;
  onRestart: () => void;
}

export function ScoreCard({ score, totalQuestions, answersByType, onRestart }: ScoreCardProps) {
  const percentage = Math.round((score / totalQuestions) * 100);

  // Function to get recommendations based on performance by type
  const getRecommendations = () => {
    const recommendations = [];

    Object.entries(answersByType).forEach(([type, stats]) => {
      const percentage = (stats.correct / stats.total) * 100;

      if (percentage < 80) {
        recommendations.push({
          topic: type,
          percentage,
          priority: 'high',
          message: 'Needs significant practice',
        });
      } else if (percentage < 90) {
        recommendations.push({
          topic: type,
          percentage,
          priority: 'medium',
          message: 'Room for improvement',
        });
      }
    });

    return recommendations.sort((a, b) => a.percentage - b.percentage);
  };

  const recommendations = getRecommendations();

  return (
    <div className="w-full max-w-2xl mx-auto border-4 border-black bg-white p-6 space-y-6 text-black">
      <h2 className="text-2xl font-black text-center uppercase">Quiz Complete!</h2>

      <div className="text-center space-y-2">
        <h3 className="text-4xl font-black">{percentage}%</h3>
        <p className="text-xl font-bold">{score} out of {totalQuestions} correct</p>
        {percentage >= 90 ? (
          <p className="text-green-600 font-bold">Excellent work! Keep it up!</p>
        ) : percentage >= 80 ? (
          <p className="text-yellow-700 font-bold">Great job! Almost there!</p>
        ) : (
          <p className="text-red-600 font-bold">Good effort! Let's focus on improving.</p>
        )}
      </div>

      {/* Performance Breakdown by Topic */}
      {Object.keys(answersByType).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-black uppercase">Performance Breakdown by Topic</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(answersByType).map(([type, stats]) => (
              <div key={type} className="border-2 border-black p-3">
                <span className="font-bold">{type}:</span> {Math.round((stats.correct / stats.total) * 100)}% ({stats.correct}/{stats.total})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis and Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-black uppercase">Areas to Focus On</h3>
          <ul className="list-disc list-inside space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className={`font-bold ${rec.priority === 'high' ? 'text-red-600' : 'text-yellow-700'}`}>
                {rec.topic}: {rec.message} ({Math.round(rec.percentage)}% correct)
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Restart Button */}
      <div className="text-center mt-6">
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-blue-500 text-white font-black uppercase border-4 border-black hover:bg-blue-600 transition-colors shadow-brutal"
        >
          Restart Quiz
        </button>
      </div>
    </div>
  );
} 