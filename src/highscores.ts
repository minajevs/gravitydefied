export type ScoreEntry = {
  name: string
  time: number
}

type HighScoreData = Record<
  string,
  Record<string, Record<string, ScoreEntry[]>>
>

const STORAGE_KEY = "gd.highscores.v1"
const NAME_DEFAULT = "AAA"
const MAX_TIME = 0xffff28

const loadData = (): HighScoreData => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as HighScoreData
    return parsed ?? {}
  } catch {
    return {}
  }
}

const saveData = (data: HighScoreData) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore storage failures
  }
}

const trimName = (name: string) => {
  let raw = (name || "").toUpperCase()
  if (raw.length > 3) raw = raw.slice(0, 3)
  else if (raw.length < 3) raw = NAME_DEFAULT
  return raw
}

const getScoresBucket = (
  data: HighScoreData,
  levelIndex: number,
  trackIndex: number,
  leagueIndex: number
) => {
  const l = String(levelIndex)
  const t = String(trackIndex)
  const g = String(leagueIndex)
  data[l] ??= {}
  data[l][t] ??= {}
  data[l][t][g] ??= []
  return data[l][t][g]
}

export const getHighScores = (
  levelIndex: number,
  trackIndex: number,
  leagueIndex: number
) => {
  const data = loadData()
  const bucket = getScoresBucket(data, levelIndex, trackIndex, leagueIndex)
  return bucket.slice(0, 3)
}

export const getPlaceForTime = (
  levelIndex: number,
  trackIndex: number,
  leagueIndex: number,
  time: number
) => {
  const scores = getHighScores(levelIndex, trackIndex, leagueIndex)
  for (let place = 0; place < 3; place++) {
    const entry = scores[place]
    if (!entry || entry.time === 0 || entry.time > time) return place
  }
  return 3
}

export const saveHighScore = (
  levelIndex: number,
  trackIndex: number,
  leagueIndex: number,
  name: string,
  time: number
) => {
  const data = loadData()
  const bucket = getScoresBucket(data, levelIndex, trackIndex, leagueIndex)
  const safeTime = Math.min(Math.max(0, time), MAX_TIME)
  const entry = { name: trimName(name), time: safeTime }

  let insertAt = bucket.length
  for (let i = 0; i < bucket.length; i++) {
    if (bucket[i].time === 0 || bucket[i].time > entry.time) {
      insertAt = i
      break
    }
  }

  bucket.splice(insertAt, 0, entry)
  bucket.length = Math.min(bucket.length, 3)
  saveData(data)
  return bucket.slice(0, 3)
}

export const formatScoreEntry = (entry: ScoreEntry) => {
  const total = Math.max(0, Math.floor(entry.time))
  const secondsTotal = Math.floor(total / 100)
  const hundredths = total % 100
  const minutes = Math.floor(secondsTotal / 60)
  const seconds = secondsTotal % 60
  const mm = minutes.toString().padStart(2, "0")
  const ss = seconds.toString().padStart(2, "0")
  const hh = hundredths.toString().padStart(2, "0")
  return `${entry.name} ${mm}:${ss}.${hh}`
}

export const clearAllHighScores = () => {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
