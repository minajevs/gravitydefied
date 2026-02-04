const win1251 = new TextDecoder("windows-1251")

export function decodeCp1251(data: number[]) {
  let res: number[] = []
  for (let i = 0; i < data.length; i++) {
    if (data[i] === 0) break
    res.push(data[i] & 0xff)
  }
  return win1251.decode(new Uint8Array(res))
}

export function skipBytes(arr: Uint8Array, bytes: number) {
  return arr.subarray(bytes, arr.length)
}

export function readInt(arr: Uint8Array) {
  let result = arr.subarray(0, 4)

  const tCount =
    (result[0] << 24) | (result[1] << 16) | (result[2] << 8) | result[3]

  return [tCount, arr.subarray(4, arr.length)] as const
}

export function readShort(arr: Uint8Array) {
  let result = arr.subarray(0, 2)

  let shortValue = (result[0] << 8) | result[1]
  if (shortValue & 0x8000) {
    shortValue = shortValue - 0x10000
  }

  return [shortValue, arr.subarray(2, arr.length)] as const
}

export function readByte(arr: Uint8Array) {
  let result = arr.subarray(0, 1)

  const value = result[0]
  const signed = value & 0x80 ? value - 0x100 : value
  return [signed, arr.subarray(1, arr.length)] as const
}

// Thanks ChatGPT
export async function readStreamToEnd(
  reader: ReadableStreamDefaultReader<Uint8Array>
) {
  let chunks = []
  let totalLength = 0

  // Loop until the stream is done
  while (true) {
    const { done, value } = await reader.read()
    if (done) break // Exit the loop when the stream is finished

    // Accumulate the chunks
    chunks.push(value)
    totalLength += value.length
  }

  // Combine all chunks into a single Uint8Array
  let result = new Uint8Array(totalLength)
  let offset = 0
  for (let chunk of chunks) {
    result.set(chunk, offset)
    offset += chunk.length
  }

  return result // The final Uint8Array containing all data from the stream
}
