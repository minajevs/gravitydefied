import { GameView } from "./Game/gameview"
import { Physics } from "./Game/physics"
import { keys, LEFT, RIGHT, UP, DOWN } from "./keyboard"
import { Level } from "./Levels/level"
import { Loader } from "./Levels/loader"
import { Reader } from "./Levels/reader"
import { readStreamToEnd, skipBytes } from "./Levels/readerUtils"
import { Activity } from "./activity"

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
document.body.appendChild(canvas)

const ctx = canvas.getContext("2d")
const img = new Image()

const IMAGES_DELAY = 1000

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
}

const createMenuUI = () => {
  const style = document.createElement("style")
  style.textContent = `
    #menu-overlay {
      position: fixed;
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
    #menu-button {
      position: fixed;
      top: 12px;
      right: 12px;
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
  document.body.appendChild(overlay)

  const menuButton = document.createElement("button")
  menuButton.id = "menu-button"
  menuButton.textContent = "Menu"
  document.body.appendChild(menuButton)

  let current: MenuScreen | null = null
  let root: MenuScreen | null = null
  let selectedIndex = 0
  let shown = false
  let menuButtonVisible = false
  let menuButtonTarget: (() => MenuScreen | null) | null = null

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
      textEl.style.display = "block"
      textEl.textContent = current.text
    } else {
      textEl.style.display = "none"
      textEl.textContent = ""
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
    if (e.key === "ArrowUp") {
      e.preventDefault()
      selectedIndex =
        (selectedIndex - 1 + current.items.length) % current.items.length
      render()
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      selectedIndex = (selectedIndex + 1) % current.items.length
      render()
      return
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      changeOption(-1)
      return
    }
    if (e.key === "ArrowRight") {
      e.preventDefault()
      changeOption(1)
      return
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      activate()
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
    setMenuButtonVisible,
    setMenuButtonTarget: (fn: () => MenuScreen | null) => {
      menuButtonTarget = fn
    },
    getRoot: () => root,
  }
}

const menuUI = createMenuUI()
window.addEventListener("keydown", menuUI.handleKey)

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

const getInputVector = () => {
  let throttle = 0
  let lean = 0
  if (keys[UP] || keys["w"] || keys["W"]) throttle += 1
  if (keys[DOWN] || keys["s"] || keys["S"]) throttle -= 1
  if (keys[RIGHT] || keys["d"] || keys["D"]) lean += 1
  if (keys[LEFT] || keys["a"] || keys["A"]) lean -= 1
  return { throttle, lean }
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

const draw = (frame: number) => {
  if (
    gameView.showIntro === 0 &&
    !menuUI.isShown() &&
    gameState !== "loading"
  ) {
    // Update physics and game logic only after intros finish.
    physEngine._doIV(1) // neutral input
    const input = getInputVector()
    physEngine._aIIV(input.throttle, input.lean)
    const k = physEngine._dovI()

    // Treat both crash outcomes as crash: 3 (broken) and 5 (hard crash).
    if ((k === 3 || k === 5) && gameState !== "crashed") {
      gameState = "crashed"
      crashTimer = Date.now() + 3000
      gameView.showInfoMessage("Crashed", 3000)
    } else if ((k === 1 || k === 2) && gameState !== "win") {
      gameState = "win"
      finishedTime = Date.now()
      finishTimer = Date.now() + 1000
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
    if (gameState === "win" && Date.now() > finishTimer && !advancing) {
      advancing = true
      gameState = "loading"
      void advanceToNextTrack()
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

const difficultyLevels = ["Easy", "Medium", "Hard"]
const leagues = ["100cc", "175cc", "220cc"]
const trackNames = loader.names ?? []
const levelOptions =
  trackNames.length > 0
    ? trackNames.map((_, idx) => difficultyLevels[idx] ?? `Level ${idx + 1}`)
    : difficultyLevels

let selectedLevel = 0
let selectedTrack = 0
let selectedLeague = 0
let gameStarted = false

const getTrackOptions = () => {
  const list = trackNames[selectedLevel]
  if (list && list.length > 0) return list
  return ["Track 1"]
}

const advanceToNextTrack = async () => {
  const tracks = getTrackOptions()
  let nextLevel = selectedLevel
  let nextTrack = selectedTrack + 1

  if (nextTrack >= tracks.length) {
    nextTrack = 0
    nextLevel += 1
  }

  if (nextLevel >= levelOptions.length) {
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
  await loader._doIII(levelIndex, trackIndex)
  gameView.showInfoMessage(loader.getLevelName(levelIndex, trackIndex), 3000)
  physEngine.setLeague(selectedLeague + 1)
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
  text: "High scores are not implemented yet.",
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
      const count = levelOptions.length
      selectedLevel = (selectedLevel + dir + count) % count
      const tracks = getTrackOptions()
      if (selectedTrack >= tracks.length) selectedTrack = 0
    },
  },
  {
    label: "Track",
    type: "option",
    getValue: () => getTrackOptions()[selectedTrack] ?? "Track",
    onChange: (dir) => {
      const tracks = getTrackOptions()
      const count = tracks.length
      selectedTrack = (selectedTrack + dir + count) % count
    },
  },
  {
    label: "League",
    type: "option",
    getValue: () => leagues[selectedLeague] ?? "League",
    onChange: (dir) => {
      const count = leagues.length
      selectedLeague = (selectedLeague + dir + count) % count
      physEngine.setLeague(selectedLeague + 1)
    },
  },
  { label: "High Scores", type: "submenu", target: highscoresMenu },
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

optionsMenu.items = [
  {
    label: "Perspective",
    type: "option",
    getValue: () => onOff[perspectiveIndex],
    onChange: (dir) => {
      perspectiveIndex = (perspectiveIndex + dir + 2) % 2
      loader.setPerspectiveEnabled(perspectiveIndex === 0)
    },
  },
  {
    label: "Shadows",
    type: "option",
    getValue: () => onOff[shadowsIndex],
    onChange: (dir) => {
      shadowsIndex = (shadowsIndex + dir + 2) % 2
      loader.setShadowsEnabled(shadowsIndex === 0)
    },
  },
  {
    label: "Driver Sprite",
    type: "option",
    getValue: () => onOff[driverSpriteIndex],
    onChange: (dir) => {
      driverSpriteIndex = (driverSpriteIndex + dir + 2) % 2
    },
  },
  {
    label: "Bike Sprite",
    type: "option",
    getValue: () => onOff[bikeSpriteIndex],
    onChange: (dir) => {
      bikeSpriteIndex = (bikeSpriteIndex + dir + 2) % 2
    },
  },
  {
    label: "Input",
    type: "option",
    getValue: () => `Keyset ${inputIndex + 1}`,
    onChange: (dir) => {
      inputIndex = (inputIndex + dir + 3) % 3
    },
  },
  {
    label: "Look Ahead",
    type: "option",
    getValue: () => onOff[lookAheadIndex],
    onChange: (dir) => {
      lookAheadIndex = (lookAheadIndex + dir + 2) % 2
    },
  },
  {
    label: "Vibrate on touch",
    type: "option",
    getValue: () => onOff[vibrateIndex],
    onChange: (dir) => {
      vibrateIndex = (vibrateIndex + dir + 2) % 2
    },
  },
  {
    label: "Keyboard in menu",
    type: "option",
    getValue: () => onOff[keyboardIndex],
    onChange: (dir) => {
      keyboardIndex = (keyboardIndex + dir + 2) % 2
    },
  },
  {
    label: "Clear highscore",
    type: "action",
    onSelect: () => menuUI.setScreen(clearedScreen),
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
highscoresMenu.items = [backItemFor(highscoresMenu)]
clearedScreen.items = [backItemFor(clearedScreen)]
objectiveScreen.items = [backItemFor(objectiveScreen)]
keysScreen.items = [backItemFor(keysScreen)]
unlockingScreen.items = [backItemFor(unlockingScreen)]
highscoreHelpScreen.items = [backItemFor(highscoreHelpScreen)]
optionsHelpScreen.items = [backItemFor(optionsHelpScreen)]

menuUI.setRoot(mainMenu)
menuUI.setMenuButtonTarget(() => (gameStarted ? ingameMenu : mainMenu))

gameView._doIIV(-50, 150)
physEngine._byteIV(1)

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
