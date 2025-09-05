import { init2Array, initArray } from "../helpers"

export class LevelHeader {
  pointers: number[][] = init2Array(3, 0)
  names: string[][] = init2Array(3, 0)
  counts: number[] = initArray(3)

  public LevelHeader() {}

  setCount(level: number, count: number) {
    if (level >= this.counts.length) return

    this.pointers[level] = []
    this.names[level] = []
    this.counts[level] = count
  }

  getCount(level: number) {
    if (level < this.counts.length) return this.counts[level]
    else return 0
  }

  setPointer(level: number, index: number, value: number) {
    this.pointers[level][index] = value
  }

  setName(level: number, index: number, value: string) {
    this.names[level][index] = value
  }

  public getPointers() {
    return this.pointers
  }

  public getNames() {
    return this.names
  }

  public isCountsOk() {
    for (let i = 0; i < this.counts.length; i++) {
      if (this.counts[i] <= 0) return false
    }

    return true
  }
}
