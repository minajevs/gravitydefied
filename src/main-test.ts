import { keys, LEFT, RIGHT, UP, DOWN } from "./keyboard"

const canvas = document.createElement("canvas")
;(canvas.id = "GameCanvas"),
  (canvas.width = 800),
  (canvas.height = 600),
  (canvas.style.border = "1px solid")
document.body.appendChild(canvas)

const ctx = canvas.getContext("2d")
const img = new Image()

if (ctx === null) throw new Error("Can't load canvas")

const fps = 5
const fpsInterval = 1000 / fps
let previousFrame = 0

let curx = 0
let cury = 0

const init = () => {
  img.src = "helmet.png"
  window.requestAnimationFrame(draw)
}

const draw = (frame: number) => {
  window.requestAnimationFrame(draw)

  const delta = frame - previousFrame

  if (delta < fpsInterval) return
  previousFrame = frame

  if (keys[RIGHT]) curx += 10
  if (keys[LEFT]) curx -= 10
  if (keys[UP]) cury -= 10
  if (keys[DOWN]) cury += 10

  ctx.globalCompositeOperation = "destination-over"
  ctx.clearRect(0, 0, 800, 600) // clear canvas
  ctx.drawImage(img, curx, cury)
}

init()
