type BitmapType =
  | "helmet"
  | "logo"
  | "logo2"
  | "flags"
  | "steering"
  | "wheels"
  | "fender"

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
  static get(type: BitmapType, arrayIndex: number = 0) {
    const holder = images[type]

    return holder[arrayIndex]
  }
}
