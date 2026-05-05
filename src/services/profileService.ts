// src/services/profileService.ts

export interface UserProfile {
  currentLevel: string
  currentCenturionIndex: number
  currentBucketIndex: number
  wordsMastered: number
  bucketsCleared: number
  displayLanguage: 'en' | 'ar'
  timerEnabled: boolean
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export async function loadProfile(
  userId: string,
  accessToken: string
): Promise<UserProfile | null> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=*`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: ANON_KEY,
      },
    }
  )

  if (!res.ok) {
    console.error('[profileService] loadProfile failed:', res.status)
    return null
  }

  const data = await res.json()
  if (!Array.isArray(data) || data.length === 0) return null

  const row = data[0]
  return {
    currentLevel: row.current_level,
    currentCenturionIndex: row.current_centurion_index,
    currentBucketIndex: row.current_bucket_index,
    wordsMastered: row.words_mastered,
    bucketsCleared: row.buckets_cleared,
    displayLanguage: row.display_language,
    timerEnabled: row.timer_enabled,
  }
}

export async function saveProfile(
  userId: string,
  profile: UserProfile,
  accessToken: string
): Promise<void> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: ANON_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        current_level: profile.currentLevel,
        current_centurion_index: profile.currentCenturionIndex,
        current_bucket_index: profile.currentBucketIndex,
        words_mastered: profile.wordsMastered,
        buckets_cleared: profile.bucketsCleared,
        display_language: profile.displayLanguage,
        timer_enabled: profile.timerEnabled,
        updated_at: new Date().toISOString(),
      }),
    }
  )

  if (!res.ok) {
    console.error('[profileService] saveProfile failed:', res.status)
  }
}