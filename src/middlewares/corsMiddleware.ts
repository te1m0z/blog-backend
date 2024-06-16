import cors from 'cors'

export const corsMiddleware = cors({
  origin: 'http://localhost:5050',
  credentials: true,
})
