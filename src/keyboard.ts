export const LEFT = "ArrowLeft"
export const RIGHT = "ArrowRight"
export const UP = "ArrowUp"
export const DOWN = "ArrowDown"
export const SPACE = " "

export const keys: Record<string, boolean> = {}

const handleonkeydown = ({ key }: KeyboardEvent) => {
  keys[key] = true
}

const handleonkeyup = ({ key }: KeyboardEvent) => {
  keys[key] = false
}

window.addEventListener("keydown", handleonkeydown)
window.addEventListener("keyup", handleonkeyup)
