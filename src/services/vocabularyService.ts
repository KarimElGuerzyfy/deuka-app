import { vocabulary } from '../data';
import type { Word, Bucket, Level } from '../types';

export const vocabularyService = {
  /**
   * Fetches a specific bucket from the vocabulary store.
   */
  getBucket: (level: Level, centurionIndex: number, bucketIndex: number): Bucket => {
    const centurions = vocabulary[level];
    
    if (!centurions) {
      throw new Error(`Level ${level} does not exist in vocabulary.`);
    }

    const centurion = centurions[centurionIndex];
    if (!centurion) {
      throw new Error(`Centurion ${centurionIndex} not found for level ${level}.`);
    }

    const bucket = centurion.buckets[bucketIndex];
    if (!bucket) {
      throw new Error(`Bucket ${bucketIndex} not found in Centurion ${centurionIndex}.`);
    }

    return bucket;
  },

  /**
   * Returns a random word from the provided bucket.
   */
  generateWord: (bucket: Bucket): Word => {
    const randomIndex = Math.floor(Math.random() * bucket.words.length);
    return bucket.words[randomIndex];
  },

  /**
   * Returns 3 unique, incorrect options for the quiz based on the current bucket.
   */
  getDistractors: (currentWord: Word, bucket: Bucket): Word[] => {
    return bucket.words
      .filter((w) => w.id !== currentWord.id) // Exclude the correct word
      .sort(() => 0.5 - Math.random())        // Shuffle the remainder
      .slice(0, 3);                           // Pick 3
  }
};