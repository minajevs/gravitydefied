import { GameView } from "../Game/gameview"
import { Physics } from "../Game/physics"
import { init2Array, initArray } from "../helpers"
import { SimpleMenuElement } from "../Menu/simpleMenuElement"
import { Level } from "./level"
import { Reader } from "./reader"
import { readStreamToEnd, skipBytes } from "./readerUtils"

export class Loader {
  public levels: Level = null!
  public m_nullI: number = null!
  public m_fI: number = null!
  public names: string[][] = null!
  public m_jI: number = null!
  public m_iI: number = null!
  public m_longI: number = null!
  public m_eI: number = null!
  public m_dI: number = null!

  perspectiveEnabled = true
  shadowsEnabled = true
  pointers: number[][] = init2Array(3, 0)
  m_eaI: number = 0
  m_faI: number = 0
  m_aI: number = 0
  m_kI: number = 0
  m_saaI: number[][] | null = null
  m_haI: number[] = null!
  m_vaI: number[] = null!
  m_daI: number = null!

  async reset() {
    this.m_saaI = null
    this.levels = null!
    this.m_haI = initArray(3)
    this.m_vaI = initArray(3)
    this.m_nullI = 0
    this.m_fI = -1
    this.names = init2Array(3, 0)
    this.m_daI = 0
    // Initialize last surface normal to 0 to avoid nulls before first contact
    this.m_eI = 0
    this.m_dI = 0
    for (let j = 0; j < 3; j++) {
      const a = Number(BigInt(Physics.m_foraI[j] + 19660) >> 1n)
      const b = Number(BigInt(Physics.m_foraI[j] - 19660) >> 1n)
      this.m_haI[j] = Number((BigInt(a) * BigInt(a)) >> 16n)
      this.m_vaI[j] = Number((BigInt(b) * BigInt(b)) >> 16n)
    }

    // try {
    await this.readLevels()
    // } catch ( _ex) {
    //	_ex.printStackTrace();
    //}
    await this._ifvV()
  }

  async readLevels() {
    const fetchLevels = await fetch("levels.mrg")
    const stream = fetchLevels.body
    const header = await Reader.readHeader(stream!)

    this.pointers = header.getPointers()
    this.names = header.getNames()
  }

  getLevelName(j: number, k: number) {
    if (j < this.names.length && k < this.names[j].length)
      return this.names[j][k]
    else return "---"
  }

  async _ifvV() {
    await this._doIII(this.m_nullI, this.m_fI + 1)
  }

  async _doIII(j: number, k: number) {
    this.m_nullI = j
    this.m_fI = k
    if (this.m_fI >= this.names[this.m_nullI].length) this.m_fI = 0
    await this._hIIV(this.m_nullI + 1, this.m_fI + 1)
    return this.m_fI
  }

  async _hIIV(j: number, k: number) {
    try {
      const fetchLevels = await fetch("levels.mrg")
      const stream = fetchLevels.body

      let arr = await readStreamToEnd(stream!.getReader())
      arr = skipBytes(arr, this.pointers[j - 1][k - 1])
      if (this.levels === null) {
        this.levels = new Level()
      }
      this.levels.readTrackData(arr)
      this.load(this.levels)
    } catch (ex) {
      console.log(ex)
    }
  }

  _ifIV() {
    this.m_jI = this.levels.startX << 1
    this.m_iI = this.levels.startY << 1
  }

  _dovI() {
    return this.levels.points[this.levels.m_forI][0] << 1
  }

  _intvI() {
    return this.levels.points[this.levels.m_gotoI][0] << 1
  }

  _newvI() {
    return this.levels.startX << 1
  }

  _avI() {
    return this.levels.startY << 1
  }

  _aII(j: number) {
    return this.levels._doII(Number(BigInt(j) >> 1n))
  }

  load(l1: Level) {
    try {
      this.m_longI = 0x80000000
      this.levels = l1
      let j = this.levels.pointsCount
      if (this.m_saaI == null || this.m_daI < j) {
        this.m_saaI = null
        // System.gc();
        this.m_daI = j >= 100 ? j : 100
        this.m_saaI = []
      }
      this.m_eaI = 0
      this.m_faI = 0
      this.m_aI = l1.points[this.m_eaI][0]
      this.m_kI = l1.points[this.m_faI][0]
      for (let k = 0; k < j; k++) {
        let i1 = l1.points[(k + 1) % j][0] - l1.points[k][0]
        let j1 = l1.points[(k + 1) % j][1] - l1.points[k][1]
        if (k != 0 && k != j - 1)
          this.m_longI =
            this.m_longI >= l1.points[k][0] ? this.m_longI : l1.points[k][0]
        let k1 = -j1
        let i2 = i1
        let j2 = Physics._doIII(k1, i2)
        this.m_saaI[k] ??= []
        // Use BigInt for 64-bit math to match Java's (long << 32) / int >> 16
        if (j2 !== 0) {
          this.m_saaI[k][0] = Number(((BigInt(k1) << 32n) / BigInt(j2)) >> 16n)
          this.m_saaI[k][1] = Number(((BigInt(i2) << 32n) / BigInt(j2)) >> 16n)
        } else {
          this.m_saaI[k][0] = 0
          this.m_saaI[k][1] = 0
        }
        if (this.levels.m_gotoI == 0 && l1.points[k][0] > this.levels.startX)
          this.levels.m_gotoI = k + 1
        if (this.levels.m_forI == 0 && l1.points[k][0] > this.levels.finishX)
          this.levels.m_forI = k
      }

      this.m_eaI = 0
      this.m_faI = 0
      this.m_aI = 0
      this.m_kI = 0
    } catch (e) {
      console.log(e)
    }
  }

  _ifIIV(j: number, k: number) {
    this.levels._ifIIV(j, k)
  }

  _aiIV(j: GameView, k: number, i1: number) {
    if (j != null) {
      j.setColor(0, 170, 0)
      k = Number(BigInt(k) >> 1n)
      i1 = Number(BigInt(i1) >> 1n)
      this.levels._aiIV(j, k, i1)
    }
  }

  _aiV(j: GameView) {
    j.setColor(0, 255, 0)
    this.levels._aiV(j)
  }

  _aIIV(j: number, k: number, i1: number) {
    this.levels._aIIV2(
      Number((BigInt(j) + 0x18000n) >> 1n),
      Number((BigInt(k) - 0x18000n) >> 1n),
      Number(BigInt(i1) >> 1n)
    )
    k = Number(BigInt(k) >> 1n)
    j = Number(BigInt(j) >> 1n)
    this.m_faI =
      this.m_faI >= this.levels.pointsCount - 1
        ? this.levels.pointsCount - 1
        : this.m_faI
    this.m_eaI = this.m_eaI >= 0 ? this.m_eaI : 0
    if (k > this.m_kI)
      while (
        this.m_faI < this.levels.pointsCount - 1 &&
        k > this.levels.points[++this.m_faI][0]
      );
    else if (j < this.m_aI) {
      while (this.m_eaI > 0 && j < this.levels.points[--this.m_eaI][0]);
    } else {
      while (
        this.m_eaI < this.levels.pointsCount &&
        j > this.levels.points[++this.m_eaI][0]
      );
      if (this.m_eaI > 0) this.m_eaI--
      while (this.m_faI > 0 && k < this.levels.points[--this.m_faI][0]);
      this.m_faI =
        this.m_faI + 1 >= this.levels.pointsCount - 1
          ? this.levels.pointsCount - 1
          : this.m_faI + 1
    }
    this.m_aI = this.levels.points[this.m_eaI][0]
    this.m_kI = this.levels.points[this.m_faI][0]
  }

  _anvI(n1: SimpleMenuElement, j: number) {
    let k3 = 0
    let byte1 = 2
    let l3 = Number(BigInt(n1.x) >> 1n)
    let i4 = Number(BigInt(n1.y) >> 1n)
    if (this.perspectiveEnabled) i4 -= 0x10000
    let j4 = 0
    let k4 = 0
    for (let l4 = this.m_eaI; l4 < this.m_faI; l4++) {
      let k = this.levels.points[l4][0]
      let i1 = this.levels.points[l4][1]
      let j1 = this.levels.points[l4 + 1][0]
      let k1
      let _tmp = (k1 = this.levels.points[l4 + 1][1]) < i1 ? i1 : k1
      if (l3 - this.m_haI[j] > j1 || l3 + this.m_haI[j] < k) continue
      let l1 = k - j1
      let i2 = i1 - k1
      let j2 =
        Number((BigInt(l1) * BigInt(l1)) >> 16n) +
        Number((BigInt(i2) * BigInt(i2)) >> 16n)
      let k2 =
        Number((BigInt(l3 - k) * BigInt(-l1)) >> 16n) +
        Number((BigInt(i4 - i1) * BigInt(-i2)) >> 16n)
      let l2
      if ((j2 >= 0 ? j2 : -j2) >= 3)
        l2 = Number(((BigInt(k2) << 32n) / BigInt(j2)) >> 16n)
      else l2 = (k2 <= 0 ? -1 : 1) * (j2 <= 0 ? -1 : 1) * 0x7fffffff
      if (l2 < 0) l2 = 0
      if (l2 > 0x10000) l2 = 0x10000
      let i3 = k + Number((BigInt(l2) * BigInt(-l1)) >> 16n)
      let j3 = i1 + Number((BigInt(l2) * BigInt(-i2)) >> 16n)
      l1 = l3 - i3
      i2 = i4 - j3
      let byte0: number
      let l5
      if (
        (l5 =
          Number((BigInt(l1) * BigInt(l1)) >> 16n) +
          Number((BigInt(i2) * BigInt(i2)) >> 16n)) < this.m_haI[j]
      ) {
        if (l5 >= this.m_vaI[j]) byte0 = 1
        else byte0 = 0
      } else {
        byte0 = 2
      }
      if (byte0 == 0) {
        this.m_eI = this.m_saaI![l4][0]
        this.m_dI = this.m_saaI![l4][1]
        return 1
      }
      if (
        byte0 != 1 ||
        Number((BigInt(this.m_saaI![l4][0]) * BigInt(n1.m_eI)) >> 16n) +
          Number((BigInt(this.m_saaI![l4][1]) * BigInt(n1.m_dI)) >> 16n) >=
          0
      )
        continue
      k3++
      byte1 = 1
      if (k3 === 1) {
        j4 = this.m_saaI![l4][0]
        k4 = this.m_saaI![l4][1]
      } else {
        j4 += this.m_saaI![l4][0]
        k4 += this.m_saaI![l4][1]
      }
    }

    if (byte1 === 1) {
      const dot =
        Number((BigInt(j4) * BigInt(n1.m_eI)) >> 16n) +
        Number((BigInt(k4) * BigInt(n1.m_dI)) >> 16n)
      if (dot >= 0) return 2
      this.m_eI = j4
      this.m_dI = k4
    }
    return byte1
  }

  isShadowsEnabled() {
    return this.shadowsEnabled
  }

  isPerspectiveEnabled() {
    return this.perspectiveEnabled
  }

  public setPerspectiveEnabled(enabled: boolean) {
    this.perspectiveEnabled = enabled
  }

  public setShadowsEnabled(enabled: boolean) {
    this.shadowsEnabled = enabled
  }
}
