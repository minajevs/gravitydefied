import { LevelHeader } from "./levelHeader"
import { decodeCp1251, readByte, readInt, readStreamToEnd } from "./readerUtils"

export class Reader {
  private static MAX_VALID_TRACKS = 16384

  public static async readHeader(
    stream: ReadableStream<Uint8Array>
  ): Promise<LevelHeader> {
    let header = new LevelHeader()
    const reader = stream.getReader()
    let buf: number[] = [...new Array(40)]
    let tmp: string
    let arr = await readStreamToEnd(reader)
    for (let i = 0; i < 3; i++) {
      let [tCount, newArr] = readInt(arr)
      arr = newArr
      if (tCount > this.MAX_VALID_TRACKS) {
        reader.cancel()
        throw new Error("Level file is not valid")
      }
      header.setCount(i, tCount)

      label0: for (let j = 0; j < header.getCount(i); j++) {
        let [trackPointer, newArr] = readInt(arr)
        arr = newArr
        header.setPointer(i, j, trackPointer)
        let nameLen = 0
        do {
          if (nameLen >= 40) continue label0

          let [byte, newArr] = readByte(arr)
          arr = newArr
          buf[nameLen] = byte
          if (buf[nameLen] === 0) {
            // tmp = (new String(buf, 0, nameLen, "CP-1251"));
            tmp = decodeCp1251(buf)
            header.setName(i, j, tmp.replace("_", " "))
            continue label0
          }
          nameLen++
        } while (true)
      }
    }

    return header
  }
}
