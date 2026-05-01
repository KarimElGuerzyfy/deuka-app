import type { Category } from './index';

export type Word = {
  id: string;
  de: string;
  en: string;
  ar: string; // Added Arabic translation
  sentence: string;
  category: Category;
};

export type Bucket = {
  bucketNumber: number;
  words: Word[];
};

export type Centurion = {
  centurionNumber: number;
  buckets: Bucket[];
};

export type QuizQuestion = {
  word: Word;
  options: string[];
  correctAnswer: string;
};