import { prisma } from '@/prisma/client'

async function getAllPosts(page = 1) {
  const perPage = 3
  const offset = (page - 1) * perPage

  return prisma.post.findMany({
    skip: offset,
    take: perPage,
    orderBy: {
      createdAt: 'desc',
    },
  })
}

async function getPostById(id: number) {
  return prisma.post.findUniqueOrThrow({
    where: {
      id,
    },
  })
}

interface ICreateNoteParams {
  title: string
  content: string
  categoryId: number
}

async function createNote(params: ICreateNoteParams) {
  const { title, content, categoryId } = params
  // Try to get user from db, otherwise throw error
  const note = await prisma.post.create({ data: { title, content, categoryId, userId: 1 } })
  // Preparing data to get back to client's browser
  return note
}

export {
  getAllPosts,
  getPostById,
  createNote,
}