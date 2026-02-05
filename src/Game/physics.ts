import { Activity } from "../activity"
import { init2Array, initArray } from "../helpers"
import { Loader } from "../Levels/loader"
import { SimpleMenuElement } from "../Menu/simpleMenuElement"
import { FPMath } from "./fpMath"
import { GameView } from "./gameview"
import { k } from "./k"

export class Physics {
  /*public static final int m_agI = 1
	//public static final int m_byteI
	public static final int m_ahI = 1
	public static final int m_LI = 2
	public static final int m_uI = 3
	//public static final int m_aI
	public static final int m_VI = 1
	public static final int m_BI = 2
	public static final int m_acI = 3
	public static final int m_newI = 4
	public static final int m_ZI = 5 */
  public static m_YI: number
  public static m_voidI: number
  public static m_gI: number
  public static m_fI: number
  public static m_eI: number
  public static m_aeI: number
  public static m_adI: number
  public static m_yI: number = 0
  public static m_qI: number = 0
  public static m_xI: number = 0
  public static m_foraI: number[] = [0x1c000, 0x10000, 32768]
  public static m_PI: number
  public static m_jI: number
  public static m_QI: number
  public static m_charI: number
  public static m_abI: number
  public static m_WI: number
  public static m_AI: number
  public static m_longI: number
  public static m_hI: number = 0
  // private final int m_pI = 3276
  m_KaaI: number[][] = [
    [0x2cccc, -52428],
    [0x40000, 0xfffd8000],
    [0x63333, 0xffff0000],
    [0x6cccc, -39321],
    [0x39999, 39321],
    [16384, 0xfffdcccd],
    [13107, 0xfffecccd],
    [0x46666, 0x14000],
  ]
  m_ucaaI: number[][] = [
    [0x2e666, 0xfffe4ccd],
    [0x4b333, 0xfffc6667],
    [0x51999, 0xfffe4000],
    [0x60000, -58982],
    [0x40000, 0x18000],
    [0x10000, 0xfffe199a],
    [13107, 0xfffecccd],
    [0x46666, 0x14000],
  ]
  m_SaaI: number[][] = [
    [0x26666, 13107],
    [0x48000, -13107],
    [0x59999, 0x16666],
    [0x63333, 0x2e666],
    [0x54ccc, 0x11999],
    [39321, 0xfffe8000],
    [13107, -52428],
    [0x48000, 0x14000],
  ]
  m_wcaaI: number[][] = [
    [0x2cccc, -39321],
    [0x40000, 0xfffe0000],
    [0x60000, 0xffff0000],
    [0x70000, -39321],
    [0x48000, 6553],
    [16384, 0xfffdcccd],
    [13107, 0xfffecccd],
    [0x46666, 0x14ccc],
  ]
  m_DaaI: number[][] = [
    [0x2e666, 0xfffe999a],
    [0x3e666, 0xfffc6667],
    [0x51999, 0xfffe4000],
    [0x60000, -42598],
    [0x49999, 6553],
    [0x10000, 0xfffecccd],
    [13107, 0xfffecccd],
    [0x46666, 0x14ccc],
  ]
  m_MaaI: number[][] = [
    [0x26666, 13107],
    [0x48000, -13107],
    [0x59999, 0x19999],
    [0x63333, 0x2b333],
    [0x54ccc, 0x11999],
    [39321, 0xfffe8000],
    [13107, -52428],
    [0x46666, 0x14ccc],
  ]
  m_Hak: k[] = null!
  m_bZ: boolean
  m_zI: number
  m_elseZ: boolean
  m_UZ: boolean
  m_NZ: boolean
  m_aaan: SimpleMenuElement[]
  m_vaI: number
  m_waI: number
  m_xaI: number
  m_ian: SimpleMenuElement[] = null!
  m_cI: number
  m_lf: Loader
  m_EI: number
  m_CI: number
  m_IZ: boolean
  m_mZ: boolean
  m_TI: number
  m_kI: number
  m_vZ: boolean
  m_afZ: boolean
  m_tI: number
  m_dZ: boolean
  m_FZ: boolean
  m_XZ: boolean
  m_wZ: boolean
  m_ifZ: boolean
  m_sZ: boolean
  m_OZ: boolean
  m_rZ: boolean
  m_RZ: boolean
  m_doZ: boolean
  m_oI: number
  m_nI: number
  m_GI: number
  m_JaaI: number[][] = [[45875], [32768], [52428]]
  leftWheelUpdatingFrequency = 20 as const
  leftWheelLastUpdated = 0
  leftWheelParams: number[][]
  private static toSigned(n: number): number {
    return n > 0x7fffffff ? n - 0x100000000 : n
  }

  private static i32(n: number): number {
    return n | 0
  }

  private static mulShift16(a: number, b: number): number {
    return (Number((BigInt(a) * BigInt(b)) >> 16n) | 0)
  }

  private static divShift16(a: number, b: number): number {
    if (b === 0) return 0
    return (Number(((BigInt(a) << 32n) / BigInt(b)) >> 16n) | 0)
  }
  private fixSignedTables() {
    const tables: number[][][] = [
      this.m_KaaI,
      this.m_ucaaI,
      this.m_SaaI,
      this.m_wcaaI,
      this.m_DaaI,
      this.m_MaaI,
    ]
    for (const t of tables) {
      for (const row of t) {
        row[0] = Physics.toSigned(row[0])
        row[1] = Physics.toSigned(row[1])
      }
    }
  }

  constructor(f1: Loader) {
    this.m_vaI = 0
    this.m_waI = 1
    this.m_xaI = -1
    this.m_cI = 0
    this.m_EI = 0
    this.m_CI = 0
    this.m_IZ = false
    this.m_mZ = false
    this.m_TI = 32768
    this.m_kI = 0
    this.m_vZ = false
    this.m_bZ = false
    this.m_afZ = false
    this.m_aaan = []
    for (let j = 0; j < 6; j++) this.m_aaan[j] = new SimpleMenuElement()

    this.m_tI = 0
    this.m_zI = 0
    this.m_elseZ = false
    this.m_UZ = false
    this.m_dZ = false
    this.m_FZ = false
    this.m_XZ = false
    this.m_wZ = false
    this.m_ifZ = false
    this.m_sZ = false
    this.m_OZ = false
    this.m_rZ = false
    this.m_RZ = false
    this.m_NZ = false
    this.m_doZ = true
    this.m_oI = 0
    this.m_nI = 0
    this.m_GI = 0xa0000
    this.m_lf = f1
    this._doZV(true)
    this.m_vZ = false
    this._charvV()
    this.m_IZ = false

    this.leftWheelParams = init2Array(5, 4)

    // Ensure hex literals from decompiled Java are treated as signed 32-bit ints
    this.fixSignedTables()
  }

  static _doIII(j: number, i1: number) {
    let j1 = j >= 0 ? j : -j
    let k1: number
    let l1: number
    let i2: number
    if ((k1 = i1 >= 0 ? i1 : -i1) >= j1) {
      l1 = k1
      i2 = j1
    } else {
      l1 = j1
      i2 = k1
    }
    // Use BigInt for fixed-point math
    return Number(
      ((BigInt(64448) * BigInt(l1)) >> 16n) +
        ((BigInt(28224) * BigInt(i2)) >> 16n)
    )
    //return  (64448L *  l1 >> 16) +  (28224L *  i2 >> 16)
  }

  _bytevI() {
    if (this.m_elseZ && this.m_UZ) return 3
    if (this.m_UZ) return 1
    return !this.m_elseZ ? 0 : 2
  }

  _doIV(j: number) {
    this.m_elseZ = false
    this.m_UZ = false
    if ((j & 2) != 0) this.m_elseZ = true
    if ((j & 1) != 0) this.m_UZ = true
  }

  _byteIV(j: number) {
    this.m_zI = j
    switch (j) {
      case 1: // '\001'
      default:
        Physics.m_YI = 1310
        break
    }
    Physics.m_voidI = 0x190000
    this.setLeague(1)
    this._doZV(true)
  }

  setLeague(j: number) {
    Physics.m_hI = j
    Physics.m_gI = 45875
    Physics.m_fI = 13107
    Physics.m_eI = 39321
    Physics.m_yI = 0x140000
    Physics.m_xI = 0x40000
    Physics.m_jI = 6553
    switch (j) {
      case 3: // '\003'
        Physics.m_aeI = 32768
        Physics.m_adI = 32768
        Physics.m_PI = 0x160000
        Physics.m_QI = 0x4b00000
        Physics.m_charI = 0x360000
        Physics.m_abI = 6553
        Physics.m_WI = 26214
        Physics.m_AI = 0x10000
        Physics.m_longI = 0x140000
        Physics.m_qI = 0x14a0000
        break

      case 2: // '\002'
        Physics.m_aeI = 32768
        Physics.m_adI = 32768
        Physics.m_PI = 0x140000
        Physics.m_QI = 0x47e0000
        Physics.m_charI = 0x350000
        Physics.m_abI = 6553
        Physics.m_WI = 26214
        Physics.m_AI = 39321
        Physics.m_longI = 0x50000
        Physics.m_qI = 0x14a0000
        break

      case 1: // '\001'
        Physics.m_aeI = 32768
        Physics.m_adI = 32768
        Physics.m_PI = 0x110000
        Physics.m_QI = 0x3e80000
        Physics.m_charI = 0x320000
        Physics.m_abI = 6553
        Physics.m_WI = 26214
        Physics.m_AI = 26214
        Physics.m_longI = 0x50000
        Physics.m_qI = 0x12c0000
        break

      case 0: // '\0'
      default:
        Physics.m_aeI = 19660
        Physics.m_adI = 19660
        Physics.m_PI = 0x110000
        Physics.m_QI = 0x3200000
        Physics.m_charI = 0x320000
        Physics.m_abI = 327
        Physics.m_WI = 0
        Physics.m_AI = 32768
        Physics.m_longI = 0x50000
        Physics.m_qI = 0x12c0000
        break
    }
    this._doZV(true)
  }

  _doZV(flag: boolean) {
    this.m_tI = 0
    this._iIIV(this.m_lf._newvI(), this.m_lf._avI())
    this.m_cI = 0
    this.m_kI = 0
    this.m_IZ = false
    this.m_mZ = false
    this.m_RZ = false
    this.m_NZ = false
    this.m_vZ = false
    this.m_bZ = false
    this.m_afZ = false
    this.m_lf.levels._aIIV(
      this.m_Hak[2].m_ifan[5].x + 0x18000 - Physics.m_foraI[0],
      this.m_Hak[1].m_ifan[5].x - 0x18000 + Physics.m_foraI[0]
    )
  }

  _aZV(flag: boolean) {
    let j = (flag ? 0x10000 : 0xffff0000) << 1
    for (let i1 = 0; i1 < 6; i1++) {
      for (let j1 = 0; j1 < 6; j1++) this.m_Hak[i1].m_ifan[j1].y += j
    }
  }

  _iIIV(j: number, i1: number) {
    if (this.m_Hak === null) this.m_Hak = []
    if (this.m_ian === null) this.m_ian = []
    let l1 = 0
    let i2 = 0
    let j2 = 0
    let k2 = 0
    for (let j1 = 0; j1 < 6; j1++) {
      let l2 = 0
      switch (j1) {
        case 0:
          i2 = 1
          l1 = 0x58000
          j2 = 0
          k2 = 0
          break
        case 4:
          i2 = 1
          l1 = 0x38000
          j2 = -0x20000
          k2 = 0x30000
          break
        case 3:
          i2 = 1
          l1 = 0x38000
          j2 = 0x20000
          k2 = 0x30000
          break
        case 1:
          i2 = 0
          l1 = 0x18000
          j2 = 0x38000
          k2 = 0
          break
        case 2:
          i2 = 0
          l1 = 0x58000
          j2 = -0x38000
          k2 = 0
          l2 = 21626
          break
        case 5:
          i2 = 2
          l1 = 0x48000
          j2 = 0
          k2 = 0x50000
          break
      }
      if (this.m_Hak[j1] === null || this.m_Hak[j1] === undefined)
        this.m_Hak[j1] = new k()
      this.m_Hak[j1]._avV()
      this.m_Hak[j1].m_aI = Physics.m_foraI[i2]
      this.m_Hak[j1].m_intI = i2
      // Use BigInt for fixed-point math
      const base = Physics.i32(
        Number((0x1000000000000n / BigInt(l1)) >> 16n)
      )
      this.m_Hak[j1].m_forI = Physics.mulShift16(base, Physics.m_yI)
      this.m_Hak[j1].m_ifan[this.m_vaI].x = j + j2
      this.m_Hak[j1].m_ifan[this.m_vaI].y = i1 + k2
      this.m_Hak[j1].m_ifan[5].x = j + j2
      this.m_Hak[j1].m_ifan[5].y = i1 + k2
      this.m_Hak[j1].m_newI = l2
    }

    for (let k1 = 0; k1 < 10; k1++) {
      if (this.m_ian[k1] === null || this.m_ian[k1] === undefined)
        this.m_ian[k1] = new SimpleMenuElement()
      this.m_ian[k1].init()
      this.m_ian[k1].x = Physics.m_qI
      this.m_ian[k1].m_bI = Physics.m_xI
    }

    this.m_ian[0].y = 0x38000
    this.m_ian[1].y = 0x38000
    this.m_ian[2].y = 0x39b05
    this.m_ian[3].y = 0x39b05
    this.m_ian[4].y = 0x40000
    this.m_ian[5].y = 0x35aa6
    this.m_ian[6].y = 0x35aa6
    this.m_ian[7].y = 0x2d413
    this.m_ian[8].y = 0x2d413
    this.m_ian[9].y = 0x50000
    // Use 64-bit style fixed-point math to avoid 32-bit overflow during >> 16
    this.m_ian[5].m_bI = Number((BigInt(Physics.m_xI) * 45875n) >> 16n)
    this.m_ian[6].x = Number((6553n * BigInt(Physics.m_qI)) >> 16n)
    this.m_ian[5].x = Number((6553n * BigInt(Physics.m_qI)) >> 16n)
    this.m_ian[9].x = Number((0x11999n * BigInt(Physics.m_qI)) >> 16n)
    this.m_ian[8].x = Number((0x11999n * BigInt(Physics.m_qI)) >> 16n)
    this.m_ian[7].x = Number((0x11999n * BigInt(Physics.m_qI)) >> 16n)
  }

  _ifIIV(j: number, i1: number) {
    this.m_lf._ifIIV(j, i1)
  }

  // _nullvV
  // resets 'something' (probably inputs), called when game is restarted and inputs are reset
  _nullvV() {
    this.m_ifZ = this.m_sZ = this.m_rZ = this.m_OZ = false
  }

  _aIIV(j: number, i1: number) {
    if (!this.m_vZ) {
      this.m_ifZ = this.m_sZ = this.m_rZ = this.m_OZ = false
      if (j > 0) this.m_ifZ = true
      else if (j < 0) this.m_sZ = true
      if (i1 > 0) {
        this.m_rZ = true
        return
      }
      if (i1 < 0) this.m_OZ = true
    }
  }

  _casevV() {
    this._doZV(true)
    this.m_vZ = true
  }

  _avV() {
    this.m_vZ = false
  }

  _gotovZ() {
    return this.m_vZ
  }

  _pvV() {
    let j =
      this.m_Hak[1].m_ifan[this.m_vaI].x - this.m_Hak[2].m_ifan[this.m_vaI].x
    let i1 =
      this.m_Hak[1].m_ifan[this.m_vaI].y - this.m_Hak[2].m_ifan[this.m_vaI].y
    let j1 = Physics._doIII(j, i1)
    // Use BigInt to emulate 64-bit fixed-point division
    // let _tmp =  (( j << 32) /  j1 >> 16)
    // const tmp = Number(((BigInt(j) << 32n) / BigInt(j1)) >> 16n)
    i1 = Physics.divShift16(i1, j1)
    // let i1 =  (( i1 << 32) /  j1 >> 16)
    this.m_FZ = false
    if (i1 < 0) {
      this.m_XZ = true
      this.m_wZ = false
    } else if (i1 > 0) {
      this.m_wZ = true
      this.m_XZ = false
    }
    let flag: boolean
    if (
      ((flag =
        (this.m_Hak[2].m_ifan[this.m_vaI].y -
          this.m_Hak[0].m_ifan[this.m_vaI].y <=
        0
          ? -1
          : 1) *
          (this.m_Hak[2].m_ifan[this.m_vaI].m_eI -
            this.m_Hak[0].m_ifan[this.m_vaI].m_eI <=
          0
            ? -1
            : 1) >
        0) &&
        this.m_wZ) ||
      (!flag && this.m_XZ)
    ) {
      this.m_dZ = true
      return
    } else {
      this.m_dZ = false
      return
    }
  }

  _qvV() {
    if (!this.m_IZ) {
      let j =
        this.m_Hak[1].m_ifan[this.m_vaI].x - this.m_Hak[2].m_ifan[this.m_vaI].x
      let i1 =
        this.m_Hak[1].m_ifan[this.m_vaI].y - this.m_Hak[2].m_ifan[this.m_vaI].y
      let j1 = Physics._doIII(j, i1)
      // Use BigInt to emulate 64-bit fixed-point division
      j = Physics.divShift16(j, j1)
      // let j =  (( j << 32) /  j1 >> 16)
      i1 = Physics.divShift16(i1, j1)
      // let i1 =  (( i1 << 32) /  j1 >> 16)
      if (this.m_dZ && this.m_cI >= -Physics.m_QI)
        this.m_cI = Physics.i32(this.m_cI - Physics.m_charI)
      if (this.m_FZ) {
        this.m_cI = 0
        this.m_Hak[1].m_ifan[this.m_vaI].m_gotoI = Physics.mulShift16(
          this.m_Hak[1].m_ifan[this.m_vaI].m_gotoI,
          0x10000 - Physics.m_abI
        )
        this.m_Hak[2].m_ifan[this.m_vaI].m_gotoI = Physics.mulShift16(
          this.m_Hak[2].m_ifan[this.m_vaI].m_gotoI,
          0x10000 - Physics.m_abI
        )
        if (this.m_Hak[1].m_ifan[this.m_vaI].m_gotoI < 6553)
          this.m_Hak[1].m_ifan[this.m_vaI].m_gotoI = 0
        if (this.m_Hak[2].m_ifan[this.m_vaI].m_gotoI < 6553)
          this.m_Hak[2].m_ifan[this.m_vaI].m_gotoI = 0
      }
      // Use BigInt for fixed-point multiplications
      this.m_Hak[0].m_forI = Physics.mulShift16(11915, Physics.m_yI)
      this.m_Hak[0].m_forI = Physics.mulShift16(11915, Physics.m_yI)
      this.m_Hak[4].m_forI = Physics.mulShift16(18724, Physics.m_yI)
      this.m_Hak[3].m_forI = Physics.mulShift16(18724, Physics.m_yI)
      this.m_Hak[1].m_forI = Physics.mulShift16(43690, Physics.m_yI)
      this.m_Hak[2].m_forI = Physics.mulShift16(11915, Physics.m_yI)
      this.m_Hak[5].m_forI = Physics.mulShift16(14563, Physics.m_yI)
      if (this.m_XZ) {
        this.m_Hak[0].m_forI = Physics.mulShift16(18724, Physics.m_yI)
        this.m_Hak[4].m_forI = Physics.mulShift16(14563, Physics.m_yI)
        this.m_Hak[3].m_forI = Physics.mulShift16(18724, Physics.m_yI)
        this.m_Hak[1].m_forI = Physics.mulShift16(43690, Physics.m_yI)
        this.m_Hak[2].m_forI = Physics.mulShift16(10082, Physics.m_yI)
      } else if (this.m_wZ) {
        this.m_Hak[0].m_forI = Physics.mulShift16(18724, Physics.m_yI)
        this.m_Hak[4].m_forI = Physics.mulShift16(18724, Physics.m_yI)
        this.m_Hak[3].m_forI = Physics.mulShift16(14563, Physics.m_yI)
        this.m_Hak[1].m_forI = Physics.mulShift16(26214, Physics.m_yI)
        this.m_Hak[2].m_forI = Physics.mulShift16(11915, Physics.m_yI)
      }
      if (this.m_XZ || this.m_wZ) {
        let k1 = -i1
        let l1 = j
        if (this.m_XZ && this.m_kI > -Physics.m_longI) {
          let i2 = 0x10000
          if (this.m_kI < 0)
            i2 = Physics.divShift16(
              Physics.m_longI - (this.m_kI >= 0 ? this.m_kI : -this.m_kI),
              Physics.m_longI
            )
          let k2 = Physics.mulShift16(Physics.m_AI, i2)
          let i3 = Physics.mulShift16(k1, k2)
          let k3 = Physics.mulShift16(l1, k2)
          let i4 = Physics.mulShift16(j, k2)
          let k4 = Physics.mulShift16(i1, k2)
          if (this.m_TI > 32768)
            this.m_TI = this.m_TI - 1638 >= 0 ? this.m_TI - 1638 : 0
          else this.m_TI = this.m_TI - 3276 >= 0 ? this.m_TI - 3276 : 0
          this.m_Hak[4].m_ifan[this.m_vaI].m_eI = Physics.i32(
            this.m_Hak[4].m_ifan[this.m_vaI].m_eI - i3
          )
          this.m_Hak[4].m_ifan[this.m_vaI].m_dI = Physics.i32(
            this.m_Hak[4].m_ifan[this.m_vaI].m_dI - k3
          )
          this.m_Hak[3].m_ifan[this.m_vaI].m_eI = Physics.i32(
            this.m_Hak[3].m_ifan[this.m_vaI].m_eI + i3
          )
          this.m_Hak[3].m_ifan[this.m_vaI].m_dI = Physics.i32(
            this.m_Hak[3].m_ifan[this.m_vaI].m_dI + k3
          )
          this.m_Hak[5].m_ifan[this.m_vaI].m_eI = Physics.i32(
            this.m_Hak[5].m_ifan[this.m_vaI].m_eI - i4
          )
          this.m_Hak[5].m_ifan[this.m_vaI].m_dI = Physics.i32(
            this.m_Hak[5].m_ifan[this.m_vaI].m_dI - k4
          )
        }
        if (this.m_wZ && this.m_kI < Physics.m_longI) {
          let j2 = 0x10000
          if (this.m_kI > 0)
            j2 = Physics.divShift16(Physics.m_longI - this.m_kI, Physics.m_longI)
          let l2 = Physics.mulShift16(Physics.m_AI, j2)
          let j3 = Physics.mulShift16(k1, l2)
          let l3 = Physics.mulShift16(l1, l2)
          let j4 = Physics.mulShift16(j, l2)
          let l4 = Physics.mulShift16(i1, l2)
          if (this.m_TI > 32768)
            this.m_TI = this.m_TI + 1638 >= 0x10000 ? 0x10000 : this.m_TI + 1638
          else
            this.m_TI = this.m_TI + 3276 >= 0x10000 ? 0x10000 : this.m_TI + 3276
          this.m_Hak[4].m_ifan[this.m_vaI].m_eI = Physics.i32(
            this.m_Hak[4].m_ifan[this.m_vaI].m_eI + j3
          )
          this.m_Hak[4].m_ifan[this.m_vaI].m_dI = Physics.i32(
            this.m_Hak[4].m_ifan[this.m_vaI].m_dI + l3
          )
          this.m_Hak[3].m_ifan[this.m_vaI].m_eI = Physics.i32(
            this.m_Hak[3].m_ifan[this.m_vaI].m_eI - j3
          )
          this.m_Hak[3].m_ifan[this.m_vaI].m_dI = Physics.i32(
            this.m_Hak[3].m_ifan[this.m_vaI].m_dI - l3
          )
          this.m_Hak[5].m_ifan[this.m_vaI].m_eI = Physics.i32(
            this.m_Hak[5].m_ifan[this.m_vaI].m_eI + j4
          )
          this.m_Hak[5].m_ifan[this.m_vaI].m_dI = Physics.i32(
            this.m_Hak[5].m_ifan[this.m_vaI].m_dI + l4
          )
        }
        return
      }
      if (this.m_TI < 26214) {
        this.m_TI += 3276
        return
      }
      if (this.m_TI > 39321) {
        this.m_TI -= 3276
        return
      }
      this.m_TI = 32768
    }
  }

  _dovI(): number {
    // console.log(
    //   this.m_Hak[1].m_ifan[this.m_vaI].x,
    //   this.m_Hak[1].m_ifan[this.m_vaI].y
    // ) position of a bike
    this.m_dZ = this.m_ifZ
    this.m_FZ = this.m_sZ
    this.m_XZ = this.m_OZ
    this.m_wZ = this.m_rZ
    if (this.m_vZ) this._pvV()
    GameView._dovV()
    this._qvV()
    let j: number
    if ((j = this._uII(Physics.m_YI)) == 5 || this.m_mZ) return 5
    if (this.m_IZ) return 3
    if (this._newvZ()) {
      this.m_NZ = false
      return 4
    } else {
      return j
    }
  }

  _newvZ() {
    return this.m_Hak[1].m_ifan[this.m_vaI].x < this.m_lf._intvI()
  }

  _longvZ() {
    return (
      this.m_Hak[1].m_ifan[this.m_waI].x > this.m_lf._dovI() ||
      this.m_Hak[2].m_ifan[this.m_waI].x > this.m_lf._dovI()
    )
  }

  _uII(j: number): number {
    let flag = this.m_RZ
    let i1 = 0
    let j1 = j
    let j2: number
    do {
      if (i1 >= j) break
      this._aaIV(j1 - i1)
      let k1: number
      if (!flag && this._longvZ()) k1 = 3
      else k1 = this._baII(this.m_waI)
      if (!flag && this.m_RZ) return k1 == 3 ? 1 : 2
      if (k1 == 0) {
        if (
          (Number((j1 = Number(BigInt(i1 + j1) >> 1n))) - i1 >= 0
            ? j1 - i1
            : -(j1 - i1)) < 65
        )
          return 5
      } else if (k1 == 3) {
        this.m_RZ = true
        j1 = Number(BigInt(i1 + j1) >> 1n)
      } else {
        let i2: number
        if (k1 == 1)
          do {
            this._caIV(this.m_waI)
            j2 = this._baII(this.m_waI)
            i2 = j2
            if (j2 == 0) return 5
          } while (i2 != 2)
        i1 = j1
        j1 = j
        this.m_vaI = this.m_vaI != 1 ? 1 : 0
        this.m_waI = this.m_waI != 1 ? 1 : 0
      }
    } while (true)
    // Compute squared distance between wheel anchors using 64-bit fixed math
    const dx =
      this.m_Hak[1].m_ifan[this.m_vaI].x - this.m_Hak[2].m_ifan[this.m_vaI].x
    const dy =
      this.m_Hak[1].m_ifan[this.m_vaI].y - this.m_Hak[2].m_ifan[this.m_vaI].y
    const dx2 = Number((BigInt(dx) * BigInt(dx)) >> 16n)
    const dy2 = Number((BigInt(dy) * BigInt(dy)) >> 16n)
    const l1 = Physics.i32(dx2 + dy2)
    if (l1 < 0xf0000) this.m_IZ = true
    if (l1 > 0x460000) this.m_IZ = true
    return 0
  }

  _aIV(j: number) {
    for (let i1 = 0; i1 < 6; i1++) {
      let k1: k
      let n1: SimpleMenuElement
      ;(n1 = (k1 = this.m_Hak[i1]).m_ifan[j]).m_nullI = 0
      n1.m_longI = 0
      n1.m_fI = 0
      n1.m_longI = Physics.i32(
        n1.m_longI - Physics.divShift16(Physics.m_voidI, k1.m_forI)
      )
    }

    if (!this.m_IZ) {
      this._akkV(this.m_Hak[0], this.m_ian[1], this.m_Hak[2], j, 0x10000)
      this._akkV(this.m_Hak[0], this.m_ian[0], this.m_Hak[1], j, 0x10000)
      this._akkV(this.m_Hak[2], this.m_ian[6], this.m_Hak[4], j, 0x20000)
      this._akkV(this.m_Hak[1], this.m_ian[5], this.m_Hak[3], j, 0x20000)
    }
    this._akkV(this.m_Hak[0], this.m_ian[2], this.m_Hak[3], j, 0x10000)
    this._akkV(this.m_Hak[0], this.m_ian[3], this.m_Hak[4], j, 0x10000)
    this._akkV(this.m_Hak[3], this.m_ian[4], this.m_Hak[4], j, 0x10000)
    this._akkV(this.m_Hak[5], this.m_ian[8], this.m_Hak[3], j, 0x10000)
    this._akkV(this.m_Hak[5], this.m_ian[7], this.m_Hak[4], j, 0x10000)
    this._akkV(this.m_Hak[5], this.m_ian[9], this.m_Hak[0], j, 0x10000)
    let n2 = this.m_Hak[2].m_ifan[j]
    this.m_cI = Physics.mulShift16(this.m_cI, 0x10000 - Physics.m_jI)
    n2.m_fI = this.m_cI
    if (n2.m_gotoI > Physics.m_PI) n2.m_gotoI = Physics.m_PI
    if (n2.m_gotoI < -Physics.m_PI) n2.m_gotoI = -Physics.m_PI
    let j1 = 0
    let l1 = 0
    for (let i2 = 0; i2 < 6; i2++) {
      j1 = Physics.i32(j1 + this.m_Hak[i2].m_ifan[j].m_eI)
      l1 = Physics.i32(l1 + this.m_Hak[i2].m_ifan[j].m_dI)
    }

    j1 = Physics.divShift16(j1, 0x60000)
    l1 = Physics.divShift16(l1, 0x60000)
    let j3 = 0
    for (let k3 = 0; k3 < 6; k3++) {
      let j2 = this.m_Hak[k3].m_ifan[j].m_eI - j1
      let k2 = this.m_Hak[k3].m_ifan[j].m_dI - l1
      if ((j3 = Physics._doIII(j2, k2)) > 0x1e0000) {
        let l2 = Physics.divShift16(j2, j3)
        let i3 = Physics.divShift16(k2, j3)
        this.m_Hak[k3].m_ifan[j].m_eI = Physics.i32(
          this.m_Hak[k3].m_ifan[j].m_eI - l2
        )
        this.m_Hak[k3].m_ifan[j].m_dI = Physics.i32(
          this.m_Hak[k3].m_ifan[j].m_dI - i3
        )
      }
    }

    let byte0 =
      this.m_Hak[2].m_ifan[j].y - this.m_Hak[0].m_ifan[j].y < 0 ? -1 : 1
    let byte1 =
      this.m_Hak[2].m_ifan[j].m_eI - this.m_Hak[0].m_ifan[j].m_eI < 0 ? -1 : 1
    if (byte0 * byte1 > 0) {
      this.m_kI = j3
      return
    } else {
      this.m_kI = -j3
      return
    }
  }

  _akkV(k1: k, n1: SimpleMenuElement, k2: k, j: number, i1: number) {
    let n2 = k1.m_ifan[j]
    let n3 = k2.m_ifan[j]
    let j1 = n2.x - n3.x
    let l1 = n2.y - n3.y
    let i2
    if (((i2 = Physics._doIII(j1, l1)) >= 0 ? i2 : -i2) >= 3) {
      // Use BigInt for fixed-point math
      const j1b = Number(((BigInt(j1) << 32n) / BigInt(i2)) >> 16n) | 0
      const l1b = Number(((BigInt(l1) << 32n) / BigInt(i2)) >> 16n) | 0
      let j2 = (i2 - n1.y) | 0
      const j2nx = Physics.mulShift16(j2, n1.x)
      let l2 = Number((BigInt(j1b) * BigInt(j2nx)) >> 16n) | 0
      let i3 = Number((BigInt(l1b) * BigInt(j2nx)) >> 16n) | 0
      let j3 = (n2.m_eI - n3.m_eI) | 0
      let k3 = (n2.m_dI - n3.m_dI) | 0
      // Project relative velocity along the constraint axis (match Java int overflow)
      const proj = Physics.i32(
        Physics.mulShift16(j1b, j3) + Physics.mulShift16(l1b, k3)
      )
      let l3 = Physics.mulShift16(proj, n1.m_bI)
      l2 = (l2 + Number((BigInt(j1b) * BigInt(l3)) >> 16n)) | 0
      i3 = (i3 + Number((BigInt(l1b) * BigInt(l3)) >> 16n)) | 0
      l2 = Number((BigInt(l2) * BigInt(i1)) >> 16n) | 0
      i3 = Number((BigInt(i3) * BigInt(i1)) >> 16n) | 0
      n2.m_nullI -= l2
      n2.m_longI -= i3
      n3.m_nullI += l2
      n3.m_longI += i3
    }
  }

  _aIIV2(j: number, i1: number, j1: number) {
    for (let l1 = 0; l1 < 6; l1++) {
      let n1 = this.m_Hak[l1].m_ifan[j]
      let n2: SimpleMenuElement
      ;(n2 = this.m_Hak[l1].m_ifan[i1]).x = Physics.mulShift16(n1.m_eI, j1)
      n2.y = Physics.mulShift16(n1.m_dI, j1)
      let k1 = Physics.mulShift16(j1, this.m_Hak[l1].m_forI)
      n2.m_eI = Physics.mulShift16(n1.m_nullI, k1)
      n2.m_dI = Physics.mulShift16(n1.m_longI, k1)
    }
  }

  _zIIV(j: number, i1: number, j1: number) {
    for (let k1 = 0; k1 < 6; k1++) {
      let n1 = this.m_Hak[k1].m_ifan[j]
      let n2 = this.m_Hak[k1].m_ifan[i1]
      let n3 = this.m_Hak[k1].m_ifan[j1]
      n1.x = Physics.i32(n2.x + (n3.x >> 1))
      n1.y = Physics.i32(n2.y + (n3.y >> 1))
      n1.m_eI = Physics.i32(n2.m_eI + (n3.m_eI >> 1))
      n1.m_dI = Physics.i32(n2.m_dI + (n3.m_dI >> 1))
    }
  }

  _aaIV(j: number) {
    this._aIV(this.m_vaI)
    this._aIIV2(this.m_vaI, 2, j)
    this._zIIV(4, this.m_vaI, 2)
    this._aIV(4)
    this._aIIV2(4, 3, Number(BigInt(j) >> 1n))
    this._zIIV(4, this.m_vaI, 3)
    this._zIIV(this.m_waI, this.m_vaI, 2)
    this._zIIV(this.m_waI, this.m_waI, 3)

    for (let i1 = 1; i1 <= 2; i1++) {
      let n1 = this.m_Hak[i1].m_ifan[this.m_vaI]
      let n2: SimpleMenuElement
      ;(n2 = this.m_Hak[i1].m_ifan[this.m_waI]).m_bI = Physics.i32(
        n1.m_bI + Physics.mulShift16(j, n1.m_gotoI)
      )
      const tmp = Physics.mulShift16(this.m_Hak[i1].m_newI, n1.m_fI)
      n2.m_gotoI = Physics.i32(n1.m_gotoI + Physics.mulShift16(j, tmp))
    }
  }

  _baII(j: number) {
    let byte0 = 2
    let i1: number
    i1 =
      (i1 =
        this.m_Hak[1].m_ifan[j].x >= this.m_Hak[2].m_ifan[j].x
          ? this.m_Hak[1].m_ifan[j].x
          : this.m_Hak[2].m_ifan[j].x) >= this.m_Hak[5].m_ifan[j].x
        ? i1
        : this.m_Hak[5].m_ifan[j].x
    let j1: number
    j1 =
      (j1 =
        this.m_Hak[1].m_ifan[j].x >= this.m_Hak[2].m_ifan[j].x
          ? this.m_Hak[2].m_ifan[j].x
          : this.m_Hak[1].m_ifan[j].x) >= this.m_Hak[5].m_ifan[j].x
        ? /* dexie */ this.m_Hak[5].m_ifan[j].x
        : j1
    this.m_lf._aIIV(
      j1 - Physics.m_foraI[0],
      i1 + Physics.m_foraI[0],
      this.m_Hak[5].m_ifan[j].y
    )
    let k1 = this.m_Hak[1].m_ifan[j].x - this.m_Hak[2].m_ifan[j].x
    let l1 = this.m_Hak[1].m_ifan[j].y - this.m_Hak[2].m_ifan[j].y
    let i2 = Physics._doIII(k1, l1)
    k1 = Physics.divShift16(k1, i2)
    let j2 = -Physics.divShift16(l1, i2)
    let k2 = k1
    for (let l2 = 0; l2 < 6; l2++) {
      if (l2 == 4 || l2 == 3) continue
      let n1 = this.m_Hak[l2].m_ifan[j]
      if (l2 == 0) {
        n1.x = Physics.i32(n1.x + j2)
        n1.y = Physics.i32(n1.y + k2)
      }
      let i3 = this.m_lf._anvI(n1, this.m_Hak[l2].m_intI)
      if (l2 == 0) {
        n1.x = Physics.i32(n1.x - j2)
        n1.y = Physics.i32(n1.y - k2)
      }
      this.m_EI = this.m_lf.m_eI
      this.m_CI = this.m_lf.m_dI
      if (l2 == 5 && i3 != 2) this.m_mZ = true
      if (l2 == 1 && i3 != 2) this.m_NZ = true
      if (i3 == 1) {
        this.m_xaI = l2
        byte0 = 1
        continue
      }
      if (i3 != 0) continue
      this.m_xaI = l2
      byte0 = 0
      break
    }

    return byte0
  }

  _caIV(j: number) {
    let k1: k
    let n1: SimpleMenuElement
    ;(n1 = (k1 = this.m_Hak[this.m_xaI]).m_ifan[j]).x = Physics.i32(
      n1.x + Physics.mulShift16(this.m_EI, 3276)
    )
    n1.y = Physics.i32(n1.y + Physics.mulShift16(this.m_CI, 3276))
    let i1: number
    let j1: number
    let l1: number
    let i2: number
    let j2: number
    if (
      this.m_FZ &&
      (this.m_xaI == 2 || this.m_xaI == 1) &&
      n1.m_gotoI < 6553
    ) {
      i1 = Physics.m_gI - Physics.m_WI
      j1 = 13107
      l1 = 39321
      i2 = 26214 - Physics.m_WI
      j2 = 26214 - Physics.m_WI
    } else {
      i1 = Physics.m_gI
      j1 = Physics.m_fI
      l1 = Physics.m_eI
      i2 = Physics.m_aeI
      j2 = Physics.m_adI
    }
    let k2 = Physics._doIII(this.m_EI, this.m_CI)
    this.m_EI = Physics.divShift16(this.m_EI, k2)
    this.m_CI = Physics.divShift16(this.m_CI, k2)
    let l2: number = n1.m_eI
    let i3: number = n1.m_dI
    let j3: number = -(
      Physics.mulShift16(l2, this.m_EI) + Physics.mulShift16(i3, this.m_CI)
    )
    let k3: number = -(
      Physics.mulShift16(l2, -this.m_CI) + Physics.mulShift16(i3, this.m_EI)
    )
    const tmp1 = Physics.divShift16(k3, k1.m_aI)
    let l3: number =
      Physics.mulShift16(i1, n1.m_gotoI) - Physics.mulShift16(j1, tmp1)
    const tmp2 = Physics.mulShift16(n1.m_gotoI, k1.m_aI)
    let i4: number =
      Physics.mulShift16(i2, k3) - Physics.mulShift16(l1, tmp2)
    let j4: number = -Physics.mulShift16(j2, j3)
    let k4: number = Physics.mulShift16(-i4, -this.m_CI)
    let l4: number = Physics.mulShift16(-i4, this.m_EI)
    let i5: number = Physics.mulShift16(-j4, this.m_EI)
    let j5: number = Physics.mulShift16(-j4, this.m_CI)
    n1.m_gotoI = l3 | 0
    n1.m_eI = (k4 + i5) | 0
    n1.m_dI = (l4 + j5) | 0
  }

  _ifZV(flag: boolean) {
    this.m_doZ = flag
  }

  _caseIV(j: number) {
    // Simplify: ((0xa0000 * (j << 16)) >> 16) == 0xa0000 * j
    this.m_GI = Number(
      (((BigInt(0xa0000) * BigInt(j)) << 32n) / 0x800000n) >> 16n
    )
  }

  _elsevI() {
    if (this.m_doZ)
      this.m_oI =
        Number(((BigInt(this.m_aaan[0].m_eI) << 32n) / 0x180000n) >> 16n) +
        Number((BigInt(this.m_oI) * 57344n) >> 16n)
    else this.m_oI = 0
    this.m_oI = this.m_oI >= this.m_GI ? this.m_GI : this.m_oI
    this.m_oI = this.m_oI >= -this.m_GI ? this.m_oI : -this.m_GI
    return Number((BigInt(this.m_aaan[0].x + this.m_oI) << 2n) >> 16n)
  }

  _ifvI() {
    if (this.m_doZ)
      this.m_nI =
        Number(((BigInt(this.m_aaan[0].m_dI) << 32n) / 0x180000n) >> 16n) +
        Number((BigInt(this.m_nI) * 57344n) >> 16n)
    else this.m_nI = 0
    this.m_nI = this.m_nI >= this.m_GI ? this.m_GI : this.m_nI
    this.m_nI = this.m_nI >= -this.m_GI ? this.m_nI : -this.m_GI
    return Number((BigInt(this.m_aaan[0].y + this.m_nI) << 2n) >> 16n)
  }

  _tryvI() {
    let j =
      this.m_aaan[1].x >= this.m_aaan[2].x ? this.m_aaan[1].x : this.m_aaan[2].x
    if (this.m_IZ) return this.m_lf._aII(this.m_aaan[0].x)
    else return this.m_lf._aII(j)
  }

  _charvV() {
    // synchronized (m_Hak) {
    for (let j = 0; j < 6; j++) {
      this.m_Hak[j].m_ifan[5].x = this.m_Hak[j].m_ifan[this.m_vaI].x
      this.m_Hak[j].m_ifan[5].y = this.m_Hak[j].m_ifan[this.m_vaI].y
      this.m_Hak[j].m_ifan[5].m_bI = this.m_Hak[j].m_ifan[this.m_vaI].m_bI
    }
    // }

    this.m_Hak[0].m_ifan[5].m_eI = this.m_Hak[0].m_ifan[this.m_vaI].m_eI
    this.m_Hak[0].m_ifan[5].m_dI = this.m_Hak[0].m_ifan[this.m_vaI].m_dI
    this.m_Hak[2].m_ifan[5].m_gotoI = this.m_Hak[2].m_ifan[this.m_vaI].m_gotoI
  }

  _voidvV() {
    // synchronized (m_Hak) {
    for (let j = 0; j < 6; j++) {
      this.m_aaan[j].x = this.m_Hak[j].m_ifan[5].x
      this.m_aaan[j].y = this.m_Hak[j].m_ifan[5].y
      this.m_aaan[j].m_bI = this.m_Hak[j].m_ifan[5].m_bI
    }
    // }

    this.m_aaan[0].m_eI = this.m_Hak[0].m_ifan[5].m_eI
    this.m_aaan[0].m_dI = this.m_Hak[0].m_ifan[5].m_dI
    this.m_aaan[2].m_gotoI = this.m_Hak[2].m_ifan[5].m_gotoI
  }

  _aiIV(view: GameView, i1: number, j1: number) {
    let k1 = FPMath._ifIII(
      this.m_aaan[0].x - this.m_aaan[3].x,
      this.m_aaan[0].y - this.m_aaan[3].y
    )
    let l1 = FPMath._ifIII(
      this.m_aaan[0].x - this.m_aaan[4].x,
      this.m_aaan[0].y - this.m_aaan[4].y
    )
    let engineX =
      Number(BigInt(this.m_aaan[0].x) >> 1n) +
      Number(BigInt(this.m_aaan[3].x) >> 1n)
    let engineY =
      Number(BigInt(this.m_aaan[0].y) >> 1n) +
      Number(BigInt(this.m_aaan[3].y) >> 1n)
    let fenderX =
      Number(BigInt(this.m_aaan[0].x) >> 1n) +
      Number(BigInt(this.m_aaan[4].x) >> 1n)
    let fenderY =
      Number(BigInt(this.m_aaan[0].y) >> 1n) +
      Number(BigInt(this.m_aaan[4].y) >> 1n)
    let i3 = -j1
    let j3 = i1
    engineX +=
      Number((BigInt(i3) * 0x10000n) >> 16n) -
      Number((BigInt(i1) * 32768n) >> 16n)
    engineY +=
      Number((BigInt(j3) * 0x10000n) >> 16n) -
      Number((BigInt(j1) * 32768n) >> 16n)
    fenderX +=
      Number((BigInt(i3) * 0x10000n) >> 16n) -
      Number((BigInt(i1) * 0x1ccccn) >> 16n)
    fenderY +=
      Number((BigInt(j3) * 0x10000n) >> 16n) -
      Number((BigInt(j1) * 0x20000n) >> 16n)
    view.drawFender(
      Number((BigInt(fenderX) << 2n) >> 16n),
      Number((BigInt(fenderY) << 2n) >> 16n),
      l1
    )
    view.drawEngine(
      Number((BigInt(engineX) << 2n) >> 16n),
      Number((BigInt(engineY) << 2n) >> 16n),
      k1
    )
  }

  _laiV(view: GameView) {
    view.setColor(128, 128, 128)
    view.drawLine(
      this.m_aaan[3].x,
      this.m_aaan[3].y,
      this.m_aaan[1].x,
      this.m_aaan[1].y
    )
  }

  _aiV(gameView: GameView) {
    let i1 = 1
    let j1 = 1
    switch (Physics.m_hI) {
      case 2: // '\002'
      case 3: // '\003'
        i1 = j1 = 0
        break

      case 1: // '\001'
        i1 = 0
        break
    }
    gameView.drawWheel(
      Number((BigInt(this.m_aaan[2].x) << 2n) / 0xffffn) /*>> 16*/,
      Number((BigInt(this.m_aaan[2].y) << 2n) / 0xffffn) /*>> 16*/,
      i1
    )
    gameView.drawWheel(
      Number((BigInt(this.m_aaan[1].x) << 2n) / 0xffffn) /*>> 16*/,
      Number((BigInt(this.m_aaan[1].y) << 2n) / 0xffffn) /*>> 16*/,
      j1
    )
  }

  _doiV(gameView: GameView) {
    let i1
    let j1 = Number((BigInt((i1 = this.m_Hak[1].m_aI)) * 58982n) >> 16n)
    let k1 = Number((BigInt(i1) * 45875n) >> 16n)
    gameView.setColor(0, 0, 0)
    if (Activity.getGDActivity().isMenuShown()) {
      gameView.drawLineWheel(
        Number((BigInt(this.m_aaan[1].x) << 2n) >> 16n),
        Number((BigInt(this.m_aaan[1].y) << 2n) >> 16n),
        Number((BigInt(i1 + i1) << 2n) >> 16n)
      )
      gameView.drawLineWheel(
        Number((BigInt(this.m_aaan[1].x) << 2n) >> 16n),
        Number((BigInt(this.m_aaan[1].y) << 2n) >> 16n),
        Number((BigInt(j1 + j1) << 2n) >> 16n)
      )
      gameView.drawLineWheel(
        Number((BigInt(this.m_aaan[2].x) << 2n) >> 16n),
        Number((BigInt(this.m_aaan[2].y) << 2n) >> 16n),
        Number((BigInt(i1 + i1) << 2n) >> 16n)
      )
      gameView.drawLineWheel(
        Number((BigInt(this.m_aaan[2].x) << 2n) >> 16n),
        Number((BigInt(this.m_aaan[2].y) << 2n) >> 16n),
        Number((BigInt(k1 + k1) << 2n) >> 16n)
      )
    }

    // right wheel
    let l1 = j1
    let i2 = 0
    let j2: number
    let k2 = FPMath._doII((j2 = this.m_aaan[1].m_bI))
    let l2 = FPMath.sin(j2)
    let i3 = l1
    l1 = Number(BigInt(k2 * l1) >> 16n) + Number(BigInt(-l2 * i2) >> 16n)
    i2 = Number(BigInt(l2 * i3) >> 16n) + Number(BigInt(k2 * i2) >> 16n)
    k2 = FPMath._doII((j2 = 0x141b2))
    l2 = FPMath.sin(j2)
    for (let k3 = 0; k3 < 5; k3++) {
      gameView.drawLine(
        this.m_aaan[1].x,
        this.m_aaan[1].y,
        this.m_aaan[1].x + l1,
        this.m_aaan[1].y + i2
      )
      i3 = l1
      l1 =
        Number((BigInt(k2) * BigInt(l1)) >> 16n) +
        Number((BigInt(-l2) * BigInt(i2)) >> 16n)
      i2 =
        Number((BigInt(l2) * BigInt(i3)) >> 16n) +
        Number((BigInt(k2) * BigInt(i2)) >> 16n)
    }

    // left wheel
    l1 = j1
    i2 = 0
    k2 = FPMath._doII((j2 = this.m_aaan[2].m_bI))
    l2 = FPMath.sin(j2)
    i3 = l1
    l1 =
      Number((BigInt(k2) * BigInt(l1)) >> 16n) +
      Number((BigInt(-l2) * BigInt(i2)) >> 16n)
    i2 =
      Number((BigInt(l2) * BigInt(i3)) >> 16n) +
      Number((BigInt(k2) * BigInt(i2)) >> 16n)
    k2 = FPMath._doII((j2 = 0x141b2))
    l2 = FPMath.sin(j2)

    let toUpdate: boolean = true
    for (let l3 = 0; l3 < 5; l3++) {
      if (toUpdate) {
        // Log.d("AGDTR", "toUpdate is true")
        //this.leftWheelParams[l3] ??= []
        this.leftWheelParams[l3][0] = this.m_aaan[2].x
        this.leftWheelParams[l3][1] = this.m_aaan[2].y
        this.leftWheelParams[l3][2] = this.m_aaan[2].x + l1
        this.leftWheelParams[l3][3] = this.m_aaan[2].y + i2
      }
      // gameView.drawLine(m_aaan[2].x, m_aaan[2].y, m_aaan[2].x + l1, m_aaan[2].y + i2)
      gameView.drawLine(
        this.leftWheelParams[l3][0],
        this.leftWheelParams[l3][1],
        this.leftWheelParams[l3][2],
        this.leftWheelParams[l3][3]
      )
      let j3 = l1
      l1 =
        Number((BigInt(k2) * BigInt(l1)) >> 16n) +
        Number((BigInt(-l2) * BigInt(i2)) >> 16n)
      i2 =
        Number((BigInt(l2) * BigInt(j3)) >> 16n) +
        Number((BigInt(k2) * BigInt(i2)) >> 16n)
    }
    // if (toUpdate) leftWheelLastUpdated = System.currentTimeMillis()
    // Log.d("AGDTR", "diff: " + (System.currentTimeMillis() - leftWheelLastUpdated))

    if (Physics.m_hI > 0) {
      gameView.setColor(255, 0, 0)
      if (Physics.m_hI > 2) gameView.setColor(100, 100, 255)
      gameView.drawLineWheel(
        Number((BigInt(this.m_aaan[2].x) << 2n) / 0xffffn) /*>> 16*/,
        Number((BigInt(this.m_aaan[2].y) << 2n) / 0xffffn) /*>> 16*/,
        4
      )
      gameView.drawLineWheel(
        Number((BigInt(this.m_aaan[1].x) << 2n) / 0xffffn) /*>> 16*/,
        Number((BigInt(this.m_aaan[1].y) << 2n) / 0xffffn) /*>> 16*/,
        4
      )
    }
  }

  _ifiIIV(j: GameView, i1: number, j1: number, k1: number, l1: number) {
    let i2 = 0
    let j2 = 0x10000
    let k2 = this.m_aaan[0].x
    let l2 = this.m_aaan[0].y
    let i3 = 0
    let j3 = 0
    let k3 = 0
    let l3 = 0
    let i4 = 0
    let j4 = 0
    let k4 = 0
    let l4 = 0
    let i5 = 0
    let j5 = 0
    let k5 = 0
    let l5 = 0
    let i6 = 0
    let j6 = 0
    let k6 = 0
    let l6 = 0
    let ai: number[][] | null = null
    let ai1: number[][] | null = null
    let ai2: number[][] | null = null
    if (this.m_elseZ) {
      if (this.m_TI < 32768) {
        ai1 = this.m_ucaaI
        ai2 = this.m_KaaI
        j2 = Number((BigInt(this.m_TI) * 0x20000n) >> 16n)
      } else if (this.m_TI > 32768) {
        i2 = 1
        ai1 = this.m_KaaI
        ai2 = this.m_SaaI
        j2 = Number((BigInt(this.m_TI - 32768) * 0x20000n) >> 16n)
      } else {
        ai = this.m_KaaI
      }
    } else if (this.m_TI < 32768) {
      ai1 = this.m_DaaI
      ai2 = this.m_wcaaI
      j2 = Number((BigInt(this.m_TI) * 0x20000n) >> 16n)
    } else if (this.m_TI > 32768) {
      i2 = 1
      ai1 = this.m_wcaaI
      ai2 = this.m_MaaI
      j2 = Number((BigInt(this.m_TI - 32768) * 0x20000n) >> 16n)
    } else {
      ai = this.m_wcaaI
    }
    for (let j7 = 0; j7 < this.m_KaaI.length; j7++) {
      let i8: number
      let j8: number
      if (ai1 !== null) {
        j8 =
          Number((BigInt(ai1[j7][0]) * BigInt(0x10000 - j2)) >> 16n) +
          Number((BigInt(ai2![j7][0]) * BigInt(j2)) >> 16n)
        i8 =
          Number((BigInt(ai1[j7][1]) * BigInt(0x10000 - j2)) >> 16n) +
          Number((BigInt(ai2![j7][1]) * BigInt(j2)) >> 16n)
      } else {
        j8 = ai![j7][0]
        i8 = ai![j7][1]
      }
      let k8 =
        k2 +
        Number((BigInt(k1) * BigInt(j8)) >> 16n) +
        Number((BigInt(i1) * BigInt(i8)) >> 16n)
      let l8 =
        l2 +
        Number((BigInt(l1) * BigInt(j8)) >> 16n) +
        Number((BigInt(j1) * BigInt(i8)) >> 16n)
      switch (j7) {
        case 0: // '\0'
          k4 = k8
          l4 = l8
          break

        case 1: // '\001'
          i5 = k8
          j5 = l8
          break

        case 2: // '\002'
          k5 = k8
          l5 = l8
          break

        case 3: // '\003'
          i6 = k8
          j6 = l8
          break

        case 4: // '\004'
          k6 = k8
          l6 = l8
          break

        case 5: // '\005'
          k3 = k8
          l3 = l8
          break

        case 6: // '\006'
          i4 = k8
          j4 = l8
          break

        case 7: // '\007'
          i3 = k8
          j3 = l8
          break
      }
    }

    let i7 =
      Number((BigInt(this.m_JaaI[i2][0]) * BigInt(0x10000 - j2)) >> 16n) +
      Number((BigInt(this.m_JaaI[i2 + 1][0]) * BigInt(j2)) >> 16n)
    if (this.m_elseZ) {
      j._aIIIV2(
        Number((BigInt(k3) << 2n) >> 16n),
        Number((BigInt(l3) << 2n) >> 16n),
        Number((BigInt(k4) << 2n) >> 16n),
        Number((BigInt(l4) << 2n) >> 16n),
        1
      )
      j._aIIIV2(
        Number((BigInt(k4) << 2n) >> 16n),
        Number((BigInt(l4) << 2n) >> 16n),
        Number((BigInt(i5) << 2n) >> 16n),
        Number((BigInt(j5) << 2n) >> 16n),
        1
      )
      j.drawBikerPart(
        Number((BigInt(i5) << 2n) >> 16n),
        Number((BigInt(j5) << 2n) >> 16n),
        Number((BigInt(k5) << 2n) >> 16n),
        Number((BigInt(l5) << 2n) >> 16n),
        2,
        i7
      )
      j._aIIIV2(
        Number((BigInt(k5) << 2n) >> 16n),
        Number((BigInt(l5) << 2n) >> 16n),
        Number((BigInt(k6) << 2n) >> 16n),
        Number((BigInt(l6) << 2n) >> 16n),
        0
      )
      let k7 = FPMath._ifIII(i1, j1)
      if (this.m_TI > 32768) k7 += 20588
    j.drawHelmet(
      Number((BigInt(i6) << 2n) >> 16n),
      Number((BigInt(j6) << 2n) >> 16n),
      k7
    )
    } else {
      j.setColor(0, 0, 0)
      j.drawLine(k3, l3, k4, l4)
      j.drawLine(k4, l4, i5, j5)
      j.setColor(0, 0, 128)
      j.drawLine(i5, j5, k5, l5)
      j.drawLine(k5, l5, k6, l6)
      j.drawLine(k6, l6, i3, j3)
      let l7 = 0x10000
      j.setColor(156, 0, 0)
      j.drawLineWheel(
        Number((BigInt(i6) << 2n) >> 16n),
        Number((BigInt(j6) << 2n) >> 16n),
        Number((BigInt(l7 + l7) << 2n) >> 16n)
      )
    }
    j.setColor(0, 0, 0)
    j.drawSteering(
      Number((BigInt(i3) << 2n) >> 16n),
      Number((BigInt(j3) << 2n) >> 16n)
    )
    j.drawSteering(
      Number((BigInt(i4) << 2n) >> 16n),
      Number((BigInt(j4) << 2n) >> 16n)
    )
  }

  _aiIIV(j: GameView, i1: number, j1: number, k1: number, l1: number) {
    let i2 = this.m_aaan[2].x
    let j2 = this.m_aaan[2].y
    let k2 = i2 + Number((BigInt(k1) * 32768n) >> 16n)
    let l2 = j2 + Number((BigInt(l1) * 32768n) >> 16n)
    let i3 = i2 - Number((BigInt(k1) * 32768n) >> 16n)
    let j3 = j2 - Number((BigInt(l1) * 32768n) >> 16n)
    let k3 = this.m_aaan[0].x + Number((BigInt(i1) * 32768n) >> 16n)
    let l3 = this.m_aaan[0].y + Number((BigInt(j1) * 32768n) >> 16n)
    let i4 = k3 - Number((BigInt(i1) * 0x20000n) >> 16n)
    let j4 = l3 - Number((BigInt(j1) * 0x20000n) >> 16n)
    let k4 = i4 + Number((BigInt(k1) * 0x10000n) >> 16n)
    let l4 = j4 + Number((BigInt(l1) * 0x10000n) >> 16n)
    let i5 =
      i4 +
      Number((BigInt(i1) * 49152n) >> 16n) +
      Number((BigInt(k1) * 49152n) >> 16n)
    let j5 =
      j4 +
      Number((BigInt(j1) * 49152n) >> 16n) +
      Number((BigInt(l1) * 49152n) >> 16n)
    let k5 = i4 + Number((BigInt(k1) * 32768n) >> 16n)
    let l5 = j4 + Number((BigInt(l1) * 32768n) >> 16n)
    let i6 = this.m_aaan[1].x
    let j6 = this.m_aaan[1].y
    let k6 = this.m_aaan[4].x - Number((BigInt(i1) * 49152n) >> 16n)
    let l6 = this.m_aaan[4].y - Number((BigInt(j1) * 49152n) >> 16n)
    let i7 = k6 - Number((BigInt(k1) * 32768n) >> 16n)
    let j7 = l6 - Number((BigInt(l1) * 32768n) >> 16n)
    let k7 =
      k6 -
      Number((BigInt(i1) * 0x20000n) >> 16n) +
      Number((BigInt(k1) * 16384n) >> 16n)
    let l7 =
      l6 -
      Number((BigInt(j1) * 0x20000n) >> 16n) +
      Number((BigInt(l1) * 16384n) >> 16n)
    let i8 = this.m_aaan[3].x
    let j8 = this.m_aaan[3].y
    let k8 = i8 + Number((BigInt(k1) * 32768n) >> 16n)
    let l8 = j8 + Number((BigInt(l1) * 32768n) >> 16n)
    let i9 =
      i8 +
      Number((BigInt(k1) * 0x1c000n) >> 16n) -
      Number((BigInt(i1) * 32768n) >> 16n)
    let j9 =
      j8 +
      Number((BigInt(l1) * 0x1c000n) >> 16n) -
      Number((BigInt(j1) * 32768n) >> 16n)
    j.setColor(50, 50, 50)
    j.drawLineWheel(
      Number((BigInt(k5) << 2n) >> 16n),
      Number((BigInt(l5) << 2n) >> 16n),
      Number(((32768n + 32768n) << 2n) >> 16n)
    )
    if (!this.m_IZ) {
      j.drawLine(k2, l2, k4, l4)
      j.drawLine(i3, j3, i4, j4)
    }
    j.drawLine(k3, l3, i4, j4)
    j.drawLine(k3, l3, i8, j8)
    j.drawLine(i5, j5, k8, l8)
    j.drawLine(k8, l8, i9, j9)
    if (!this.m_IZ) {
      j.drawLine(i8, j8, i6, j6)
      j.drawLine(i9, j9, i6, j6)
    }
    j.drawLine(k4, l4, i7, j7)
    j.drawLine(i5, j5, k6, l6)
    j.drawLine(k6, l6, k7, l7)
    j.drawLine(i7, j7, k7, l7)
  }

  _ifiV(j: GameView) {
    j._tryvV()
    let i1 = this.m_aaan[3].x - this.m_aaan[4].x
    let j1 = this.m_aaan[3].y - this.m_aaan[4].y
    let k1: number
    if ((k1 = Physics._doIII(i1, j1)) != 0) {
      i1 = Number(((BigInt(i1) << 32n) / BigInt(k1)) >> 16n)
      j1 = Number(((BigInt(j1) << 32n) / BigInt(k1)) >> 16n)
    }
    let l1 = -j1
    let i2 = i1
    if (this.m_IZ) {
      let k2 = this.m_aaan[4].x
      let j2: number
      if ((j2 = this.m_aaan[3].x) >= k2) {
        let l2 = j2
        j2 = k2
        k2 = l2
      }
      this.m_lf.levels._aIIV(j2, k2)
    }

    // let loader = getLevelLoader()
    // TODO
    // if (loader != null && loader.isPerspectiveEnabled())
    //this.m_lf._aiIV(j, this.m_aaan[0].x, this.m_aaan[0].y)
    if (this.m_UZ) this._aiIV(j, i1, j1)
    //if (!getGDActivity().isMenuShown()) this._aiV(j)
    this._aiV(j)
    this._doiV(j)
    if (this.m_UZ) j.setColor(170, 0, 0)
    else j.setColor(50, 50, 50)
    j._ifIIIV(
      Number((BigInt(this.m_aaan[1].x) << 2n) >> 16n),
      Number((BigInt(this.m_aaan[1].y) << 2n) >> 16n),
      Number((BigInt(Physics.m_foraI[0]) << 2n) >> 16n),
      FPMath._ifIII(i1, j1)
    )
    if (!this.m_IZ) this._laiV(j)
    this._ifiIIV(j, i1, j1, l1, i2)
    if (!this.m_UZ) this._aiIIV(j, i1, j1, l1, i2)
    this.m_lf._aiV(j)
  }
}
