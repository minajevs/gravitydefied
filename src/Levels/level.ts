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
    else return Number(((BigInt(k) << 32n) / BigInt(i1)) >> 16n)
  }

  _ifIIV(j: number, k: number) {
    this.m_aI = Number((BigInt(j) << 16n) >> 3n)
    this.m_dI = Number((BigInt(k) << 16n) >> 3n)
  }

  _aIIV(j: number, k: number) {
    this.m_eI = Number(BigInt(j) >> 1n)
    this.m_bI = Number(BigInt(k) >> 1n)
  }

  _aIIV2(j: number, k: number, i1: number) {
    this.m_eI = j
    this.m_bI = k
    this.m_gI = i1
  }

  _ifiIV(view: GameView, k: number, i1: number) {
    if (i1 <= this.pointsCount - 1) {
      let j1 =
        this.m_gI -
          Number(BigInt(this.points[k][1] + this.points[i1 + 1][1]) >> 1n) >=
        0
          ? this.m_gI -
            Number(BigInt(this.points[k][1] + this.points[i1 + 1][1]) >> 1n)
          : 0
      if (this.m_gI <= this.points[k][1] || this.m_gI <= this.points[i1 + 1][1])
        j1 = j1 >= 0x50000 ? 0x50000 : j1
      this.m_rI =
        Number((BigInt(this.m_rI) * 49152n) >> 16n) +
        Number((BigInt(j1) * 16384n) >> 16n)
      if (this.m_rI <= 0x88000) {
        let k1 = Number((BigInt(0x190000 * this.m_rI) >> 16n) >> 16n)
        view.setColor(k1, k1, k1)
        let l1 = this.points[k][0] - this.points[k + 1][0]
        let i2 = Number(
          ((BigInt(this.points[k][1] - this.points[k + 1][1]) << 32n) /
            BigInt(l1)) >>
            16n
        )
        let j2 =
          this.points[k][1] -
          Number((BigInt(this.points[k][0]) * BigInt(i2)) >> 16n)
        let k2 = Number((BigInt(this.m_eI) * BigInt(i2)) >> 16n) + j2
        l1 = this.points[i1][0] - this.points[i1 + 1][0]
        i2 = Number(
          ((BigInt(this.points[i1][1] - this.points[i1 + 1][1]) << 32n) /
            BigInt(l1)) >>
            16n
        )
        j2 =
          this.points[i1][1] -
          Number((BigInt(this.points[i1][0]) * BigInt(i2)) >> 16n)
        let l2 = Number((BigInt(this.m_bI) * BigInt(i2)) >> 16n) + j2
        if (k == i1) {
          view._aIIIV(
            Number((BigInt(this.m_eI) << 3n) >> 16n),
            Number((BigInt(k2 + 0x10000) << 3n) >> 16n),
            Number((BigInt(this.m_bI) << 3n) >> 16n),
            Number((BigInt(l2 + 0x10000) << 3n) >> 16n)
          )
          return
        }
        view._aIIIV(
          Number((BigInt(this.m_eI) << 3n) >> 16n),
          Number((BigInt(k2 + 0x10000) << 3n) >> 16n),
          Number((BigInt(this.points[k + 1][0]) << 3n) >> 16n),
          Number((BigInt(this.points[k + 1][1] + 0x10000) << 3n) >> 16n)
        )
        for (let i3 = k + 1; i3 < i1; i3++)
          view._aIIIV(
            Number((BigInt(this.points[i3][0]) << 3n) >> 16n),
            Number((BigInt(this.points[i3][1] + 0x10000) << 3n) >> 16n),
            Number((BigInt(this.points[i3 + 1][0]) << 3n) >> 16n),
            Number((BigInt(this.points[i3 + 1][1] + 0x10000) << 3n) >> 16n)
          )

        view._aIIIV(
          Number((BigInt(this.points[i1][0]) << 3n) >> 16n),
          Number((BigInt(this.points[i1][1] + 0x10000) << 3n) >> 16n),
          Number((BigInt(this.m_bI) << 3n) >> 16n),
          Number((BigInt(l2 + 0x10000) << 3n) >> 16n)
        )
      }
    }
  }

  _aiIV(view: GameView, k: number, i1: number, shadowsEnabled = true) {
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
    i3 = Number(((BigInt(i3) << 32n) / BigInt((k3 >> 1) >> 1)) >> 16n)
    j3 = Number(((BigInt(j3) << 32n) / BigInt((k3 >> 1) >> 1)) >> 16n)
    view.setColor(0, 170, 0)
    do {
      if (j2 >= this.pointsCount - 1) break
      let j1 = i3
      let l1 = j3
      i3 = k - this.points[j2 + 1][0]
      j3 = i1 + 0x320000 - this.points[j2 + 1][1]
      let l3 = Physics._doIII(i3, j3)
      i3 = Number(((BigInt(i3) << 32n) / BigInt((l3 >> 1) >> 1)) >> 16n)
      j3 = Number(((BigInt(j3) << 32n) / BigInt((l3 >> 1) >> 1)) >> 16n)
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

    if (shadowsEnabled) this._ifiIV(view, k2, l2)
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
        Number((BigInt(this.points[k][0]) << 3n) >> 16n),
        Number((BigInt(this.points[k][1]) << 3n) >> 16n),
        Number((BigInt(this.points[k + 1][0]) << 3n) >> 16n),
        Number((BigInt(this.points[k + 1][1]) << 3n) >> 16n)
      )
      if (this.m_gotoI == k) {
        view.drawStartFlag(
          Number((BigInt(this.points[this.m_gotoI][0]) << 3n) >> 16n),
          Number((BigInt(this.points[this.m_gotoI][1]) << 3n) >> 16n)
        )
        view.setColor(0, 255, 0)
      }
      if (this.m_forI == k) {
        view.drawFinishFlag(
          Number((BigInt(this.points[this.m_forI][0]) << 3n) >> 16n),
          Number((BigInt(this.points[this.m_forI][1]) << 3n) >> 16n)
        )
        view.setColor(0, 255, 0)
      }
      if (this.points[k][0] > this.m_dI) break
      k++
    } while (true)
  }

  unpackInt(x: number, y: number) {
    this.addPoint(
      Number((BigInt(x) << 16n) >> 3n),
      Number((BigInt(y) << 16n) >> 3n)
    )
  }

  addPoint(x: number, y: number) {
    if (this.points == null || this.points.length <= this.pointsCount) {
      let i1 = 100
      if (this.points != null)
        i1 = i1 >= this.points.length + 30 ? i1 : this.points.length + 30
      let ai: number[][] = init2Array(i1, 2)
      if (this.points != null) {
        for (let i = 0; i < this.points.length; i++) {
          ai[i][0] = this.points[i][0]
          ai[i][1] = this.points[i][1]
        }
      }
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
      let byteRes = readByte(arr)
      let byte = byteRes[0]
      arr = byteRes[1]
      // If first byte is 50, read and skip 20 bytes
      if (byte == 50) {
        let bytes: number[] = []
        for (let i = 0; i < 20; i++) {
          let bRes = readByte(arr)
          let b = bRes[0]
          arr = bRes[1]
          bytes.push(b)
        }
      }
      this.m_forI = 0
      this.m_gotoI = 0

      let res
      res = readInt(arr)
      this.startX = res[0]
      arr = res[1]
      res = readInt(arr)
      this.startY = res[0]
      arr = res[1]
      res = readInt(arr)
      this.finishX = res[0]
      arr = res[1]
      res = readInt(arr)
      this.finishY = res[0]
      arr = res[1]
      let pointsCountRes = readShort(arr)
      let pointsCount = pointsCountRes[0]
      arr = pointsCountRes[1]
      res = readInt(arr)
      let firstPointX = res[0]
      arr = res[1]
      res = readInt(arr)
      let firstPointY = res[0]
      arr = res[1]

      let k1 = firstPointX
      let l1 = firstPointY

      this.unpackInt(k1, l1)
      for (let i = 1; i < pointsCount; i++) {
        let x: number
        let y: number
        let byte0Res = readByte(arr)
        let byte0 = byte0Res[0]
        arr = byte0Res[1]
        if (byte0 === -1) {
          k1 = 0
          l1 = 0
          let xRes = readInt(arr)
          x = xRes[0]
          arr = xRes[1]
          let yRes = readInt(arr)
          y = yRes[0]
          arr = yRes[1]
        } else {
          x = byte0
          let yByteRes = readByte(arr)
          let yByte = yByteRes[0]
          arr = yByteRes[1]
          y = (yByte << 24) >> 24
        }
        k1 += x
        l1 += y
        this.unpackInt(k1, l1)
      }
      //console.log(this)
    } catch (ex) {
      console.log(ex)
    }
  }
}
