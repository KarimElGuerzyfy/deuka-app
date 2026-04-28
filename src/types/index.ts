// Base types
export type Category =
  | 'article'
  | 'conjunction'
  | 'preposition'
  | 'verb'
  | 'pronoun'
  | 'adverb'
  | 'adjective'
  | 'noun'
  | 'number';

export type Level = 'A1' | 'A2' | 'B1' | 'B2';

export type CompletedBucketKey = `${Level}-${number}-${number}`;

export type UserProgress = {
  level: Level;
  currentCenturion: number;
  currentBucket: number;
  completedBuckets: CompletedBucketKey[];
};

// Re-export vocabulary domain types
export * from './vocabulary';