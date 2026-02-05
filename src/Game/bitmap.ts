type BitmapType =
  | "helmet"
  | "logo"
  | "logo2"
  | "flags"
  | "steering"
  | "wheels"
  | "engine"
  | "fender"
  | "biker"

const images = {
  helmet: [new Image()],
  logo: [new Image()],
  logo2: [new Image()],
  flags: [
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
  ],
  steering: [new Image()],
  wheels: [new Image(), new Image()],
  fender: [new Image()],
  engine: [new Image()],
  biker: [new Image(), new Image(), new Image()],
} satisfies Record<BitmapType, HTMLImageElement[]>

const assets = {
  helmet: ["s_helmet"],
  logo: ["gd"],
  logo2: ["codebrew"],
  flags: [
    "s_flag_start0",
    "s_flag_start1",
    "s_flag_start2",
    "s_flag_finish0",
    "s_flag_finish1",
    "s_flag_finish2",
  ],
  steering: ["s_steering"],
  wheels: ["s_wheel1", "s_wheel2"],
  fender: ["s_fender"],
  engine: ["s_engine"],
  biker: ["s_bluearm", "s_blueleg", "s_bluebody"],
} satisfies Record<BitmapType, string[]>

;(Object.entries(images) as [BitmapType, [HTMLImageElement]][]).map(
  ([key, values]) => {
    if (values.length === 1) {
      values[0].src = `assets/${assets[key][0]}.png`
    } else {
      for (let i = 0; i < values.length; i++) {
        values[i].src = `assets/${assets[key][i]}.png`
      }
    }
  }
)

export class Bitmap {
  // Most public assets are xxhdpi (3x). Logos are hdpi (1.5x).
  private static defaultDensity = 3
  private static densityByType: Partial<Record<BitmapType, number>> = {
    logo: 1.5,
    logo2: 1.5,
  }

  static setDensity(density: number) {
    if (Number.isFinite(density) && density > 0) this.defaultDensity = density
  }

  static setTypeDensity(type: BitmapType, density: number) {
    if (Number.isFinite(density) && density > 0)
      this.densityByType[type] = density
  }

  private static getDensity(type: BitmapType): number {
    return this.densityByType[type] ?? this.defaultDensity
  }

  // Returns device-independent width for a given bitmap type/index
  static getWidthDp(type: BitmapType, arrayIndex: number = 0): number {
    const img = images[type][arrayIndex]
    return img.width / this.getDensity(type)
  }

  // Returns device-independent height for a given bitmap type/index
  static getHeightDp(type: BitmapType, arrayIndex: number = 0): number {
    const img = images[type][arrayIndex]
    return img.height / this.getDensity(type)
  }
  static get(type: BitmapType, arrayIndex: number = 0) {
    const holder = images[type]

    return holder[arrayIndex]
  }
}
