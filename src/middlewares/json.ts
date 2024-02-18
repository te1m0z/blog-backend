import { json } from 'express'

const MJson = json({
  limit: '500kb',
  strict: true,
})

export {
  MJson,
}