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
  public static m_yI: number
  public static m_qI: number
  public static m_xI: number
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
    return ((64448 * l1) >> 16) + ((28224 * i2) >> 16)
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
        case 0: // '\0'
          i2 = 1
          l1 = 0x58000
          j2 = 0
          k2 = 0
          break

        case 4: // '\004'
          i2 = 1
          l1 = 0x38000
          j2 = 0xfffe0000
          k2 = 0x30000
          break

        case 3: // '\003'
          i2 = 1
          l1 = 0x38000
          j2 = 0x20000
          k2 = 0x30000
          break

        case 1: // '\001'
          i2 = 0
          l1 = 0x18000
          j2 = 0x38000
          k2 = 0
          break

        case 2: // '\002'
          i2 = 0
          l1 = 0x58000
          j2 = 0xfffc8000
          k2 = 0
          l2 = 21626
          break

        case 5: // '\005'
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
      this.m_Hak[j1].m_forI =
        (((0x1000000000000 / l1) >> 16) * Physics.m_yI) >> 16
      //this.m_Hak[j1].m_forI =  (  (0x1000000000000L /  l1 >> 16) *  m_yI >> 16)
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
    this.m_ian[5].m_bI = (Physics.m_xI * 45875) >> 16
    // this.m_ian[5].m_bI =  ( m_xI * 45875L >> 16)
    this.m_ian[6].x = (6553 * Physics.m_qI) >> 16
    // this.m_ian[6].x =  (6553L *  m_qI >> 16)
    this.m_ian[5].x = (6553 * Physics.m_qI) >> 16
    // this.m_ian[5].x =  (6553L *  m_qI >> 16)
    this.m_ian[9].x = (0x11999 * Physics.m_qI) >> 16
    // this.m_ian[9].x =  (0x11999L *  m_qI >> 16)
    this.m_ian[8].x = (0x11999 * Physics.m_qI) >> 16
    this.m_ian[7].x = (0x11999 * Physics.m_qI) >> 16
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
    let _tmp = ((j << 32) / j1) >> 16
    // let _tmp =  (( j << 32) /  j1 >> 16)
    i1 = ((i1 << 32) / j1) >> 16
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
      j = ((j << 32) / j1) >> 16
      // let j =  (( j << 32) /  j1 >> 16)
      i1 = ((i1 << 32) / j1) >> 16
      // let i1 =  (( i1 << 32) /  j1 >> 16)
      if (this.m_dZ && this.m_cI >= -Physics.m_QI) this.m_cI -= Physics.m_charI
      if (this.m_FZ) {
        this.m_cI = 0
        this.m_Hak[1].m_ifan[this.m_vaI].m_gotoI =
          (this.m_Hak[1].m_ifan[this.m_vaI].m_gotoI *
            (0x10000 - Physics.m_abI)) >>
          16
        this.m_Hak[2].m_ifan[this.m_vaI].m_gotoI =
          (this.m_Hak[2].m_ifan[this.m_vaI].m_gotoI *
            (0x10000 - Physics.m_abI)) >>
          16
        if (this.m_Hak[1].m_ifan[this.m_vaI].m_gotoI < 6553)
          this.m_Hak[1].m_ifan[this.m_vaI].m_gotoI = 0
        if (this.m_Hak[2].m_ifan[this.m_vaI].m_gotoI < 6553)
          this.m_Hak[2].m_ifan[this.m_vaI].m_gotoI = 0
      }
      // this.m_Hak[0].m_forI =  (11915L *  m_yI >> 16)
      this.m_Hak[0].m_forI = (11915 * Physics.m_yI) >> 16
      this.m_Hak[0].m_forI = (11915 * Physics.m_yI) >> 16
      this.m_Hak[4].m_forI = (18724 * Physics.m_yI) >> 16
      this.m_Hak[3].m_forI = (18724 * Physics.m_yI) >> 16
      this.m_Hak[1].m_forI = (43690 * Physics.m_yI) >> 16
      this.m_Hak[2].m_forI = (11915 * Physics.m_yI) >> 16
      this.m_Hak[5].m_forI = (14563 * Physics.m_yI) >> 16
      if (this.m_XZ) {
        this.m_Hak[0].m_forI = (18724 * Physics.m_yI) >> 16
        this.m_Hak[4].m_forI = (14563 * Physics.m_yI) >> 16
        this.m_Hak[3].m_forI = (18724 * Physics.m_yI) >> 16
        this.m_Hak[1].m_forI = (43690 * Physics.m_yI) >> 16
        this.m_Hak[2].m_forI = (10082 * Physics.m_yI) >> 16
      } else if (this.m_wZ) {
        this.m_Hak[0].m_forI = (18724 * Physics.m_yI) >> 16
        this.m_Hak[4].m_forI = (18724 * Physics.m_yI) >> 16
        this.m_Hak[3].m_forI = (14563 * Physics.m_yI) >> 16
        this.m_Hak[1].m_forI = (26214 * Physics.m_yI) >> 16
        this.m_Hak[2].m_forI = (11915 * Physics.m_yI) >> 16
      }
      if (this.m_XZ || this.m_wZ) {
        let k1 = -i1
        let l1 = j
        if (this.m_XZ && this.m_kI > -Physics.m_longI) {
          let i2 = 0x10000
          if (this.m_kI < 0)
            i2 =
              (((Physics.m_longI - (this.m_kI >= 0 ? this.m_kI : -this.m_kI)) <<
                32) /
                Physics.m_longI) >>
              16
          let k2 = (Physics.m_AI * i2) >> 16
          let i3 = (k1 * k2) >> 16
          let k3 = (l1 * k2) >> 16
          let i4 = (j * k2) >> 16
          let k4 = (i1 * k2) >> 16
          if (this.m_TI > 32768)
            this.m_TI = this.m_TI - 1638 >= 0 ? this.m_TI - 1638 : 0
          else this.m_TI = this.m_TI - 3276 >= 0 ? this.m_TI - 3276 : 0
          this.m_Hak[4].m_ifan[this.m_vaI].m_eI -= i3
          this.m_Hak[4].m_ifan[this.m_vaI].m_dI -= k3
          this.m_Hak[3].m_ifan[this.m_vaI].m_eI += i3
          this.m_Hak[3].m_ifan[this.m_vaI].m_dI += k3
          this.m_Hak[5].m_ifan[this.m_vaI].m_eI -= i4
          this.m_Hak[5].m_ifan[this.m_vaI].m_dI -= k4
        }
        if (this.m_wZ && this.m_kI < Physics.m_longI) {
          let j2 = 0x10000
          if (this.m_kI > 0)
            j2 = (((Physics.m_longI - this.m_kI) << 32) / Physics.m_longI) >> 16
          let l2 = (Physics.m_AI * j2) >> 16
          let j3 = (k1 * l2) >> 16
          let l3 = (l1 * l2) >> 16
          let j4 = (j * l2) >> 16
          let l4 = (i1 * l2) >> 16
          if (this.m_TI > 32768)
            this.m_TI = this.m_TI + 1638 >= 0x10000 ? 0x10000 : this.m_TI + 1638
          else
            this.m_TI = this.m_TI + 3276 >= 0x10000 ? 0x10000 : this.m_TI + 3276
          this.m_Hak[4].m_ifan[this.m_vaI].m_eI += j3
          this.m_Hak[4].m_ifan[this.m_vaI].m_dI += l3
          this.m_Hak[3].m_ifan[this.m_vaI].m_eI -= j3
          this.m_Hak[3].m_ifan[this.m_vaI].m_dI -= l3
          this.m_Hak[5].m_ifan[this.m_vaI].m_eI += j4
          this.m_Hak[5].m_ifan[this.m_vaI].m_dI += l4
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
        if (((j1 = (i1 + j1) >> 1) - i1 >= 0 ? j1 - i1 : -(j1 - i1)) < 65)
          return 5
      } else if (k1 == 3) {
        this.m_RZ = true
        j1 = (i1 + j1) >> 1
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
    let l1: number
    if (
      (l1 =
        (((this.m_Hak[1].m_ifan[this.m_vaI].x -
          this.m_Hak[2].m_ifan[this.m_vaI].x) *
          (this.m_Hak[1].m_ifan[this.m_vaI].x -
            this.m_Hak[2].m_ifan[this.m_vaI].x)) >>
          16) +
        (((this.m_Hak[1].m_ifan[this.m_vaI].y -
          this.m_Hak[2].m_ifan[this.m_vaI].y) *
          (this.m_Hak[1].m_ifan[this.m_vaI].y -
            this.m_Hak[2].m_ifan[this.m_vaI].y)) >>
          16)) < 0xf0000
    )
      this.m_IZ = true
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
      n1.m_longI -= ((Physics.m_voidI << 32) / k1.m_forI) >> 16
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
    this.m_cI = (this.m_cI * (0x10000 - Physics.m_jI)) >> 16
    n2.m_fI = this.m_cI
    if (n2.m_gotoI > Physics.m_PI) n2.m_gotoI = Physics.m_PI
    if (n2.m_gotoI < -Physics.m_PI) n2.m_gotoI = -Physics.m_PI
    let j1 = 0
    let l1 = 0
    for (let i2 = 0; i2 < 6; i2++) {
      j1 += this.m_Hak[i2].m_ifan[j].m_eI
      l1 += this.m_Hak[i2].m_ifan[j].m_dI
    }

    j1 = ((j1 << 32) / 0x60000) >> 16
    l1 = ((l1 << 32) / 0x60000) >> 16
    let j3 = 0
    for (let k3 = 0; k3 < 6; k3++) {
      let j2 = this.m_Hak[k3].m_ifan[j].m_eI - j1
      let k2 = this.m_Hak[k3].m_ifan[j].m_dI - l1
      if ((j3 = Physics._doIII(j2, k2)) > 0x1e0000) {
        let l2 = ((j2 << 32) / j3) >> 16
        let i3 = ((k2 << 32) / j3) >> 16
        this.m_Hak[k3].m_ifan[j].m_eI -= l2
        this.m_Hak[k3].m_ifan[j].m_dI -= i3
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
      j1 = ((j1 << 32) / i2) >> 16
      l1 = ((l1 << 32) / i2) >> 16
      let j2 = i2 - n1.y
      let l2 = (j1 * ((j2 * n1.x) >> 16)) >> 16
      let i3 = (l1 * ((j2 * n1.x) >> 16)) >> 16
      let j3 = n2.m_eI - n3.m_eI
      let k3 = n2.m_dI - n3.m_dI
      let l3 = ((((j1 * j3) >> 16) + ((l1 * k3) >> 16)) * n1.m_bI) >> 16
      l2 += (j1 * l3) >> 16
      i3 += (l1 * l3) >> 16
      l2 = (l2 * i1) >> 16
      i3 = (i3 * i1) >> 16
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
      ;(n2 = this.m_Hak[l1].m_ifan[i1]).x = (n1.m_eI * j1) >> 16
      n2.y = (n1.m_dI * j1) >> 16
      let k1 = (j1 * this.m_Hak[l1].m_forI) >> 16
      n2.m_eI = (n1.m_nullI * k1) >> 16
      n2.m_dI = (n1.m_longI * k1) >> 16
    }
  }

  _zIIV(j: number, i1: number, j1: number) {
    for (let k1 = 0; k1 < 6; k1++) {
      let n1 = this.m_Hak[k1].m_ifan[j]
      let n2 = this.m_Hak[k1].m_ifan[i1]
      let n3 = this.m_Hak[k1].m_ifan[j1]
      n1.x = n2.x + (n3.x >> 1)
      n1.y = n2.y + (n3.y >> 1)
      n1.m_eI = n2.m_eI + (n3.m_eI >> 1)
      n1.m_dI = n2.m_dI + (n3.m_dI >> 1)
    }
  }

  _aaIV(j: number) {
    this._aIV(this.m_vaI)
    this._aIIV2(this.m_vaI, 2, j)
    this._zIIV(4, this.m_vaI, 2)
    this._aIV(4)
    this._aIIV2(4, 3, j >> 1)
    this._zIIV(4, this.m_vaI, 3)
    this._zIIV(this.m_waI, this.m_vaI, 2)
    this._zIIV(this.m_waI, this.m_waI, 3)

    // wheels?!?!?!?! oh my god i found it!!!!!
    for (let i1 = 1; i1 <= 2; i1++) {
      let n1 = this.m_Hak[i1].m_ifan[this.m_vaI]
      let n2: SimpleMenuElement
      ;(n2 = this.m_Hak[i1].m_ifan[this.m_waI]).m_bI =
        n1.m_bI + ((j * n1.m_gotoI) >> 16)
      n2.m_gotoI =
        n1.m_gotoI + ((j * ((this.m_Hak[i1].m_newI * n1.m_fI) >> 16)) >> 16)
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
    k1 = ((k1 << 32) / i2) >> 16
    let j2 = -(((l1 << 32) / i2) >> 16)
    let k2 = k1
    for (let l2 = 0; l2 < 6; l2++) {
      if (l2 == 4 || l2 == 3) continue
      let n1 = this.m_Hak[l2].m_ifan[j]
      if (l2 == 0) {
        n1.x += (j2 * 0x10000) >> 16
        n1.y += (k2 * 0x10000) >> 16
      }
      let i3 = this.m_lf._anvI(n1, this.m_Hak[l2].m_intI)
      if (l2 == 0) {
        n1.x -= (j2 * 0x10000) >> 16
        n1.y -= (k2 * 0x10000) >> 16
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
    ;(n1 = (k1 = this.m_Hak[this.m_xaI]).m_ifan[j]).x +=
      (this.m_EI * 3276) >> 16
    n1.y += (this.m_CI * 3276) >> 16
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
    this.m_EI = ((this.m_EI << 32) / k2) >> 16
    this.m_CI = ((this.m_CI << 32) / k2) >> 16
    let l2: number = n1.m_eI
    let i3: number = n1.m_dI
    let j3: number = -(((l2 * this.m_EI) >> 16) + ((i3 * this.m_CI) >> 16))
    let k3: number = -(((l2 * -this.m_CI) >> 16) + ((i3 * this.m_EI) >> 16))
    let l3: number =
      ((i1 * n1.m_gotoI) >> 16) - ((j1 * (((k3 << 32) / k1.m_aI) >> 16)) >> 16)
    let i4: number =
      ((i2 * k3) >> 16) - ((l1 * ((n1.m_gotoI * k1.m_aI) >> 16)) >> 16)
    let j4: number = -((j2 * j3) >> 16)
    let k4: number = (-i4 * -this.m_CI) >> 16
    let l4: number = (-i4 * this.m_EI) >> 16
    let i5: number = (-j4 * this.m_EI) >> 16
    let j5: number = (-j4 * this.m_CI) >> 16
    n1.m_gotoI = l3
    n1.m_eI = k4 + i5
    n1.m_dI = l4 + j5
  }

  _ifZV(flag: boolean) {
    this.m_doZ = flag
  }

  _caseIV(j: number) {
    this.m_GI = ((((0xa0000 * (j << 16)) >> 16) << 32) / 0x800000) >> 16
  }

  _elsevI() {
    if (this.m_doZ)
      this.m_oI =
        (((this.m_aaan[0].m_eI << 32) / 0x180000) >> 16) +
        ((this.m_oI * 57344) >> 16)
    else this.m_oI = 0
    this.m_oI = this.m_oI >= this.m_GI ? this.m_GI : this.m_oI
    this.m_oI = this.m_oI >= -this.m_GI ? this.m_oI : -this.m_GI
    return ((this.m_aaan[0].x + this.m_oI) << 2) >> 16
  }

  _ifvI() {
    if (this.m_doZ)
      this.m_nI =
        (((this.m_aaan[0].m_dI << 32) / 0x180000) >> 16) +
        ((this.m_nI * 57344) >> 16)
    else this.m_nI = 0
    this.m_nI = this.m_nI >= this.m_GI ? this.m_GI : this.m_nI
    this.m_nI = this.m_nI >= -this.m_GI ? this.m_nI : -this.m_GI
    return ((this.m_aaan[0].y + this.m_nI) << 2) >> 16
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
      // }

      this.m_Hak[0].m_ifan[5].m_eI = this.m_Hak[0].m_ifan[this.m_vaI].m_eI
      this.m_Hak[0].m_ifan[5].m_dI = this.m_Hak[0].m_ifan[this.m_vaI].m_dI
      this.m_Hak[2].m_ifan[5].m_gotoI = this.m_Hak[2].m_ifan[this.m_vaI].m_gotoI
    }
  }

  _voidvV() {
    // synchronized (m_Hak) {
    for (let j = 0; j < 6; j++) {
      this.m_aaan[j].x = this.m_Hak[j].m_ifan[5].x
      this.m_aaan[j].y = this.m_Hak[j].m_ifan[5].y
      this.m_aaan[j].m_bI = this.m_Hak[j].m_ifan[5].m_bI
      // }

      this.m_aaan[0].m_eI = this.m_Hak[0].m_ifan[5].m_eI
      this.m_aaan[0].m_dI = this.m_Hak[0].m_ifan[5].m_dI
      this.m_aaan[2].m_gotoI = this.m_Hak[2].m_ifan[5].m_gotoI
    }
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
    let engineX = (this.m_aaan[0].x >> 1) + (this.m_aaan[3].x >> 1)
    let engineY = (this.m_aaan[0].y >> 1) + (this.m_aaan[3].y >> 1)
    let fenderX = (this.m_aaan[0].x >> 1) + (this.m_aaan[4].x >> 1)
    let fenderY = (this.m_aaan[0].y >> 1) + (this.m_aaan[4].y >> 1)
    let i3 = -j1
    let j3 = i1
    engineX += ((i3 * 0x10000) >> 16) - ((i1 * 32768) >> 16)
    engineY += ((j3 * 0x10000) >> 16) - ((j1 * 32768) >> 16)
    fenderX += ((i3 * 0x10000) >> 16) - ((i1 * 0x1cccc) >> 16)
    fenderY += ((j3 * 0x10000) >> 16) - ((j1 * 0x20000) >> 16)
    view.drawFender(
      (fenderX << 2) / 0xffff /*>> 16*/,
      (fenderY << 2) / 0xffff /*>> 16*/,
      l1
    )
    view.drawEngine(
      (engineX << 2) / 0xffff /*>> 16*/,
      (engineY << 2) / 0xffff /*>> 16*/,
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
      (this.m_aaan[2].x << 2) / 0xffff /*>> 16*/,
      (this.m_aaan[2].y << 2) / 0xffff /*>> 16*/,
      i1
    )
    gameView.drawWheel(
      (this.m_aaan[1].x << 2) / 0xffff /*>> 16*/,
      (this.m_aaan[1].y << 2) / 0xffff /*>> 16*/,
      j1
    )
  }

  _doiV(gameView: GameView) {
    let i1
    let j1 = ((i1 = this.m_Hak[1].m_aI) * 58982) >> 16
    let k1 = (i1 * 45875) >> 16
    gameView.setColor(0, 0, 0)
    if (Activity.getGDActivity().isMenuShown()) {
      gameView.drawLineWheel(
        (this.m_aaan[1].x << 2) >> 16,
        (this.m_aaan[1].y << 2) >> 16,
        ((i1 + i1) << 2) >> 16
      )
      gameView.drawLineWheel(
        (this.m_aaan[1].x << 2) >> 16,
        (this.m_aaan[1].y << 2) >> 16,
        ((j1 + j1) << 2) >> 16
      )
      gameView.drawLineWheel(
        (this.m_aaan[2].x << 2) >> 16,
        (this.m_aaan[2].y << 2) >> 16,
        ((i1 + i1) << 2) >> 16
      )
      gameView.drawLineWheel(
        (this.m_aaan[2].x << 2) >> 16,
        (this.m_aaan[2].y << 2) >> 16,
        ((k1 + k1) << 2) >> 16
      )
    }

    // right wheel
    let l1 = j1
    let i2 = 0
    let j2: number
    let k2 = FPMath._doII((j2 = this.m_aaan[1].m_bI))
    let l2 = FPMath.sin(j2)
    let i3 = l1
    l1 = ((k2 * l1) >> 16) + ((-l2 * i2) >> 16)
    i2 = ((l2 * i3) >> 16) + ((k2 * i2) >> 16)
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
      l1 = ((k2 * l1) >> 16) + ((-l2 * i2) >> 16)
      i2 = ((l2 * i3) >> 16) + ((k2 * i2) >> 16)
    }

    // left wheel
    l1 = j1
    i2 = 0
    // k2 = FPMath._doII(j2 = m_aaan[2].m_bI)
    k2 = FPMath._doII((j2 = Math.round(this.m_aaan[2].m_bI / 1.75)))
    l2 = FPMath.sin(j2)
    i3 = l1
    l1 = ((k2 * l1) >> 16) + ((-l2 * i2) >> 16)
    i2 = ((l2 * i3) >> 16) + ((k2 * i2) >> 16)
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
      l1 = ((k2 * l1) >> 16) + ((-l2 * i2) >> 16)
      i2 = ((l2 * j3) >> 16) + ((k2 * i2) >> 16)
    }
    // if (toUpdate) leftWheelLastUpdated = System.currentTimeMillis()
    // Log.d("AGDTR", "diff: " + (System.currentTimeMillis() - leftWheelLastUpdated))

    if (Physics.m_hI > 0) {
      gameView.setColor(255, 0, 0)
      if (Physics.m_hI > 2) gameView.setColor(100, 100, 255)
      gameView.drawLineWheel(
        (this.m_aaan[2].x << 2) / 0xffff /*>> 16*/,
        (this.m_aaan[2].y << 2) / 0xffff /*>> 16*/,
        4
      )
      gameView.drawLineWheel(
        (this.m_aaan[1].x << 2) / 0xffff /*>> 16*/,
        (this.m_aaan[1].y << 2) / 0xffff /*>> 16*/,
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
        j2 = (this.m_TI * 0x20000) >> 16
      } else if (this.m_TI > 32768) {
        i2 = 1
        ai1 = this.m_KaaI
        ai2 = this.m_SaaI
        j2 = ((this.m_TI - 32768) * 0x20000) >> 16
      } else {
        ai = this.m_KaaI
      }
    } else if (this.m_TI < 32768) {
      ai1 = this.m_DaaI
      ai2 = this.m_wcaaI
      j2 = (this.m_TI * 0x20000) >> 16
    } else if (this.m_TI > 32768) {
      i2 = 1
      ai1 = this.m_wcaaI
      ai2 = this.m_MaaI
      j2 = ((this.m_TI - 32768) * 0x20000) >> 16
    } else {
      ai = this.m_wcaaI
    }
    for (let j7 = 0; j7 < this.m_KaaI.length; j7++) {
      let i8: number
      let j8: number
      if (ai1 !== null) {
        j8 = ((ai1[j7][0] * (0x10000 - j2)) >> 16) + ((ai2![j7][0] * j2) >> 16)
        i8 = ((ai1[j7][1] * (0x10000 - j2)) >> 16) + ((ai2![j7][1] * j2) >> 16)
      } else {
        j8 = ai![j7][0]
        i8 = ai![j7][1]
      }
      let k8 = k2 + ((k1 * j8) >> 16) + ((i1 * i8) >> 16)
      let l8 = l2 + ((l1 * j8) >> 16) + ((j1 * i8) >> 16)
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
      ((this.m_JaaI[i2][0] * (0x10000 - j2)) >> 16) +
      ((this.m_JaaI[i2 + 1][0] * j2) >> 16)
    if (this.m_elseZ) {
      j._aIIIV2(k3 << 2, l3 << 2, k4 << 2, l4 << 2, 1)
      j._aIIIV2(k4 << 2, l4 << 2, i5 << 2, j5 << 2, 1)
      j.drawBikerPart(i5 << 2, j5 << 2, k5 << 2, l5 << 2, 2, i7)
      j._aIIIV2(k5 << 2, l5 << 2, k6 << 2, l6 << 2, 0)
      let k7 = FPMath._ifIII(i1, j1)
      if (this.m_TI > 32768) k7 += 20588
      j.drawHelmet(
        (i6 << 2) / 0xffff /*>> 16*/,
        (j6 << 2) / 0xffff /*>> 16*/,
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
      j.drawLineWheel((i6 << 2) >> 16, (j6 << 2) >> 16, ((l7 + l7) << 2) >> 16)
    }
    j.setColor(0, 0, 0)
    j.drawSteering((i3 << 2) >> 16, (j3 << 2) >> 16)
    j.drawSteering((i4 << 2) >> 16, (j4 << 2) >> 16)
  }

  _aiIIV(j: GameView, i1: number, j1: number, k1: number, l1: number) {
    let i2 = this.m_aaan[2].x
    let j2 = this.m_aaan[2].y
    let k2 = i2 + ((k1 * 32768) >> 16)
    let l2 = j2 + ((l1 * 32768) >> 16)
    let i3 = i2 - ((k1 * 32768) >> 16)
    let j3 = j2 - ((l1 * 32768) >> 16)
    let k3 = this.m_aaan[0].x + ((i1 * 32768) >> 16)
    let l3 = this.m_aaan[0].y + ((j1 * 32768) >> 16)
    let i4 = k3 - ((i1 * 0x20000) >> 16)
    let j4 = l3 - ((j1 * 0x20000) >> 16)
    let k4 = i4 + ((k1 * 0x10000) >> 16)
    let l4 = j4 + ((l1 * 0x10000) >> 16)
    let i5 = i4 + ((i1 * 49152) >> 16) + ((k1 * 49152) >> 16)
    let j5 = j4 + ((j1 * 49152) >> 16) + ((l1 * 49152) >> 16)
    let k5 = i4 + ((k1 * 32768) >> 16)
    let l5 = j4 + ((l1 * 32768) >> 16)
    let i6 = this.m_aaan[1].x
    let j6 = this.m_aaan[1].y
    let k6 = this.m_aaan[4].x - ((i1 * 49152) >> 16)
    let l6 = this.m_aaan[4].y - ((j1 * 49152) >> 16)
    let i7 = k6 - ((k1 * 32768) >> 16)
    let j7 = l6 - ((l1 * 32768) >> 16)
    let k7 = k6 - ((i1 * 0x20000) >> 16) + ((k1 * 16384) >> 16)
    let l7 = l6 - ((j1 * 0x20000) >> 16) + ((l1 * 16384) >> 16)
    let i8 = this.m_aaan[3].x
    let j8 = this.m_aaan[3].y
    let k8 = i8 + ((k1 * 32768) >> 16)
    let l8 = j8 + ((l1 * 32768) >> 16)
    let i9 = i8 + ((k1 * 0x1c000) >> 16) - ((i1 * 32768) >> 16)
    let j9 = j8 + ((l1 * 0x1c000) >> 16) - ((j1 * 32768) >> 16)
    j.setColor(50, 50, 50)
    j.drawLineWheel(
      (k5 << 2) >> 16,
      (l5 << 2) >> 16,
      ((32768 + 32768) << 2) >> 16
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
      i1 = ((i1 << 32) / k1) >> 16
      j1 = ((j1 << 32) / k1) >> 16
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
      (this.m_aaan[1].x << 2) >> 16,
      (this.m_aaan[1].y << 2) >> 16,
      (Physics.m_foraI[0] << 2) >> 16,
      FPMath._ifIII(i1, j1)
    )
    if (!this.m_IZ) this._laiV(j)
    this._ifiIIV(j, i1, j1, l1, i2)
    if (!this.m_UZ) this._aiIIV(j, i1, j1, l1, i2)
    this.m_lf._aiV(j)
  }
}
