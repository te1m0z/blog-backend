import cors from 'cors'

const MCors = cors({
  origin: 'http://localhost:5050',
  credentials: true,
})

export {
  MCors,
}