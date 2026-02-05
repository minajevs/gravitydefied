import { GameView } from "./Game/gameview"
import { Physics } from "./Game/physics"
import { keys, LEFT, RIGHT, UP, DOWN } from "./keyboard"
import { Level } from "./Levels/level"
import { Loader } from "./Levels/loader"
import { Reader } from "./Levels/reader"
import { readStreamToEnd, skipBytes } from "./Levels/readerUtils"
import { Activity } from "./activity"
import { STRINGS } from "./strings"
import {
  clearAllHighScores,
  formatScoreEntry,
  getHighScores,
  getPlaceForTime,
  saveHighScore,
} from "./highscores"

const canvas = document.createElement("canvas")
;((canvas.id = "GameCanvas"),
  (canvas.width = 400),
  (canvas.height = 600),
  (canvas.style.border = "1px solid"))
document.body.style.margin = "0"
document.body.style.minHeight = "100vh"
document.body.style.display = "flex"
document.body.style.alignItems = "center"
document.body.style.justifyContent = "center"
document.body.style.flexDirection = "column"
document.body.style.userSelect = "none"
;(document.body.style as any).webkitUserSelect = "none"
;(document.body.style as any).webkitTouchCallout = "none"
const gameRoot = document.createElement("div")
gameRoot.id = "game-root"
gameRoot.style.position = "relative"
gameRoot.style.width = `${canvas.width}px`
gameRoot.style.display = "flex"
gameRoot.style.flexDirection = "column"
gameRoot.style.alignItems = "center"
gameRoot.style.flex = "0 0 auto"
gameRoot.style.overflow = "visible"
gameRoot.addEventListener("contextmenu", (e) => e.preventDefault())
canvas.addEventListener("contextmenu", (e) => e.preventDefault())
const gameStage = document.createElement("div")
gameStage.id = "game-stage"
gameStage.style.position = "relative"
gameStage.style.width = `${canvas.width}px`
gameStage.style.height = `${canvas.height}px`
gameStage.appendChild(canvas)
gameRoot.appendChild(gameStage)
document.body.appendChild(gameRoot)

const ctx = canvas.getContext("2d")
const img = new Image()

const IMAGES_DELAY = 1000
const STATE_STORAGE_KEY = "gd.state.v1"

type PersistedSettings = {
  perspectiveIndex: number
  shadowsIndex: number
  driverSpriteIndex: number
  bikeSpriteIndex: number
  inputIndex: number
  lookAheadIndex: number
  vibrateIndex: number
  keyboardIndex: number
}

type PersistedState = {
  version: 1
  selectedLevel: number
  selectedTrack: number
  selectedLeague: number
  unlockedLevels: number
  unlockedTracks: number[]
  unlockedLeagues: number
  playerName: string
  settings: PersistedSettings
}

const loadPersistedState = (): Partial<PersistedState> | null => {
  try {
    const raw = window.localStorage.getItem(STATE_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    if (!parsed || typeof parsed !== "object") return null
    return parsed
  } catch {
    return null
  }
}

const savePersistedState = (state: PersistedState) => {
  try {
    window.localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore storage failures
  }
}

const normalizePlayerName = (value: unknown) => {
  if (typeof value !== "string") return "AAA"
  let name = value.toUpperCase()
  if (name.length < 3) name = name.padEnd(3, "A")
  if (name.length > 3) name = name.slice(0, 3)
  name = name.replace(/[^A-Z ]/g, "A")
  return name
}

type MenuItem = {
  label: string
  type: "action" | "submenu" | "option"
  target?: MenuScreen
  onSelect?: () => void
  onChange?: (dir: number) => void
  getValue?: () => string
}

type MenuScreen = {
  title: string
  items: MenuItem[]
  parent?: MenuScreen
  text?: string
  onKey?: (e: KeyboardEvent) => boolean
  textClass?: string
}

const createMenuUI = (container: HTMLElement) => {
  const style = document.createElement("style")
  style.textContent = `
    #menu-overlay {
      position: absolute;
      inset: 0;
      display: none;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.5);
      z-index: 10;
      font-family: Tahoma, Verdana, sans-serif;
    }
    #menu-frame {
      width: min(320px, 86vw);
      background: #fff;
      border: 2px solid #000;
      box-shadow: 4px 6px 0 #000;
    }
    #menu-title {
      padding: 10px 12px;
      font-weight: 700;
      font-size: 18px;
      text-align: center;
      border-bottom: 2px solid #000;
    }
    #menu-list {
      list-style: none;
      margin: 0;
      padding: 6px 0;
    }
    .menu-item {
      padding: 8px 14px;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      color: #000;
      font-size: 14px;
    }
    .menu-item.selected {
      color: #00a000;
    }
    .menu-item .value {
      color: inherit;
      margin-left: 12px;
    }
    #menu-text {
      padding: 12px 14px;
      border-top: 2px solid #000;
      color: #000;
      font-size: 13px;
      line-height: 1.35;
      white-space: pre-wrap;
    }
    #menu-text.centered {
      text-align: center;
    }
    #menu-text.name-entry {
      font-family: "Courier New", Courier, monospace;
      font-size: 18px;
      line-height: 1.2;
      white-space: pre;
      text-align: center;
    }
    #menu-button {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 9;
      padding: 6px 10px;
      border: 2px solid #000;
      background: #fff;
      font-family: Tahoma, Verdana, sans-serif;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 2px 3px 0 #000;
      display: none;
    }
  `
  document.head.appendChild(style)

  const overlay = document.createElement("div")
  overlay.id = "menu-overlay"
  const frame = document.createElement("div")
  frame.id = "menu-frame"
  const titleEl = document.createElement("div")
  titleEl.id = "menu-title"
  const listEl = document.createElement("ul")
  listEl.id = "menu-list"
  const textEl = document.createElement("div")
  textEl.id = "menu-text"
  frame.appendChild(titleEl)
  frame.appendChild(listEl)
  frame.appendChild(textEl)
  overlay.appendChild(frame)
  container.appendChild(overlay)

  const menuButton = document.createElement("button")
  menuButton.id = "menu-button"
  menuButton.textContent = "Menu"
  container.appendChild(menuButton)

  let current: MenuScreen | null = null
  let root: MenuScreen | null = null
  let selectedIndex = 0
  let shown = false
  let menuButtonVisible = false
  let menuButtonTarget: (() => MenuScreen | null) | null = null
  let keyboardEnabled = true

  const render = () => {
    if (!current) return
    titleEl.textContent = current.title
    listEl.innerHTML = ""
    for (let i = 0; i < current.items.length; i++) {
      const item = current.items[i]
      const li = document.createElement("li")
      li.className = "menu-item" + (i === selectedIndex ? " selected" : "")
      const labelSpan = document.createElement("span")
      labelSpan.textContent = item.label
      li.appendChild(labelSpan)
      if (item.getValue) {
        const valueSpan = document.createElement("span")
        valueSpan.className = "value"
        valueSpan.textContent = item.getValue()
        li.appendChild(valueSpan)
      }
      li.addEventListener("mousemove", () => {
        if (selectedIndex !== i) {
          selectedIndex = i
          render()
        }
      })
      li.addEventListener("click", () => {
        selectedIndex = i
        render()
        activate()
      })
      listEl.appendChild(li)
    }
    if (current.text) {
      textEl.className = current.textClass ?? ""
      textEl.style.display = "block"
      textEl.textContent = current.text
    } else {
      textEl.style.display = "none"
      textEl.textContent = ""
      textEl.className = ""
    }
  }

  const setScreen = (screen: MenuScreen) => {
    current = screen
    selectedIndex = 0
    render()
  }

  const show = (screen?: MenuScreen) => {
    shown = true
    overlay.style.display = "flex"
    if (screen) setScreen(screen)
    if (!current && root) setScreen(root)
    menuButton.style.display = "none"
    Activity.getGDActivity().menuShown = true
  }

  const hide = () => {
    shown = false
    overlay.style.display = "none"
    menuButton.style.display = menuButtonVisible ? "block" : "none"
    Activity.getGDActivity().menuShown = false
  }

  const setRoot = (screen: MenuScreen) => {
    root = screen
    if (!current) setScreen(screen)
  }

  const isShown = () => shown

  const setMenuButtonVisible = (visible: boolean) => {
    if (menuButtonVisible === visible) return
    menuButtonVisible = visible
    if (!shown) menuButton.style.display = visible ? "block" : "none"
  }

  const changeOption = (dir: number) => {
    if (!current) return
    const item = current.items[selectedIndex]
    if (item.type === "option" && item.onChange) {
      item.onChange(dir)
      render()
    }
  }

  const activate = () => {
    if (!current) return
    const item = current.items[selectedIndex]
    if (item.type === "submenu" && item.target) {
      setScreen(item.target)
      return
    }
    if (item.type === "option" && item.onChange) {
      item.onChange(1)
      render()
      return
    }
    if (item.onSelect) item.onSelect()
  }

  const back = () => {
    if (current && current.parent) {
      setScreen(current.parent)
    }
  }

  const handleKey = (e: KeyboardEvent) => {
    if (!shown || !current) return
    if (!keyboardEnabled && current.textClass !== "name-entry") return
    if (current.onKey && current.onKey(e)) {
      render()
      return
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (current.items.length > 0) {
        selectedIndex =
          (selectedIndex - 1 + current.items.length) % current.items.length
        render()
      }
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (current.items.length > 0) {
        selectedIndex = (selectedIndex + 1) % current.items.length
        render()
      }
      return
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      if (current.items.length > 0) changeOption(-1)
      return
    }
    if (e.key === "ArrowRight") {
      e.preventDefault()
      if (current.items.length > 0) changeOption(1)
      return
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (current.items.length > 0) activate()
      return
    }
    if (e.key === "Escape" || e.key === "Backspace") {
      e.preventDefault()
      back()
      return
    }
  }

  menuButton.addEventListener("click", () => {
    const target = menuButtonTarget ? menuButtonTarget() : root
    if (target) show(target)
  })

  return {
    show,
    hide,
    isShown,
    setRoot,
    setScreen,
    handleKey,
    setKeyboardEnabled: (enabled: boolean) => {
      keyboardEnabled = enabled
    },
    setMenuButtonVisible,
    setMenuButtonTarget: (fn: () => MenuScreen | null) => {
      menuButtonTarget = fn
    },
    getRoot: () => root,
    refresh: () => render(),
  }
}

const createOnScreenKeyboard = (
  container: HTMLElement,
  options: {
    isMenuShown: () => boolean
    onMenuKey: (key: string) => void
    onVibrate: () => void
  },
) => {
  const style = document.createElement("style")
  style.textContent = `
    #on-screen-keyboard {
      position: static;
      margin-top: 12px;
      width: min(360px, 92vw);
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      padding: 10px;
      background: #fff;
      border: 2px solid #000;
      box-shadow: 4px 6px 0 #000;
      touch-action: none;
      user-select: none;
    }
    #on-screen-keyboard.hidden {
      display: none;
    }
    .osk-btn {
      height: 54px;
      font-size: 18px;
      font-weight: 700;
      border: 2px solid #000;
      background: #f2f2f2;
      box-shadow: 2px 3px 0 #000;
      touch-action: none;
      user-select: none;
      -webkit-touch-callout: none;
    }
    .osk-btn.pressed {
      background: #d6ffd6;
      box-shadow: 1px 1px 0 #000;
      transform: translate(1px, 1px);
    }
  `
  document.head.appendChild(style)

  const keyboard = document.createElement("div")
  keyboard.id = "on-screen-keyboard"

  const setKeyPressed = (key: string, pressed: boolean) => {
    keys[key] = pressed
  }
  const menuKeyMap: Record<string, string> = {
    "2": "ArrowUp",
    "8": "ArrowDown",
    "4": "ArrowLeft",
    "6": "ArrowRight",
    "5": "Enter",
  }
  const buttonByKey = new Map<string, HTMLButtonElement>()

  for (let i = 1; i <= 9; i++) {
    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = "osk-btn"
    btn.textContent = String(i)
    btn.dataset.key = String(i)
    buttonByKey.set(String(i), btn)
    const press = (pressed: boolean) => {
      const key = btn.dataset.key ?? ""
      if (!key) return
      btn.classList.toggle("pressed", pressed)
      setKeyPressed(key, pressed)
      if (pressed && options.isMenuShown()) {
        const menuKey = menuKeyMap[key]
        if (menuKey) options.onMenuKey(menuKey)
      }
    }
    btn.addEventListener("pointerdown", (e) => {
      e.preventDefault()
      btn.setPointerCapture(e.pointerId)
      press(true)
      options.onVibrate()
    })
    btn.addEventListener("contextmenu", (e) => e.preventDefault())
    const release = (e: PointerEvent) => {
      e.preventDefault()
      press(false)
      if (btn.hasPointerCapture(e.pointerId)) {
        btn.releasePointerCapture(e.pointerId)
      }
    }
    btn.addEventListener("pointerup", release)
    btn.addEventListener("pointercancel", release)
    btn.addEventListener("pointerleave", () => {
      press(false)
    })
    keyboard.appendChild(btn)
  }

  keyboard.addEventListener("contextmenu", (e) => e.preventDefault())

  container.appendChild(keyboard)

  return {
    setVisible: (visible: boolean) => {
      keyboard.classList.toggle("hidden", !visible)
    },
    isVisible: () => !keyboard.classList.contains("hidden"),
    element: keyboard,
    setKeyPressed: (key: string, pressed: boolean) => {
      const btn = buttonByKey.get(key)
      if (!btn) return
      btn.classList.toggle("pressed", pressed)
    },
  }
}

const menuUI = createMenuUI(gameStage)
window.addEventListener("keydown", menuUI.handleKey)

const keyboardUI = createOnScreenKeyboard(gameRoot, {
  isMenuShown: () => menuUI.isShown(),
  onMenuKey: (key) => {
    menuUI.handleKey({ key, preventDefault: () => {} } as KeyboardEvent)
  },
  onVibrate: () => vibrateOnTouch(),
})

const physicalKeyToOskKey: Record<string, string> = {
  ArrowUp: "2",
  ArrowDown: "8",
  ArrowLeft: "4",
  ArrowRight: "6",
  " ": "5",
  Enter: "5",
  w: "2",
  W: "2",
  s: "8",
  S: "8",
  a: "4",
  A: "4",
  d: "6",
  D: "6",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
}

window.addEventListener("keydown", (e) => {
  const mapped = physicalKeyToOskKey[e.key]
  if (mapped) keyboardUI.setKeyPressed(mapped, true)
})
window.addEventListener("keyup", (e) => {
  const mapped = physicalKeyToOskKey[e.key]
  if (mapped) keyboardUI.setKeyPressed(mapped, false)
})
const updateLayoutForKeyboard = () => {
  const visible = keyboardUI.isVisible()
  const padding = 12
  document.body.style.alignItems = "center"
  document.body.style.justifyContent = "center"
  document.body.style.paddingTop = "0"
  const keyboardHeight = visible
    ? keyboardUI.element.getBoundingClientRect().height + padding
    : 0
  const totalHeight = canvas.height + keyboardHeight
  const totalWidth = canvas.width
  const availableHeight = window.innerHeight - padding * 2
  const availableWidth = window.innerWidth - padding * 2
  const scale = Math.min(
    1,
    availableHeight / Math.max(1, totalHeight),
    availableWidth / Math.max(1, totalWidth)
  )
  gameRoot.style.transform = scale < 1 ? `scale(${scale})` : ""
  gameRoot.style.transformOrigin = "center"
}
const updateKeyboardVisibility = () => {
  const showInMenu = keyboardIndex === 0
  const visible = !menuUI.isShown() || showInMenu
  keyboardUI.setVisible(visible)
  updateLayoutForKeyboard()
}

window.addEventListener("resize", () => {
  updateLayoutForKeyboard()
})

const menuShow = menuUI.show
const menuHide = menuUI.hide
menuUI.show = (screen?: MenuScreen) => {
  menuShow(screen)
  updateKeyboardVisibility()
}
menuUI.hide = () => {
  menuHide()
  updateKeyboardVisibility()
}

const fetchLevels = await fetch("levels.mrg")
const stream = fetchLevels.body
const headers = await Reader.readHeader(stream!)
console.log(headers)

// let j = 1
// let k = 1
// const fetchLevels2 = await fetch("levels.mrg")
// const stream2 = fetchLevels2.body
// let arr = await readStreamToEnd(stream2!.getReader())
// arr = skipBytes(arr, headers.pointers[j - 1][k - 1])
// const level = new Level()
// level.readTrackData(arr)
// console.log(level)

const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const sleep = async () => {
  const time = Date.now()
  await wait(100)
  return Date.now() - time
}

const keysetMaps: [number, number][][] = [
  [
    [0, 0],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, -1],
    [-1, 0],
    [0, 1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
  ],
  [
    [0, 0],
    [1, 0],
    [0, 0],
    [0, 0],
    [-1, 0],
    [0, -1],
    [0, 1],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
  [
    [0, 0],
    [0, 0],
    [0, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
]

const getInputVector = () => {
  let throttle = 0
  let lean = 0
  if (keys[UP] || keys["w"] || keys["W"]) throttle += 1
  if (keys[DOWN] || keys["s"] || keys["S"]) throttle -= 1
  if (keys[RIGHT] || keys["d"] || keys["D"]) lean += 1
  if (keys[LEFT] || keys["a"] || keys["A"]) lean -= 1
  const map = keysetMaps[inputIndex] ?? keysetMaps[0]
  for (let digit = 0; digit <= 9; digit++) {
    if (keys[String(digit)]) {
      throttle += map[digit][0]
      lean += map[digit][1]
    }
  }
  return { throttle, lean }
}

const formatTimeTicks = (ticks: number) => {
  const total = Math.max(0, Math.floor(ticks))
  const minutes = Math.floor(total / 6000)
  const seconds = Math.floor(total / 100) % 60
  const hundredths = total % 100
  return `${minutes}:${seconds.toString().padStart(2, "0")}:${hundredths
    .toString()
    .padStart(2, "0")}`
}

const init = () => {
  //img.src = "helmet.png"
  window.requestAnimationFrame(draw)
}

let gameState = "playing" // "playing", "crashed", "finished", etc.
let crashTimer = 0
let finishTimer = 0
let advancing = false
let startedTime = 0
let finishedTime = 0
let pausedTime = 0
let pausedTimeStarted = 0
let finishedTimeText = "0:00:00"
let currentLevelIndex = 0
let currentTrackIndex = 0
let lastTrackTime = 0
let pendingHighscore: {
  levelIndex: number
  trackIndex: number
  leagueIndex: number
  timeTicks: number
} | null = null
let pendingFinishTicks = 0
let nameCharIndices = [1, 1, 1]
let nameCursorIndex = 0
let nameEntryScreen: MenuScreen
let playerName = "AAA"

const draw = (frame: number) => {
  if (gameView.showIntro === 0) {
    if (menuUI.isShown()) {
      if (pausedTimeStarted === 0 && startedTime > 0 && finishedTime === 0) {
        pausedTimeStarted = Date.now()
      }
    } else if (pausedTimeStarted > 0) {
      pausedTime += Date.now() - pausedTimeStarted
      pausedTimeStarted = 0
    }
  }

  if (
    gameView.showIntro === 0 &&
    !menuUI.isShown() &&
    gameState !== "loading"
  ) {
    // Update physics and game logic only after intros finish.
    const input = getInputVector()
    physEngine._aIIV(input.throttle, input.lean)
    const k = physEngine._dovI()

    // Treat both crash outcomes as crash: 3 (broken) and 5 (hard crash).
    if ((k === 3 || k === 5) && gameState !== "crashed") {
      gameState = "crashed"
      crashTimer = Date.now() + 3000
      gameView.showInfoMessage(STRINGS.crashed, 3000)
    } else if ((k === 1 || k === 2) && gameState !== "win") {
      gameState = "win"
      finishedTime = Date.now()
      finishTimer = Date.now() + 1000
      const finishMsg = physEngine.m_NZ ? STRINGS.finished1 : STRINGS.wheelie
      gameView.showInfoMessage(finishMsg, 1000)
    }

    const running = k !== 4
    if (running && startedTime === 0) {
      startedTime = Date.now()
    }

    const now = Date.now()
    let timeTicks = 0
    if (startedTime > 0) {
      const effectiveEnd = finishedTime > 0 ? finishedTime : now
      timeTicks = Math.floor((effectiveEnd - startedTime - pausedTime) / 10)
    }
    gameView.setTimerValue(timeTicks)

    // Handle timers for crash/finish/win
    if (gameState === "crashed" && Date.now() > crashTimer) {
      physEngine._doZV(true)
      startedTime = 0
      finishedTime = 0
      pausedTime = 0
      pausedTimeStarted = 0
      gameState = "playing"
    }
    if (gameState === "win" && Date.now() > finishTimer) {
      gameState = "finished"
      const place = getPlaceForTime(
        currentLevelIndex,
        currentTrackIndex,
        selectedLeague,
        timeTicks,
      )
      if (place < 3) {
        showFinishedPlacesMenu(place, timeTicks)
      } else {
        showFinishedMenu(timeTicks)
      }
    }

    physEngine._charvV()
    console.log(
      `State: ${gameState}, k=${k}, pos=(${physEngine._ifvI()},${physEngine._elsevI()})`,
    )
  } else if (gameView.showIntro === 0 && menuUI.isShown()) {
    physEngine._aIIV(0, 0)
  }

  gameView.onDraw()
  window.requestAnimationFrame(draw)
}

// START GAME INIT

const gameView = new GameView(canvas)

const loader = new Loader()
await loader.reset()
// Disable perspective until physics is stable; re-enable later.
loader.setPerspectiveEnabled(false)

console.log(loader.levels)
const physEngine = new Physics(loader)
gameView.setPhysicsEngine(physEngine)

const difficultyLevels = [...STRINGS.difficulty]
const leagues = [...STRINGS.leagues]
const trackNames = loader.names ?? []
const levelOptions =
  trackNames.length > 0
    ? trackNames.map((_, idx) => difficultyLevels[idx] ?? `Level ${idx + 1}`)
    : difficultyLevels

let selectedLevel = 0
let selectedTrack = 0
let selectedLeague = 0
let gameStarted = false
let highscoreLeagueIndex = 0
let unlockedLevels = Math.max(1, Math.min(levelOptions.length, 1))
let unlockedTracks = trackNames.map((tracks, index) =>
  index === 0 ? Math.min(1, tracks.length) : 0,
)
let unlockedLeagues = Math.min(leagues.length, 1)

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

const clampInt = (
  value: unknown,
  min: number,
  max: number,
  fallback: number,
) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback
  return clamp(Math.floor(value), min, max)
}

const unlockLevel = (levelIndex: number, trackCount?: number) => {
  const maxLevel = levelOptions.length - 1
  const idx = clamp(levelIndex, 0, Math.max(0, maxLevel))
  unlockedLevels = Math.max(unlockedLevels, idx + 1)
  const tracks = trackNames[idx] ?? []
  const desired = trackCount ?? 1
  unlockedTracks[idx] = Math.max(
    unlockedTracks[idx] ?? 0,
    Math.min(Math.max(1, desired), Math.max(1, tracks.length)),
  )
  persistState()
  return idx
}

const unlockLeagueCount = (count: number) => {
  unlockedLeagues = clamp(count, 1, leagues.length)
  persistState()
  return unlockedLeagues
}

const unlockAll = () => {
  unlockedLevels = levelOptions.length
  unlockedLeagues = leagues.length
  unlockedTracks = trackNames.map((tracks) => Math.max(1, tracks.length))
  persistState()
}

;(window as any).gdUnlockLevel = (levelIndex = 0, trackCount?: number) => {
  const idx = unlockLevel(levelIndex, trackCount)
  gameView.showInfoMessage(
    `Unlocked level ${idx + 1} (${unlockedTracks[idx]} tracks)`,
    1500,
  )
}
;(window as any).gdUnlockLeague = (countOrIndex = 1) => {
  const count = unlockLeagueCount(countOrIndex)
  gameView.showInfoMessage(`Unlocked leagues: ${count}`, 1500)
}
;(window as any).gdUnlockAll = () => {
  unlockAll()
  gameView.showInfoMessage("Unlocked all levels/leagues", 1500)
}

const getTrackOptions = () => {
  const list = trackNames[selectedLevel]
  if (list && list.length > 0) {
    const unlocked = Math.max(1, unlockedTracks[selectedLevel] ?? 1)
    return list.slice(0, Math.min(unlocked, list.length))
  }
  return ["Track 1"]
}

const buildHighScoreLines = (
  levelIndex: number,
  trackIndex: number,
  leagueIndex: number,
) => {
  const scores = getHighScores(levelIndex, trackIndex, leagueIndex)
  const lines: string[] = []
  for (let i = 0; i < 3; i++) {
    const entry = scores[i]
    lines.push(entry ? `${i + 1}. ${formatScoreEntry(entry)}` : `${i + 1}. ---`)
  }
  return lines
}

const applyFinishUnlocks = () => {
  const tracks = trackNames[currentLevelIndex] ?? []
  const totalTracks = tracks.length || 1

  if (
    unlockedTracks[currentLevelIndex] === undefined ||
    unlockedTracks[currentLevelIndex] < currentTrackIndex + 2
  ) {
    unlockedTracks[currentLevelIndex] = Math.min(
      currentTrackIndex + 2,
      totalTracks,
    )
  }

  const completedCount = Math.min(
    unlockedTracks[currentLevelIndex] || 1,
    totalTracks,
  )
  const difficultyLabel =
    difficultyLevels[currentLevelIndex] ?? `Level ${currentLevelIndex + 1}`

  let leagueUnlockedName: string | null = null
  let showEnjoy = false
  let levelCompleted = false

  if (currentTrackIndex >= totalTracks - 1) {
    levelCompleted = true
    if (unlockedLevels < Math.min(levelOptions.length, currentLevelIndex + 2)) {
      unlockedLevels = Math.min(levelOptions.length, currentLevelIndex + 2)
      const newlyUnlockedLevel = currentLevelIndex + 1
      if (newlyUnlockedLevel < trackNames.length) {
        const current = unlockedTracks[newlyUnlockedLevel] ?? 0
        unlockedTracks[newlyUnlockedLevel] = Math.max(1, current)
      }
    }

    const targetLeagueCount = Math.min(leagues.length, currentLevelIndex + 2)
    if (unlockedLeagues < targetLeagueCount) {
      unlockedLeagues = targetLeagueCount
      leagueUnlockedName = leagues[unlockedLeagues - 1] ?? null
      if (unlockedLeagues === leagues.length && currentLevelIndex >= 2) {
        showEnjoy = true
      }
    }
  }

  persistState()
  return {
    completedCount,
    totalTracks,
    difficultyLabel,
    leagueUnlockedName,
    levelCompleted,
    showEnjoy,
  }
}

const updateHighScoresMenu = () => {
  const levelIndex = selectedLevel
  const trackIndex = selectedTrack
  const leagueIndex = highscoreLeagueIndex
  const lines: string[] = [
    `${STRINGS.level}: ${levelOptions[levelIndex] ?? `Level ${levelIndex + 1}`}`,
    `${STRINGS.track}: ${getTrackOptions()[trackIndex] ?? "Track"}`,
    `${STRINGS.league}: ${leagues[leagueIndex] ?? "League"}`,
    "",
    ...buildHighScoreLines(levelIndex, trackIndex, leagueIndex),
  ]
  highscoresMenu.text = lines.join("\n")
}

const nameCharForIndex = (idx: number) =>
  idx === 0 ? " " : String.fromCharCode(64 + idx)

const nameIndicesFromString = (name: string) => {
  const chars = (name || "AAA").toUpperCase().padEnd(3, "A").slice(0, 3)
  return Array.from(chars).map((ch) => {
    if (ch === " ") return 0
    const code = ch.charCodeAt(0)
    if (code < 65 || code > 90) return 1
    return code - 64
  })
}

const getCurrentNameString = () =>
  nameCharIndices.map(nameCharForIndex).join("")

const updateNameEntryText = () => {
  const cellWidth = 3
  let nameLine = ""
  let cursorLine = ""
  for (let i = 0; i < nameCharIndices.length; i++) {
    nameLine += nameCharForIndex(nameCharIndices[i]) + " ".repeat(cellWidth - 1)
    cursorLine +=
      (i === nameCursorIndex ? "^" : " ") + " ".repeat(cellWidth - 1)
  }
  nameEntryScreen.text = `${nameLine}\n${cursorLine}`
  menuUI.refresh()
}

const showFinishedMenu = (timeTicks: number) => {
  lastTrackTime = timeTicks
  finishedTimeText = formatTimeTicks(timeTicks)
  const finishSummary = applyFinishUnlocks()
  const lines: string[] = [
    `${STRINGS.time}: ${finishedTimeText}`,
    `${STRINGS.records}:`,
    ...buildHighScoreLines(
      currentLevelIndex,
      currentTrackIndex,
      selectedLeague,
    ),
    STRINGS.tracks_completed_tpl(
      finishSummary.completedCount,
      finishSummary.totalTracks,
      finishSummary.difficultyLabel,
    ),
  ]
  if (finishSummary.leagueUnlockedName) {
    lines.push(
      `${STRINGS.league_unlocked}: ${finishSummary.leagueUnlockedName}`,
    )
    lines.push(
      `${STRINGS.league_unlocked_text}${finishSummary.leagueUnlockedName}`,
    )
    lines.push(`${STRINGS.congratulations}${finishSummary.leagueUnlockedName}`)
    if (finishSummary.showEnjoy) lines.push(STRINGS.enjoy)
  } else if (finishSummary.levelCompleted) {
    lines.push(STRINGS.level_completed_text)
  }
  finishedMenu.text = lines.join("\n")
  menuUI.show(finishedMenu)
}

const showNameEntryScreen = (
  levelIndex: number,
  trackIndex: number,
  leagueIndex: number,
  timeTicks: number,
) => {
  pendingHighscore = { levelIndex, trackIndex, leagueIndex, timeTicks }
  pendingFinishTicks = timeTicks
  nameCharIndices = nameIndicesFromString(playerName)
  nameCursorIndex = 0
  updateNameEntryText()
  menuUI.show(nameEntryScreen)
}

const commitNameEntry = () => {
  if (!pendingHighscore) return
  const name = getCurrentNameString()
  playerName = name
  saveHighScore(
    pendingHighscore.levelIndex,
    pendingHighscore.trackIndex,
    pendingHighscore.leagueIndex,
    name,
    pendingHighscore.timeTicks,
  )
  persistState()
  pendingHighscore = null
  showFinishedMenu(pendingFinishTicks)
}

const cancelNameEntry = () => {
  pendingHighscore = null
  showFinishedMenu(pendingFinishTicks)
}

const showFinishedPlacesMenu = (place: number, timeTicks: number) => {
  pendingFinishTicks = timeTicks
  nameCharIndices = nameIndicesFromString(playerName)
  const placeText = STRINGS.finished_places[place] ?? STRINGS.finished1
  const timeText = formatTimeTicks(timeTicks)
  finishedPlacesMenu.text = `${placeText}\n${timeText}`
  finishedPlacesMenu.items[1].label = `${STRINGS.name} - ${getCurrentNameString()}`
  menuUI.show(finishedPlacesMenu)
}

const advanceToNextTrack = async () => {
  const tracks = getTrackOptions()
  let nextLevel = selectedLevel
  let nextTrack = selectedTrack + 1

  if (nextTrack >= tracks.length) {
    nextTrack = 0
    nextLevel += 1
  }

  if (nextLevel >= unlockedLevels) {
    nextLevel = 0
  }

  selectedLevel = nextLevel
  selectedTrack = nextTrack
  try {
    await startTrack()
  } finally {
    advancing = false
  }
}

const startTrack = async () => {
  const levelIndex = Math.min(selectedLevel, Math.max(0, trackNames.length - 1))
  const tracks = getTrackOptions()
  const trackIndex = Math.min(selectedTrack, Math.max(0, tracks.length - 1))
  const levelUnlocked = selectedLevel < unlockedLevels
  const trackUnlocked =
    trackIndex < Math.max(1, unlockedTracks[selectedLevel] ?? 1)
  if (!levelUnlocked || !trackUnlocked) {
    gameView.showInfoMessage(STRINGS.complete_to_unlock, 2000)
    return
  }
  await loader._doIII(levelIndex, trackIndex)
  currentLevelIndex = levelIndex
  currentTrackIndex = trackIndex
  gameView.showInfoMessage(loader.getLevelName(levelIndex, trackIndex), 3000)
  const leagueIndex = Math.min(selectedLeague, unlockedLeagues - 1)
  selectedLeague = leagueIndex
  physEngine.setLeague(leagueIndex + 1)
  persistState()
  physEngine._doZV(true)
  startedTime = 0
  finishedTime = 0
  pausedTime = 0
  pausedTimeStarted = 0
  gameState = "playing"
  gameStarted = true
  menuUI.hide()
}

const mainMenu: MenuScreen = { title: "Main", items: [] }
const playMenu: MenuScreen = { title: "Play", items: [], parent: mainMenu }
const ingameMenu: MenuScreen = { title: "Ingame", items: [], parent: playMenu }
const finishedMenu: MenuScreen = {
  title: STRINGS.finished,
  items: [],
  parent: playMenu,
}
const finishedPlacesMenu: MenuScreen = {
  title: STRINGS.finished,
  items: [],
  parent: playMenu,
  textClass: "centered",
}
nameEntryScreen = {
  title: STRINGS.enter_name,
  items: [],
  parent: finishedMenu,
  text: "",
  textClass: "name-entry",
  onKey: (e) => {
    if (!pendingHighscore) return false
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (nameCharIndices[nameCursorIndex] === 0) {
        nameCharIndices[nameCursorIndex] = 1
      } else {
        nameCharIndices[nameCursorIndex] += 1
        if (nameCharIndices[nameCursorIndex] > 26)
          nameCharIndices[nameCursorIndex] = 0
      }
      updateNameEntryText()
      return true
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (nameCharIndices[nameCursorIndex] === 0) {
        nameCharIndices[nameCursorIndex] = 26
      } else {
        nameCharIndices[nameCursorIndex] -= 1
        if (nameCharIndices[nameCursorIndex] < 0)
          nameCharIndices[nameCursorIndex] = 0
      }
      updateNameEntryText()
      return true
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      nameCursorIndex = Math.max(0, nameCursorIndex - 1)
      updateNameEntryText()
      return true
    }
    if (e.key === "ArrowRight") {
      e.preventDefault()
      nameCursorIndex = Math.min(2, nameCursorIndex + 1)
      updateNameEntryText()
      return true
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (nameCursorIndex === 2) {
        commitNameEntry()
      } else {
        nameCursorIndex += 1
        updateNameEntryText()
      }
      return true
    }
    if (e.key === "Escape" || e.key === "Backspace") {
      e.preventDefault()
      cancelNameEntry()
      return true
    }
    return false
  },
}
const modsMenu: MenuScreen = {
  title: "Mods",
  items: [],
  parent: mainMenu,
  text: "Mods are not implemented yet.",
}
const optionsMenu: MenuScreen = {
  title: "Options",
  items: [],
  parent: mainMenu,
}
const helpMenu: MenuScreen = { title: "Help", items: [], parent: mainMenu }
const aboutMenu: MenuScreen = {
  title: "About",
  items: [],
  parent: mainMenu,
  text:
    "Gravity Defied Classic by Codebrew Software.\n" +
    "Original mobile version.\n\n" +
    "This web port is a work in progress.",
}
const highscoresMenu: MenuScreen = {
  title: "High Scores",
  items: [],
  parent: playMenu,
}
const clearedScreen: MenuScreen = {
  title: "Cleared",
  items: [],
  parent: optionsMenu,
  text: "Highscores have been cleared.",
}

const objectiveScreen: MenuScreen = {
  title: "Objective",
  items: [],
  parent: helpMenu,
  text:
    "Race to the finish line as fast as you can without crashing. " +
    "Lean forward and backward to control rotation. " +
    "Landing on both wheels reduces crashes.",
}
const keysScreen: MenuScreen = {
  title: "Keys",
  items: [],
  parent: helpMenu,
  text:
    "Keyset 1:\n" +
    "2 accelerate, 8 brake, 6 lean forward, 4 lean backward.\n" +
    "1/3 accelerate + lean, 7/9 brake + lean.\n\n" +
    "Keyset 2:\n" +
    "1 accelerate, 4 brake, 6 lean forward, 5 lean backward.\n\n" +
    "Keyset 3:\n" +
    "3 accelerate, 6 brake, 5 lean forward, 4 lean backward.",
}
const unlockingScreen: MenuScreen = {
  title: "Unlocking",
  items: [],
  parent: helpMenu,
  text:
    "Complete easier tracks to unlock new tracks and leagues. " +
    "Higher leagues have more advanced bikes.",
}
const highscoreHelpScreen: MenuScreen = {
  title: "High Scores",
  items: [],
  parent: helpMenu,
  text:
    "Best times are saved per track and league. " +
    "Use left and right to switch leagues in the highscore view.",
}
const optionsHelpScreen: MenuScreen = {
  title: "Options",
  items: [],
  parent: helpMenu,
  text:
    "Perspective and Shadows affect rendering.\n" +
    "Input selects keyset style.\n" +
    "Look ahead changes camera behavior.",
}

const onOff = ["On", "Off"]
let perspectiveIndex = loader.isPerspectiveEnabled() ? 0 : 1
let shadowsIndex = loader.isShadowsEnabled() ? 0 : 1
let driverSpriteIndex = 0
let bikeSpriteIndex = 0
let inputIndex = 0
let lookAheadIndex = 0
let vibrateIndex = 0
let keyboardIndex = 0

const getSpriteFlags = () => {
  let flags = 0
  if (bikeSpriteIndex === 0) flags |= 1
  if (driverSpriteIndex === 0) flags |= 2
  return flags
}

const applySpriteOptions = () => {
  const flags = gameView._intII(getSpriteFlags())
  physEngine._doIV(flags)
}

const applyLookAheadOption = () => {
  physEngine._ifZV(lookAheadIndex === 0)
}

const applyMenuKeyboardOption = () => {
  menuUI.setKeyboardEnabled(keyboardIndex === 0)
  updateKeyboardVisibility()
}

const applyPersistedState = () => {
  const state = loadPersistedState()
  if (state) {
    if (typeof state.unlockedLevels === "number") {
      unlockedLevels = clamp(
        Math.floor(state.unlockedLevels),
        1,
        Math.max(1, levelOptions.length),
      )
    }
    if (Array.isArray(state.unlockedTracks)) {
      unlockedTracks = trackNames.map((tracks, index) => {
        const maxTracks = Math.max(1, tracks.length)
        const fallback = unlockedTracks[index] ?? (index === 0 ? 1 : 0)
        const min = index === 0 ? 1 : 0
        return clampInt(state.unlockedTracks?.[index], min, maxTracks, fallback)
      })
    }
    if (typeof state.unlockedLeagues === "number") {
      unlockedLeagues = clamp(
        Math.floor(state.unlockedLeagues),
        1,
        Math.max(1, leagues.length),
      )
    }
    if (typeof state.playerName === "string") {
      playerName = normalizePlayerName(state.playerName)
    }

    if (typeof state.selectedLevel === "number") {
      selectedLevel = clamp(
        Math.floor(state.selectedLevel),
        0,
        Math.max(0, unlockedLevels - 1),
      )
    } else {
      selectedLevel = clamp(selectedLevel, 0, Math.max(0, unlockedLevels - 1))
    }

    const tracks = getTrackOptions()
    if (typeof state.selectedTrack === "number") {
      selectedTrack = clamp(
        Math.floor(state.selectedTrack),
        0,
        Math.max(0, tracks.length - 1),
      )
    } else {
      selectedTrack = clamp(selectedTrack, 0, Math.max(0, tracks.length - 1))
    }

    if (typeof state.selectedLeague === "number") {
      selectedLeague = clamp(
        Math.floor(state.selectedLeague),
        0,
        Math.max(0, unlockedLeagues - 1),
      )
    } else {
      selectedLeague = clamp(
        selectedLeague,
        0,
        Math.max(0, unlockedLeagues - 1),
      )
    }

    const settings = state.settings
    if (settings && typeof settings === "object") {
      perspectiveIndex = clampInt(
        settings.perspectiveIndex,
        0,
        1,
        perspectiveIndex,
      )
      shadowsIndex = clampInt(settings.shadowsIndex, 0, 1, shadowsIndex)
      driverSpriteIndex = clampInt(
        settings.driverSpriteIndex,
        0,
        1,
        driverSpriteIndex,
      )
      bikeSpriteIndex = clampInt(
        settings.bikeSpriteIndex,
        0,
        1,
        bikeSpriteIndex,
      )
      inputIndex = clampInt(settings.inputIndex, 0, 2, inputIndex)
      lookAheadIndex = clampInt(settings.lookAheadIndex, 0, 1, lookAheadIndex)
      vibrateIndex = clampInt(settings.vibrateIndex, 0, 1, vibrateIndex)
      keyboardIndex = clampInt(settings.keyboardIndex, 0, 1, keyboardIndex)
    }
  }

  loader.setPerspectiveEnabled(perspectiveIndex === 0)
  loader.setShadowsEnabled(shadowsIndex === 0)
  physEngine.setLeague(selectedLeague + 1)
  gameView.setInputOption(inputIndex)
  applyLookAheadOption()
  applySpriteOptions()
  applyMenuKeyboardOption()
}

function persistState() {
  const safeName = normalizePlayerName(playerName)
  playerName = safeName
  const state: PersistedState = {
    version: 1,
    selectedLevel,
    selectedTrack,
    selectedLeague,
    unlockedLevels,
    unlockedTracks: [...unlockedTracks],
    unlockedLeagues,
    playerName: safeName,
    settings: {
      perspectiveIndex,
      shadowsIndex,
      driverSpriteIndex,
      bikeSpriteIndex,
      inputIndex,
      lookAheadIndex,
      vibrateIndex,
      keyboardIndex,
    },
  }
  savePersistedState(state)
}

applyPersistedState()

const vibrateOnTouch = () => {
  if (vibrateIndex !== 0) return
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(10)
  }
}

canvas.addEventListener("pointerdown", (e) => {
  if (e.pointerType === "touch") vibrateOnTouch()
})
canvas.addEventListener("touchstart", () => vibrateOnTouch(), {
  passive: true,
})

const backItemFor = (screen: MenuScreen): MenuItem => ({
  label: "Back",
  type: "action",
  onSelect: () => {
    if (screen.parent) menuUI.setScreen(screen.parent)
  },
})

mainMenu.items = [
  { label: "Play Menu", type: "submenu", target: playMenu },
  { label: "Mods", type: "submenu", target: modsMenu },
  {
    label: "Options",
    type: "action",
    onSelect: () => {
      optionsMenu.parent = mainMenu
      menuUI.setScreen(optionsMenu)
    },
  },
  {
    label: "Help",
    type: "action",
    onSelect: () => {
      helpMenu.parent = mainMenu
      menuUI.setScreen(helpMenu)
    },
  },
  { label: "About", type: "submenu", target: aboutMenu },
  {
    label: "Exit Game",
    type: "action",
    onSelect: () => window.location.reload(),
  },
]

playMenu.items = [
  {
    label: "Start",
    type: "action",
    onSelect: () => {
      void startTrack()
    },
  },
  {
    label: "Level",
    type: "option",
    getValue: () => levelOptions[selectedLevel] ?? "Level",
    onChange: (dir) => {
      const count = Math.max(1, unlockedLevels)
      selectedLevel = (selectedLevel + dir + count) % count
      const tracks = getTrackOptions()
      if (selectedTrack >= tracks.length) selectedTrack = 0
      persistState()
    },
  },
  {
    label: "Track",
    type: "option",
    getValue: () => getTrackOptions()[selectedTrack] ?? "Track",
    onChange: (dir) => {
      const tracks = getTrackOptions()
      const count = Math.max(1, tracks.length)
      selectedTrack = (selectedTrack + dir + count) % count
      persistState()
    },
  },
  {
    label: "League",
    type: "option",
    getValue: () => leagues[selectedLeague] ?? "League",
    onChange: (dir) => {
      const count = Math.max(1, unlockedLeagues)
      selectedLeague = (selectedLeague + dir + count) % count
      physEngine.setLeague(selectedLeague + 1)
      persistState()
    },
  },
  {
    label: "High Scores",
    type: "action",
    onSelect: () => {
      highscoreLeagueIndex = clamp(selectedLeague, 0, unlockedLeagues - 1)
      updateHighScoresMenu()
      menuUI.setScreen(highscoresMenu)
    },
  },
  {
    label: "Go to Main",
    type: "action",
    onSelect: () => {
      gameStarted = false
      menuUI.setScreen(mainMenu)
    },
  },
]

ingameMenu.items = [
  {
    label: "Continue",
    type: "action",
    onSelect: () => menuUI.hide(),
  },
  {
    label: "Restart",
    type: "action",
    onSelect: () => {
      physEngine._doZV(true)
      gameState = "playing"
      menuUI.hide()
    },
  },
  {
    label: "Options",
    type: "action",
    onSelect: () => {
      optionsMenu.parent = ingameMenu
      menuUI.setScreen(optionsMenu)
    },
  },
  {
    label: "Help",
    type: "action",
    onSelect: () => {
      helpMenu.parent = ingameMenu
      menuUI.setScreen(helpMenu)
    },
  },
  {
    label: "Play Menu",
    type: "action",
    onSelect: () => {
      gameStarted = false
      menuUI.setScreen(playMenu)
    },
  },
]

finishedMenu.items = [
  {
    label: "Next",
    type: "action",
    onSelect: () => {
      if (advancing) return
      advancing = true
      menuUI.hide()
      void advanceToNextTrack()
    },
  },
  {
    label: "Restart",
    type: "action",
    onSelect: () => {
      physEngine._doZV(true)
      startedTime = 0
      finishedTime = 0
      pausedTime = 0
      pausedTimeStarted = 0
      gameState = "playing"
      menuUI.hide()
    },
  },
  {
    label: "Play Menu",
    type: "action",
    onSelect: () => {
      gameStarted = false
      menuUI.setScreen(playMenu)
    },
  },
]

finishedPlacesMenu.items = [
  {
    label: STRINGS.ok,
    type: "action",
    onSelect: () => {
      const name = getCurrentNameString()
      playerName = name
      saveHighScore(
        currentLevelIndex,
        currentTrackIndex,
        selectedLeague,
        name,
        pendingFinishTicks,
      )
      persistState()
      showFinishedMenu(pendingFinishTicks)
    },
  },
  {
    label: STRINGS.name,
    type: "action",
    onSelect: () =>
      showNameEntryScreen(
        currentLevelIndex,
        currentTrackIndex,
        selectedLeague,
        pendingFinishTicks,
      ),
  },
]

optionsMenu.items = [
  {
    label: "Perspective",
    type: "option",
    getValue: () => onOff[perspectiveIndex],
    onChange: (dir) => {
      perspectiveIndex = (perspectiveIndex + dir + 2) % 2
      loader.setPerspectiveEnabled(perspectiveIndex === 0)
      persistState()
    },
  },
  {
    label: "Shadows",
    type: "option",
    getValue: () => onOff[shadowsIndex],
    onChange: (dir) => {
      shadowsIndex = (shadowsIndex + dir + 2) % 2
      loader.setShadowsEnabled(shadowsIndex === 0)
      persistState()
    },
  },
  {
    label: "Driver Sprite",
    type: "option",
    getValue: () => onOff[driverSpriteIndex],
    onChange: (dir) => {
      driverSpriteIndex = (driverSpriteIndex + dir + 2) % 2
      applySpriteOptions()
      persistState()
    },
  },
  {
    label: "Bike Sprite",
    type: "option",
    getValue: () => onOff[bikeSpriteIndex],
    onChange: (dir) => {
      bikeSpriteIndex = (bikeSpriteIndex + dir + 2) % 2
      applySpriteOptions()
      persistState()
    },
  },
  {
    label: "Input",
    type: "option",
    getValue: () => `Keyset ${inputIndex + 1}`,
    onChange: (dir) => {
      inputIndex = (inputIndex + dir + 3) % 3
      gameView.setInputOption(inputIndex)
      persistState()
    },
  },
  {
    label: "Look Ahead",
    type: "option",
    getValue: () => onOff[lookAheadIndex],
    onChange: (dir) => {
      lookAheadIndex = (lookAheadIndex + dir + 2) % 2
      applyLookAheadOption()
      persistState()
    },
  },
  {
    label: "Vibrate on touch",
    type: "option",
    getValue: () => onOff[vibrateIndex],
    onChange: (dir) => {
      vibrateIndex = (vibrateIndex + dir + 2) % 2
      persistState()
    },
  },
  {
    label: "On-screen keyboard",
    type: "option",
    getValue: () => onOff[keyboardIndex],
    onChange: (dir) => {
      keyboardIndex = (keyboardIndex + dir + 2) % 2
      applyMenuKeyboardOption()
      persistState()
    },
  },
  {
    label: "Clear highscore",
    type: "action",
    onSelect: () => {
      clearAllHighScores()
      menuUI.setScreen(clearedScreen)
    },
  },
  backItemFor(optionsMenu),
]

helpMenu.items = [
  { label: "Objective", type: "submenu", target: objectiveScreen },
  { label: "Keys", type: "submenu", target: keysScreen },
  { label: "Unlocking", type: "submenu", target: unlockingScreen },
  { label: "High Scores", type: "submenu", target: highscoreHelpScreen },
  { label: "Options", type: "submenu", target: optionsHelpScreen },
  backItemFor(helpMenu),
]

aboutMenu.items = [backItemFor(aboutMenu)]
modsMenu.items = [backItemFor(modsMenu)]
highscoresMenu.items = [
  {
    label: STRINGS.league,
    type: "option",
    getValue: () => leagues[highscoreLeagueIndex] ?? "League",
    onChange: (dir) => {
      const count = Math.max(1, unlockedLeagues)
      highscoreLeagueIndex = (highscoreLeagueIndex + dir + count) % count
      updateHighScoresMenu()
    },
  },
  backItemFor(highscoresMenu),
]
clearedScreen.items = [backItemFor(clearedScreen)]
objectiveScreen.items = [backItemFor(objectiveScreen)]
keysScreen.items = [backItemFor(keysScreen)]
unlockingScreen.items = [backItemFor(unlockingScreen)]
highscoreHelpScreen.items = [backItemFor(highscoreHelpScreen)]
optionsHelpScreen.items = [backItemFor(optionsHelpScreen)]

menuUI.setRoot(mainMenu)
menuUI.setMenuButtonTarget(() => (gameStarted ? ingameMenu : mainMenu))
updateKeyboardVisibility()

gameView._doIIV(-50, 150)
physEngine._byteIV(1)
physEngine.setLeague(selectedLeague + 1)
applyLookAheadOption()

console.log("init")
init()

console.log("show intro 1")
let l1 = 0
for (let ll1 = IMAGES_DELAY; ll1 > 0; ll1 -= l1) l1 = await sleep()

gameView.setShowIntro(2)

console.log("show intro 2")
let l2 = 0
for (let ll2 = IMAGES_DELAY; ll2 > 0; ll2 -= l2) l2 = await sleep()

console.log("show intro 0")
gameView.setShowIntro(0)
menuUI.setMenuButtonVisible(true)
menuUI.show(menuUI.getRoot() ?? undefined)

// j.setColor(0, 255, 0);
// levels._aiV(j);

console.log("start main loop")
// The main loop is now handled by requestAnimationFrame in draw()
