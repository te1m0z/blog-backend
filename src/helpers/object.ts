

function isObj(value: unknown) {
  //
  const isObject = typeof value === 'object'
  const notArray = !Array.isArray(value)
  const notNull = value !== null
  //
  return isObject && notArray && notNull
}

export {
  isObj,
}