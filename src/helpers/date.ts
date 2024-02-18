function getDateInSec(now = Date.now()) {
  return Math.floor(now / 1000)
}

export {
  getDateInSec,
}