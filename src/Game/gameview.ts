import { Bitmap } from "./bitmap"
import { FPMath } from "./fpMath"
import { Physics } from "./physics"

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
    if (this.showIntro != 0) {
      if (this.showIntro === 1) {
        this.ctx.fillStyle = "#fff"
        this.ctx.fillRect(0, 0, this.scaledWidth, this.scaledHeight)
        this.drawBitmap(
          Bitmap.get("logo"),
          this.scaledWidth / 2 - Bitmap.getWidthDp("logo") / 2,
          this.scaledHeight / 2 - Bitmap.getHeightDp("logo") / 1.6,
          "logo",
          0
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
          0
        )
      }
    } else {
      this.initScreenSize()
      this.physEngine._voidvV()
      this._doIIV(
        -this.physEngine._elsevI() + this.m_TI + this.scaledWidth / 2,
        this.physEngine._ifvI() + this.m_QI + this.scaledHeight / 2
      )
      this.physEngine._ifiV(this)
    }
  }

  drawBitmap(
    b: HTMLImageElement,
    x: number,
    y: number,
    type?: string,
    index?: number
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
        : this.scaledWidth
    )
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
    // this.ctx.beginPath()
    // this.ctx.moveTo(this.offsetX(j), this.offsetY(k))
    // this.ctx.lineTo(this.offsetX(l), this.offsetY(i1))
    // this.ctx.closePath()
    // this.ctx.stroke()
  }

  public drawLine(j: number, k: number, l: number, i1: number) {
    this.ctx.beginPath()
    this.ctx.moveTo(
      this.offsetX((j << 2) / 0xffff),
      this.offsetY((k << 2) / 0xffff)
    )
    this.ctx.lineTo(
      this.offsetX((l << 2) / 0xffff),
      this.offsetY((i1 << 2) / 0xffff)
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
      startFlag
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
      finishFlag
    )
  }

  public drawWheel(j: number, k: number, l: number) {
    let wheel: number
    if (l == 1) wheel = 0 // small
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
    // Use BigInt to emulate 64-bit fixed-point division in angle conversion
    if (
      (i1 = -Number(
        ((BigInt((i1 * 0xb40000) >> 16) << 32n) / BigInt(0x3243f)) >> 16n
      )) < 0
    )
      i1 += 360
    //paint.setStyle(Paint.Style.STROKE);
    //canvas.drawArc(new RectF(j1, k1, j1 + l1, k1 + l1), -((i1 >> 16) + 170), -90, false, paint);
    //paint.setStyle(Paint.Style.FILL);
  }

  public static _dovV() {}

  setColor(a: number, b: number, c: number) {
    this.ctx.strokeStyle = `rgb(${a}, ${b}, ${c})`
  }

  public drawLineWheel(j: number, k: number, l: number) {
    let i1 = l / 2
    let j1 = this.offsetX(j - i1)
    let k1 = this.offsetY(k + i1)

    //paint.setStyle(Paint.Style.STROKE);
    this.ctx.roundRect(j1, k1, j1 + l, k1 + l, 999)
    //canvas.drawArc(new RectF(j1, k1, j1 + l, k1 + l), 0, 360, true, paint)
    //paint.setStyle(Paint.Style.FILL);
  }

  public drawSteering(j: number, k: number) {
    let x = this.offsetX(j - Bitmap.getWidthDp("steering") / 2)
    let y = this.offsetY(k + Bitmap.getHeightDp("steering") / 2)

    this.drawBitmap(Bitmap.get("steering"), x, y, "steering", 0)
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
    // const angle = (l / 0xffff / Math.PI) * 180 - 180
    // const width = Bitmap.getWidthDp("engine", 0)
    // const height = Bitmap.getHeightDp("engine", 0)
    // const offsetX = this.offsetX(j) - width / 2
    // const offsetY = this.offsetY(k) - height / 2
    // const img = Bitmap.get("engine", 0)
    // this.ctx.save()
    // this.ctx.translate(offsetX + width / 2, offsetY + height / 2)
    // this.ctx.rotate((angle * Math.PI) / 180)
    // this.ctx.translate(-width / 2, -height / 2)
    // this.drawBitmap(img, 0, 0, "engine", 0)
    // this.ctx.restore()
    // // float fAngleDeg = (float) (l / (float) 0xFFFF / Math.PI * 180) - 180;
    // // float x = offsetX(j) - Bitmap.get(Bitmap.ENGINE).getWidthDp() / 2;
    // // float y = offsetY(k) - Bitmap.get(Bitmap.ENGINE).getHeightDp() / 2;
    // // if (Bitmap.get(Bitmap.ENGINE) != null) {
    // // 	canvas.save();
    // // 	canvas.rotate(fAngleDeg, x + Bitmap.get(Bitmap.ENGINE).getWidthDp() / 2, y + Bitmap.get(Bitmap.ENGINE).getHeightDp() / 2);
    // // 	drawBitmap(Bitmap.get(Bitmap.ENGINE), x, y);
    // // 	canvas.restore();
    // // }
  }
}
