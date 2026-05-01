import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

export const QuizScreen = () => {
  const { 
    timeLeft, 
    isQuizActive, 
    score, 
    tickTimer, 
    setQuizActive 
  } = useGameStore();

  // This hook handles the "5-second clock"
  useEffect(() => {
    if (!isQuizActive) return;

    const interval = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [isQuizActive, tickTimer]);

  if (!isQuizActive) {
    return <button onClick={() => setQuizActive(true)}>Start Quiz</button>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl">Score: {score}</h2>
      <div className={`text-4xl ${timeLeft <= 2 ? 'text-red-500' : 'text-black'}`}>
        Time Left: {timeLeft}s
      </div>
    </div>
  );
};