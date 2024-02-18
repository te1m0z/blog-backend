function isSolidInt(value: string): boolean {
  //
  const integerPattern: RegExp = /^\d+$/
  //
  return integerPattern.test(value)
}

export {
  isSolidInt,
}
