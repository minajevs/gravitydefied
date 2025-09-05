import { GameView } from "../Game/gameview"
import { Physics } from "../Game/physics"
import { init2Array, initArray } from "../helpers"
import { readByte, readInt, readShort, readStreamToEnd } from "./readerUtils"

export class Level {
  startX: number = null!
  startY: number = null!
  finishX: number = null!
  m_gotoI: number
  m_forI: number
  finishY: number = null!
  pointsCount: number = null!
  m_intI: number = null!
  points: number[][]
  levelName: string
  m_aI: number
  m_dI: number
  m_eI: number
  m_bI: number
  m_gI: number
  m_rI: number

  constructor() {
    this.m_aI = 0
    this.m_dI = 0
    this.m_eI = 0
    this.m_bI = 0
    this.m_gI = 0
    this.m_gotoI = 0
    this.m_forI = 0
    this.points = null!
    this.levelName = "levelname"
    this.m_rI = 0
    this.clear()
  }

  clear() {
    this.startX = 0
    this.startY = 0
    this.finishX = 0xc80000
    this.pointsCount = 0
    this.m_intI = 0
  }

  _doII(j: number) {
    let k = j - this.points[this.m_gotoI][0]
    let i1: number
    if (
      ((i1 = this.points[this.m_forI][0] - this.points[this.m_gotoI][0]) >= 0
        ? i1
        : -i1) < 3 ||
      k > i1
    )
      return 0x10000
    else return ((k << 32) / i1) >> 16
  }

  _ifIIV(j: number, k: number) {
    this.m_aI = (j << 16) >> 3
    this.m_dI = (k << 16) >> 3
  }

  _aIIV(j: number, k: number) {
    this.m_eI = j >> 1
    this.m_bI = k >> 1
  }

  _aIIV2(j: number, k: number, i1: number) {
    this.m_eI = j
    this.m_bI = k
    this.m_gI = i1
  }

  _ifiIV(view: GameView, k: number, i1: number) {
    if (i1 <= this.pointsCount - 1) {
      let j1 =
        this.m_gI - ((this.points[k][1] + this.points[i1 + 1][1]) >> 1) >= 0
          ? this.m_gI - ((this.points[k][1] + this.points[i1 + 1][1]) >> 1)
          : 0
      if (this.m_gI <= this.points[k][1] || this.m_gI <= this.points[i1 + 1][1])
        j1 = j1 >= 0x50000 ? 0x50000 : j1
      this.m_rI = ((this.m_rI * 49152) >> 16) + ((j1 * 16384) >> 16)
      if (this.m_rI <= 0x88000) {
        let k1 = ((0x190000 * this.m_rI) >> 16) >> 16
        view.setColor(k1, k1, k1)
        let l1 = this.points[k][0] - this.points[k + 1][0]
        let i2 =
          (((this.points[k][1] - this.points[k + 1][1]) << 32) / l1) >> 16
        let j2 = this.points[k][1] - ((this.points[k][0] * i2) >> 16)
        let k2 = ((this.m_eI * i2) >> 16) + j2
        l1 = this.points[i1][0] - this.points[i1 + 1][0]
        i2 = (((this.points[i1][1] - this.points[i1 + 1][1]) << 32) / l1) >> 16
        j2 = this.points[i1][1] - ((this.points[i1][0] * i2) >> 16)
        let l2 = ((this.m_bI * i2) >> 16) + j2
        if (k == i1) {
          view._aIIIV(
            (this.m_eI << 3) >> 16,
            ((k2 + 0x10000) << 3) >> 16,
            (this.m_bI << 3) >> 16,
            ((l2 + 0x10000) << 3) >> 16
          )
          return
        }
        view._aIIIV(
          (this.m_eI << 3) >> 16,
          ((k2 + 0x10000) << 3) >> 16,
          (this.points[k + 1][0] << 3) >> 16,
          ((this.points[k + 1][1] + 0x10000) << 3) >> 16
        )
        for (let i3 = k + 1; i3 < i1; i3++)
          view._aIIIV(
            (this.points[i3][0] << 3) >> 16,
            ((this.points[i3][1] + 0x10000) << 3) >> 16,
            (this.points[i3 + 1][0] << 3) >> 16,
            ((this.points[i3 + 1][1] + 0x10000) << 3) >> 16
          )

        view._aIIIV(
          (this.points[i1][0] << 3) >> 16,
          ((this.points[i1][1] + 0x10000) << 3) >> 16,
          (this.m_bI << 3) >> 16,
          ((l2 + 0x10000) << 3) >> 16
        )
      }
    }
  }

  _aiIV(view: GameView, k: number, i1: number) {
    let k2 = 0
    let l2 = 0
    let j2: number
    for (
      j2 = 0;
      j2 < this.pointsCount - 1 && this.points[j2][0] <= this.m_aI;
      j2++
    );
    if (j2 > 0) j2--
    let i3 = k - this.points[j2][0]
    let j3 = i1 + 0x320000 - this.points[j2][1]
    let k3 = Physics._doIII(i3, j3)
    i3 = ((i3 << 32) / ((k3 >> 1) >> 1)) >> 16
    j3 = ((j3 << 32) / ((k3 >> 1) >> 1)) >> 16
    view.setColor(0, 170, 0)
    do {
      if (j2 >= this.pointsCount - 1) break
      let j1 = i3
      let l1 = j3
      i3 = k - this.points[j2 + 1][0]
      j3 = i1 + 0x320000 - this.points[j2 + 1][1]
      let l3 = Physics._doIII(i3, j3)
      i3 = ((i3 << 32) / ((l3 >> 1) >> 1)) >> 16
      j3 = ((j3 << 32) / ((l3 >> 1) >> 1)) >> 16
      view._aIIIV(
        ((this.points[j2][0] + j1) << 3) >> 16,
        ((this.points[j2][1] + l1) << 3) >> 16,
        ((this.points[j2 + 1][0] + i3) << 3) >> 16,
        ((this.points[j2 + 1][1] + j3) << 3) >> 16
      )
      view._aIIIV(
        (this.points[j2][0] << 3) >> 16,
        (this.points[j2][1] << 3) >> 16,
        ((this.points[j2][0] + j1) << 3) >> 16,
        ((this.points[j2][1] + l1) << 3) >> 16
      )
      if (j2 > 1) {
        if (this.points[j2][0] > this.m_eI && k2 == 0) k2 = j2 - 1
        if (this.points[j2][0] > this.m_bI && l2 == 0) l2 = j2 - 1
      }
      if (this.m_gotoI == j2) {
        view.drawStartFlag(
          ((this.points[this.m_gotoI][0] + j1) << 3) >> 16,
          ((this.points[this.m_gotoI][1] + l1) << 3) >> 16
        )
        view.setColor(0, 170, 0)
      }
      if (this.m_forI == j2) {
        view.drawFinishFlag(
          ((this.points[this.m_forI][0] + j1) << 3) >> 16,
          ((this.points[this.m_forI][1] + l1) << 3) >> 16
        )
        view.setColor(0, 170, 0)
      }
      if (this.points[j2][0] > this.m_dI) break
      j2++
    } while (true)
    let k1 = i3
    let i2 = j3
    view._aIIIV(
      (this.points[this.pointsCount - 1][0] << 3) >> 16,
      (this.points[this.pointsCount - 1][1] << 3) >> 16,
      ((this.points[this.pointsCount - 1][0] + k1) << 3) >> 16,
      ((this.points[this.pointsCount - 1][1] + i2) << 3) >> 16
    )

    // TODO
    // if (getLevelLoader().isShadowsEnabled())
    this._ifiIV(view, k2, l2)
  }

  _aiV(view: GameView) {
    let k: number
    for (
      k = 0;
      k < this.pointsCount - 1 && this.points[k][0] <= this.m_aI;
      k++
    );
    if (k > 0) k--
    do {
      if (k >= this.pointsCount - 1) break
      view._aIIIV(
        (this.points[k][0] << 3) >> 16,
        (this.points[k][1] << 3) >> 16,
        (this.points[k + 1][0] << 3) >> 16,
        (this.points[k + 1][1] << 3) >> 16
      )
      if (this.m_gotoI == k) {
        view.drawStartFlag(
          (this.points[this.m_gotoI][0] << 3) >> 16,
          (this.points[this.m_gotoI][1] << 3) >> 16
        )
        view.setColor(0, 255, 0)
      }
      if (this.m_forI == k) {
        view.drawFinishFlag(
          (this.points[this.m_forI][0] << 3) >> 16,
          (this.points[this.m_forI][1] << 3) >> 16
        )
        view.setColor(0, 255, 0)
      }
      if (this.points[k][0] > this.m_dI) break
      k++
    } while (true)
  }

  unpackInt(x: number, y: number) {
    this.addPoint((x << 16) >> 3, (y << 16) >> 3)
  }

  addPoint(x: number, y: number) {
    if (this.points == null || this.points.length <= this.pointsCount) {
      let i1 = 100
      if (this.points != null)
        i1 = i1 >= this.points.length + 30 ? i1 : this.points.length + 30
      let ai: number[][] = init2Array(i1, 2)
      if (this.points != null) ai = [...this.points]
      // System.arraycopy(points, 0, ai, 0, points.length);
      this.points = ai
    }
    if (this.pointsCount == 0 || this.points[this.pointsCount - 1][0] < x) {
      //this.points[this.pointsCount] ??= []
      this.points[this.pointsCount][0] = x
      this.points[this.pointsCount][1] = y
      this.pointsCount++
    }
  }

  readTrackData(arr: Uint8Array) {
    try {
      this.clear()
      const [byte, newArr] = readByte(arr)
      arr = newArr
      console.log(byte)
      if (byte == 50) {
        let bytes: number[] = []
        bytes = [...arr]
      }
      this.m_forI = 0
      this.m_gotoI = 0

      const [int1, newArr1] = readInt(arr)
      arr = newArr1
      this.startX = int1
      const [int2, newArr2] = readInt(arr)
      arr = newArr2
      this.startY = int2
      const [int3, newArr3] = readInt(arr)
      arr = newArr3
      this.finishX = int3
      const [int4, newArr4] = readInt(arr)
      arr = newArr4
      this.finishY = int4

      const [int5, newArr5] = readShort(arr)
      arr = newArr5
      let pointsCount = int5

      const [int6, newArr6] = readInt(arr)
      arr = newArr6
      let firstPointX = int6
      const [int7, newArr7] = readInt(arr)
      arr = newArr7
      let firstPointY = int7

      let k1 = firstPointX
      let l1 = firstPointY

      this.unpackInt(k1, l1)
      for (let i = 1; i < pointsCount; i++) {
        let x: number
        let y: number
        const [byte0, newArr0] = readByte(arr)
        arr = newArr0
        if (byte0 === -1) {
          k1 = l1 = 0
          const [int1, newArr1] = readInt(arr)
          arr = newArr1
          x = int1
          const [int2, newArr2] = readInt(arr)
          arr = newArr2
          y = int2
        } else {
          x = byte0
          const [int1, newArr1] = readInt(arr)
          arr = newArr1
          y = int1
        }
        k1 += x
        l1 += y
        this.unpackInt(k1, l1)
      }

      console.log(this)

      /*logDebug("Points: ");
			for (int[] point: points) {
				logDebug("(" + ((point[0] >> 16) << 3) + ", " + ((point[1] >> 16) << 3) + ")");
			}*/
    } catch (ex) {
      console.log(ex)
    }
  }
}
