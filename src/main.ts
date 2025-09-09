import { GameView } from "./Game/gameview"
import { Physics } from "./Game/physics"
import { keys, LEFT, RIGHT, UP, DOWN } from "./keyboard"
import { Level } from "./Levels/level"
import { Loader } from "./Levels/loader"
import { Reader } from "./Levels/reader"
import { readStreamToEnd, skipBytes } from "./Levels/readerUtils"

const canvas = document.createElement("canvas")
;(canvas.id = "GameCanvas"),
  (canvas.width = 400),
  (canvas.height = 600),
  (canvas.style.border = "1px solid")
document.body.appendChild(canvas)

const ctx = canvas.getContext("2d")
const img = new Image()

const IMAGES_DELAY = 1000

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

const init = () => {
  //img.src = "helmet.png"
  window.requestAnimationFrame(draw)
}

let gameState = "playing" // "playing", "crashed", "finished", etc.
let crashTimer = 0
let finishTimer = 0

const draw = (frame: number) => {
  if (gameView.showIntro === 0) {
    // Update physics and game logic only after intros finish.
    physEngine._doIV(1) // neutral input
    const k = physEngine._dovI()

    // Only act on real crash (3) and win (1/2). Ignore 4/5.
    if (k === 3 && gameState !== "crashed") {
      gameState = "crashed"
      crashTimer = Date.now() + 3000
    } else if ((k === 1 || k === 2) && gameState !== "win") {
      gameState = "win"
      finishTimer = Date.now() + 1000
    }

    // Handle timers for crash/finish/win
    if (gameState === "crashed" && Date.now() > crashTimer) {
      physEngine._doZV(true)
      gameState = "playing"
    }
    if (
      (gameState === "finished" || gameState === "win") &&
      Date.now() > finishTimer
    ) {
      physEngine._doZV(true)
      gameState = "playing"
    }

    physEngine._charvV()
    console.log(
      `State: ${gameState}, k=${k}, pos=(${physEngine._ifvI()},${physEngine._elsevI()})`
    )
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

// j.setColor(0, 255, 0);
// levels._aiV(j);

console.log("start main loop")
// The main loop is now handled by requestAnimationFrame in draw()
