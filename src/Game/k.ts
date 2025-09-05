import { SimpleMenuElement } from "../Menu/simpleMenuElement"

export class k {
  m_doZ: boolean = true
  m_aI: number = 0
  m_intI: number = 0
  m_forI: number = 0
  m_newI: number = 0
  m_ifan: SimpleMenuElement[]

  constructor() {
    //m_ifan = new SimpleMenuElement[6];
    this.m_ifan = []
    for (let i = 0; i < 6; i++) this.m_ifan[i] = new SimpleMenuElement()

    this._avV()
  }

  // init
  _avV() {
    this.m_aI = this.m_forI = this.m_newI = 0
    this.m_doZ = true
    for (let i = 0; i < 6; i++) this.m_ifan[i].init()
  }
}
