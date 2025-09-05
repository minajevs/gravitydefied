export class SimpleMenuElement {
  public x: number = 0
  public y: number = 0
  public m_bI: number = 0
  public m_eI: number = 0
  public m_dI: number = 0
  public m_gotoI: number = 0
  public m_nullI: number = 0
  public m_longI: number = 0
  public m_fI: number = 0

  constructor() {
    this.init()
  }

  init() {
    this.x = this.y = this.m_bI = 0
    this.m_eI = this.m_dI = this.m_gotoI = 0
    this.m_nullI = this.m_longI = this.m_fI = 0
  }
}
