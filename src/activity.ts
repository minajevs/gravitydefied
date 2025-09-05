export class Activity {
  m_longI = 0

  wasPaused = false
  wasStarted = false
  wasDestroyed = false
  restartingStarted = false
  alive = false
  m_cZ = true
  menuShown = false
  fullResetting = false
  exiting = false

  static instance: Activity = new Activity()

  static getGDActivity() {
    return this.instance
  }

  isMenuShown() {
    return this.menuShown
  }
}
