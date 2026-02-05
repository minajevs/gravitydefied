import { Bitmap } from "./bitmap"
import { FPMath } from "./fpMath"
import { Physics } from "./physics"
import { Activity } from "../activity"

export class GameView {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  scaledWidth: number = null!
  scaledHeight: number = null!

  showIntro: 0 | 1 | 2

  pressedKeys: boolean[] // pressedKeys2

  debugText: string | null = "debug"

  static m_VI = 0
  static m_vcI = 0
  startFlagIndexes = [2, 0, 1, 0]
  finishFlagIndexes = [4, 3, 5, 3]
  drawTimer: boolean
  phoneMenuAvailable: boolean
  _phoneMenuShown: boolean
  m_rJ: number
  m_uI: number
  touchX: number // m_aiI
  touchY: number // m_agI
  m_gI: number

  m_XI: number
  m_BI: number
  physEngine: Physics
  m_TI: number
  m_QI: number
  // Paint infoFont;
  // Paint timerFont;
  m_ahZ: boolean
  m_OI: number = null!
  //android.graphics.Bitmap m_MBitmap;
  //Canvas m_dcGraphics;
  m_ecZ: boolean
  //String infoMessage;
  gc: number
  infoMessage: string | null
  infoMessageExpiresAt: number
  timerValue: number
  //Timer timer;
  //Command menuCommand;
  //Paint paint = new Paint();
  //Object m_ocObject;
  m_DaaB = [
    [0, 0],
    [1, 0],
    [0, -1],
    [0, 0],
    [0, 0],
    [0, 1],
    [-1, 0],
  ]
  controlsMap = [
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

  inputOption: number
  pressedKeys1: boolean[] = [] // m_aeaZ
  pressedKeys2: boolean[] = [] // m_LaZ

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")!

    this.pressedKeys = [...new Array(10)].map((_) => false)

    GameView.m_vcI = 0
    GameView.m_VI = 0
    this.physEngine = null!
    //menu = null;
    this.m_TI = 0
    this.m_QI = 0

    //infoFont = null;
    this.m_ahZ = false
    this.drawTimer = true
    this.showIntro = 1 // Should show intro flag. 1 - should show, 0 - intro shown
    this.m_uI = 0
    //this.m_zaBitmap = null;

    this.phoneMenuAvailable = false
    this._phoneMenuShown = true
    //m_MBitmap = null;
    //m_dcGraphics = null;
    this.m_ecZ = false
    //infoMessage = null;
    this.gc = 0
    this.infoMessage = null
    this.infoMessageExpiresAt = 0
    this.timerValue = 0
    //timer = new Timer();
    this.m_rJ = -1
    //m_ocObject = new Object();
    this.touchX = 0
    this.touchY = 0
    this.m_gI = -1
    this.inputOption = 2

    this.pressedKeys = [...new Array(10)].map((_) => false)

    this.initScreenSize()

    this.m_XI = 0
    this.m_BI = this.scaledHeight
  }

  onDraw() {
    this.ctx.save()

    // drawGame
    this.drawGame()

    this.ctx.restore()
  }

  drawGame() {
    // if (Activity.getGDActivity().isMenuShown()) {
    //   this._tryvV()
    //   return
    // }
    if (this.showIntro != 0) {
      if (this.showIntro === 1) {
        this.ctx.fillStyle = "#fff"
        this.ctx.fillRect(0, 0, this.scaledWidth, this.scaledHeight)
        this.drawBitmap(
          Bitmap.get("logo"),
          this.scaledWidth / 2 - Bitmap.getWidthDp("logo") / 2,
          this.scaledHeight / 2 - Bitmap.getHeightDp("logo") / 1.6,
          "logo",
          0,
        )
      }
      if (this.showIntro === 2) {
        this.ctx.fillStyle = "#fff"
        this.ctx.fillRect(0, 0, this.scaledWidth, this.scaledHeight)
        this.drawBitmap(
          Bitmap.get("logo2"),
          this.scaledWidth / 2 - Bitmap.getWidthDp("logo2") / 2,
          this.scaledHeight / 2 - Bitmap.getHeightDp("logo2") / 1.6,
          "logo2",
          0,
        )
      }
    } else {
      this.initScreenSize()
      this.physEngine._voidvV()
      this._doIIV(
        -this.physEngine._elsevI() + this.m_TI + this.scaledWidth / 2,
        this.physEngine._ifvI() + this.m_QI + this.scaledHeight / 2,
      )
      this.physEngine._ifiV(this)

      if (this.drawTimer) {
        this.drawTimerValue(this.timerValue)
      }

      if (this.infoMessage) {
        if (Date.now() > this.infoMessageExpiresAt) {
          this.infoMessage = null
        } else {
          this.ctx.save()
          this.ctx.fillStyle = "#000"
          this.ctx.font = "20px Tahoma, Verdana, sans-serif"
          this.ctx.textBaseline = "alphabetic"
          const width = this.ctx.measureText(this.infoMessage).width
          const x = this.scaledWidth / 2 - width / 2
          const y = this.scaledHeight / 5
          this.ctx.fillText(this.infoMessage, x, y)
          this.ctx.restore()
        }
      }
    }
  }

  private drawTimerValue(timeTicks: number) {
    const total = Math.max(0, Math.floor(timeTicks))
    const minutes = Math.floor(total / 6000)
    const seconds = Math.floor(total / 100) % 60
    const hundredths = total % 100
    const txt = `${minutes}:${seconds.toString().padStart(2, "0")}:${hundredths
      .toString()
      .padStart(2, "0")}`
    this.ctx.save()
    this.ctx.fillStyle = "#000"
    this.ctx.font = "18px Tahoma, Verdana, sans-serif"
    this.ctx.textBaseline = "alphabetic"
    this.ctx.fillText(txt, 18, 17)
    this.ctx.restore()
  }

  drawBitmap(
    b: HTMLImageElement,
    x: number,
    y: number,
    type?: string,
    index?: number,
  ) {
    // If type and index are provided, use getWidthDp/getHeightDp for scaling
    if (type && typeof index === "number") {
      const width = Bitmap.getWidthDp(type as any, index)
      const height = Bitmap.getHeightDp(type as any, index)
      this.ctx.drawImage(b, x, y, width, height)
    } else {
      // fallback: draw at natural size
      this.ctx.drawImage(b, x, y)
    }
  }

  _dovV() {
    GameView.m_vcI += 655
    let j =
      32768 +
      ((FPMath.sin(GameView.m_vcI) >= 0
        ? FPMath.sin(GameView.m_vcI)
        : -FPMath.sin(GameView.m_vcI)) >>
        1)
    GameView.m_VI += (6553 * j) >> 16
  }

  _intII(j: number) {}

  setShowIntro(flag: 0 | 1 | 2) {
    this.showIntro = flag
  }

  getScaledWidth() {
    return this.canvas.width
  }

  getScaledHeight() {
    return this.canvas.height
  }
  // _ifvV
  initScreenSize() {
    this.scaledWidth = this.getScaledWidth()
    this.scaledHeight = this.getScaledHeight()
  }

  resetInputs() {
    this.physEngine._nullvV()
    this.resetPressedKeys()
    this.touchX = 0
    this.touchY = 0
  }

  setPhysicsEngine(b1: Physics) {
    this.physEngine = b1
    this.physEngine._caseIV(
      this.scaledWidth >= this.scaledHeight
        ? this.scaledHeight
        : this.scaledWidth,
    )
  }

  showInfoMessage(text: string, durationMs: number) {
    this.infoMessage = text
    this.infoMessageExpiresAt = Date.now() + Math.max(0, durationMs)
  }

  setTimerValue(timeTicks: number) {
    this.timerValue = timeTicks
  }

  // public void setMenu(Menu menu) {
  // 	this.menu = menu;
  // }

  _doIIV(j: number, k: number) {
    this.m_XI = j
    this.m_BI = k
    this.physEngine._ifIIV(-j, -j + this.scaledWidth)
  }

  public _charvI() {
    return this.m_XI
  }

  private offsetX(j: number) {
    return j + this.m_XI
  }

  private offsetY(j: number) {
    return -j + this.m_BI - 10 //getGDActivity().getButtonsLayoutHeight() / 2;
  }

  public _aIIIV(j: number, k: number, l: number, i1: number) {
    this.ctx.beginPath()
    this.ctx.moveTo(this.offsetX(j), this.offsetY(k))
    this.ctx.lineTo(this.offsetX(l), this.offsetY(i1))
    this.ctx.closePath()
    this.ctx.stroke()
  }

  public _aIIIV2(j: number, k: number, l: number, i1: number, j1: number) {
    this.drawBikerPart(j, k, l, i1, j1, 32768)
  }

  public drawLine(j: number, k: number, l: number, i1: number) {
    this.ctx.beginPath()
    this.ctx.moveTo(
      this.offsetX(Number((BigInt(j) << 2n) / 0xffffn)),
      this.offsetY(Number((BigInt(k) << 2n) / 0xffffn)),
    )
    this.ctx.lineTo(
      this.offsetX(Number((BigInt(l) << 2n) / 0xffffn)),
      this.offsetY(Number((BigInt(i1) << 2n) / 0xffffn)),
    )
    this.ctx.closePath()
    this.ctx.stroke()
  }

  public drawStartFlag(j: number, k: number) {
    if (GameView.m_VI > 0x38000) GameView.m_VI = 0
    this.setColor(0, 0, 0)
    this._aIIIV(j, k, j, k + 32)
    const startFlag = this.startFlagIndexes[GameView.m_VI >> 16]
    this.drawBitmap(
      Bitmap.get("flags", startFlag),
      this.offsetX(j),
      this.offsetY(k) - 32,
      "flags",
      startFlag,
    )
  }

  public drawFinishFlag(j: number, k: number) {
    if (GameView.m_VI > 0x38000) GameView.m_VI = 0
    this.setColor(0, 0, 0)
    this._aIIIV(j, k, j, k + 32)
    const finishFlag = this.finishFlagIndexes[GameView.m_VI >> 16]

    this.drawBitmap(
      Bitmap.get("flags", finishFlag),
      this.offsetX(j),
      this.offsetY(k) - 32,
      "flags",
      finishFlag,
    )
  }

  public drawWheel(j: number, k: number, l: number) {
    let wheel: number
    if (l == 1)
      wheel = 0 // small
    else wheel = 1 // big

    let x = this.offsetX(j - Bitmap.getWidthDp("wheels", wheel) / 2)
    let y = this.offsetY(k + Bitmap.getHeightDp("wheels", wheel) / 2)

    this.drawBitmap(Bitmap.get("wheels", wheel), x, y, "wheels", wheel)
  }

  private resetPressedKeys() {
    for (let j = 0; j < 10; j++) this.pressedKeys2[j] = false

    for (let k = 0; k < 7; k++) this.pressedKeys1[k] = false
  }

  _tryvV() {
    //this.ctx.strokeStyle = `#fff`
    this.ctx.fillStyle = "#fff"
    this.ctx.fillRect(0, 0, this.scaledWidth, this.scaledHeight)
  }
  _ifIIIV(j: number, k: number, l: number, i1: number) {
    l++
    let j1 = this.offsetX(j - l)
    let k1 = this.offsetY(k + l)
    let l1 = l << 1
    // Use BigInt to emulate 64-bit fixed-point math and avoid 32-bit overflow
    const tmp = (BigInt(i1) * 0xb40000n) >> 16n
    if ((i1 = -Number(((tmp << 32n) / 0x3243fn) >> 16n)) < 0) {
      i1 += 360
    }
    this.ctx.beginPath()
    const startDeg = -(((i1 >> 16) + 170) % 360)
    const startRad = (startDeg * Math.PI) / 180
    const endRad = ((startDeg - 90) * Math.PI) / 180
    this.ctx.arc(j1 + l1 / 2, k1 + l1 / 2, l1 / 2, startRad, endRad, true)
    this.ctx.stroke()
  }

  public static _dovV() {}

  setColor(a: number, b: number, c: number) {
    if (Activity.getGDActivity().isMenuShown()) {
      a += 128
      b += 128
      c += 128
      if (a > 240) a = 240
      if (b > 240) b = 240
      if (c > 240) c = 240
    }
    this.ctx.strokeStyle = `rgb(${a}, ${b}, ${c})`
  }

  public drawLineWheel(j: number, k: number, l: number) {
    const i1 = l / 2
    const j1 = this.offsetX(j - i1)
    const k1 = this.offsetY(k + i1)
    this.ctx.beginPath()
    this.ctx.arc(j1 + i1, k1 + i1, i1, 0, Math.PI * 2)
    this.ctx.stroke()
  }

  public drawSteering(j: number, k: number) {
    let x = this.offsetX(j - Bitmap.getWidthDp("steering") / 2)
    let y = this.offsetY(k + Bitmap.getHeightDp("steering") / 2)

    this.drawBitmap(Bitmap.get("steering"), x, y, "steering", 0)
  }

  public drawBikerPart(
    j: number,
    k: number,
    l: number,
    i1: number,
    j1: number,
    k1: number,
  ) {
    const mix = Number(
      ((BigInt(l) * BigInt(k1)) >> 16n) +
        ((BigInt(j) * BigInt(0x10000 - k1)) >> 16n),
    )
    const mixY = Number(
      ((BigInt(i1) * BigInt(k1)) >> 16n) +
        ((BigInt(k) * BigInt(0x10000 - k1)) >> 16n),
    )
    const l1 = this.offsetX(Number(BigInt(mix) >> 16n))
    const i2 = this.offsetY(Number(BigInt(mixY) >> 16n))
    const j2 = FPMath._ifIII(l - j, i1 - k)
    const fAngleDeg = (j2 / 0xffff / Math.PI) * 180 - 180

    const sprite = Bitmap.get("biker", j1)
    if (sprite) {
      const width = Bitmap.getWidthDp("biker", j1)
      const height = Bitmap.getHeightDp("biker", j1)
      const x = l1 - width / 2
      const y = i2 - height / 2
      this.ctx.save()
      this.ctx.translate(x + width / 2, y + height / 2)
      this.ctx.rotate((fAngleDeg * Math.PI) / 180)
      this.ctx.translate(-width / 2, -height / 2)
      this.drawBitmap(sprite, 0, 0, "biker", j1)
      this.ctx.restore()
    }
  }
  public drawFender(j: number, k: number, l: number) {
    let fAngleDeg = (l / 0xffff / Math.PI) * 180 - 180 + 15
    if (fAngleDeg >= 360) fAngleDeg -= 360
    const width = Bitmap.getWidthDp("fender", 0)
    const height = Bitmap.getHeightDp("fender", 0)
    const x = this.offsetX(j) - width / 2
    const y = this.offsetY(k) - height / 2
    const img = Bitmap.get("fender", 0)
    this.ctx.save()
    this.ctx.translate(x + width / 2, y + height / 2)
    this.ctx.rotate((fAngleDeg * Math.PI) / 180)
    this.ctx.translate(-width / 2, -height / 2)
    this.drawBitmap(img, 0, 0, "fender", 0)
    this.ctx.restore()
  }
  // if (Bitmap.get(Bitmap.FENDER) != null) {
  // 	float x = offsetX(j) - Bitmap.get(Bitmap.FENDER).getWidthDp() / 2;
  // 	float y = offsetY(k) - Bitmap.get(Bitmap.FENDER).getHeightDp() / 2;

  // 	canvas.save();
  // 	canvas.rotate(fAngleDeg, x + Bitmap.get(Bitmap.FENDER).getWidthDp() / 2, y + Bitmap.get(Bitmap.FENDER).getHeightDp() / 2);
  // 	drawBitmap(Bitmap.get(Bitmap.FENDER), x, y);
  // 	canvas.restore();
  // }
  public drawEngine(j: number, k: number, l: number) {
    const angle = (l / 0xffff / Math.PI) * 180 - 180
    const width = Bitmap.getWidthDp("engine", 0)
    const height = Bitmap.getHeightDp("engine", 0)
    const x = this.offsetX(j) - width / 2
    const y = this.offsetY(k) - height / 2
    const img = Bitmap.get("engine", 0)
    this.ctx.save()
    this.ctx.translate(x + width / 2, y + height / 2)
    this.ctx.rotate((angle * Math.PI) / 180)
    this.ctx.translate(-width / 2, -height / 2)
    this.drawBitmap(img, 0, 0, "engine", 0)
    this.ctx.restore()
  }

  public drawHelmet(j: number, k: number, l: number) {
    let fAngleDeg = (l / 0xffff / Math.PI) * 180 - 90 - 10
    if (fAngleDeg >= 360) fAngleDeg -= 360
    if (fAngleDeg < 0) fAngleDeg = 360 + fAngleDeg
    const width = Bitmap.getWidthDp("helmet", 0)
    const height = Bitmap.getHeightDp("helmet", 0)
    const x = this.offsetX(j) - width / 2
    const y = this.offsetY(k) - height / 2
    const img = Bitmap.get("helmet", 0)
    this.ctx.save()
    this.ctx.translate(x + width / 2, y + height / 2)
    this.ctx.rotate((fAngleDeg * Math.PI) / 180)
    this.ctx.translate(-width / 2, -height / 2)
    this.drawBitmap(img, 0, 0, "helmet", 0)
    this.ctx.restore()
  }
}
