export const init2Array = <T>(size1: number, size2: number): T[][] =>
  [...new Array(size1)].map((_) => initArray(size2))

export const initArray = <T>(size1: number): T[] => [...new Array(size1)]
