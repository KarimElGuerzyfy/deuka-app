export type Category =
  | 'article'
  | 'conjunction'
  | 'preposition'
  | 'verb'
  | 'pronoun'
  | 'adverb'
  | 'adjective'
  | 'noun'
  | 'number'

export type Level = 'A1' | 'A2' | 'B1' | 'B2'

// e.g. "A1-1-5" — level, centurion number, bucket number
export type CompletedBucketKey = `${Level}-${number}-${number}`

export type Word = {
  id: string
  de: string
  en: string
  sentence: string
  category: Category
}

export type Bucket = {
  bucketNumber: number
  words: Word[]
}

export type Centurion = {
  centurionNumber: number
  buckets: Bucket[]
}

export type UserProgress = {
  level: Level
  currentCenturion: number
  currentBucket: number
  completedBuckets: CompletedBucketKey[]
}

export type QuizQuestion = {
  word: Word
  options: string[]
  correctAnswer: string
}