// src/components/QuizScreen.tsx
import React, { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

export const QuizScreen = () => {
  const { 
    timeLeft, 
    isQuizActive, 
    hasAnswered, 
    score, 
    tick, 
    startGame 
  } = useGameStore();

  // This hook handles the "5-second clock"
  useEffect(() => {
    if (!isQuizActive || hasAnswered) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [isQuizActive, hasAnswered, tick]);

  if (!isQuizActive) {
    return <button onClick={startGame}>Start Quiz</button>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl">Score: {score}</h2>
      <div className={`text-4xl ${timeLeft <= 2 ? 'text-red-500' : 'text-black'}`}>
        Time Left: {timeLeft}s
      </div>
      
      {hasAnswered && (
        <div className="mt-4 text-gray-500">
          Waiting for next question...
        </div>
      )}
    </div>
  );
};