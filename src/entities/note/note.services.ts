import { prisma } from '@/prisma/client'


async function getAllPosts(page = 1, category: string | null = null) {
  const perPage = 9
  const offset = (page - 1) * perPage

  const where = {
    ...(category && { category: { slug: category } }),
  }

  const [notes, total] = await prisma.$transaction([
    prisma.note.findMany({
      where,
      skip: offset,
      take: perPage,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        category: true,
      },
    }),
    prisma.note.count({ where }),
  ])

  return {
    notes,
    totalPages: Math.ceil(total / perPage),
    pageSize: perPage,
    totalItems: total,
  }
}

async function getPostById(id: number) {
  return prisma.note.findUniqueOrThrow({
    where: {
      id,
    },
  })
}

async function getPostBySlug(slug: string) {
  return prisma.note.findUniqueOrThrow({
    where: {
      slug,
    },
  })
}

interface ICreateNoteParams {
  title: string
  content: string
  slug: string
  categoryId: number
}

async function createNote(params: ICreateNoteParams) {
  const { title, content, slug, categoryId } = params
  // Try to get user from db, otherwise throw error
  const note = await prisma.note.create({ data: { title, content, slug, categoryId, userId: 1 } })
  // Preparing data to get back to client's browser
  return note
}

export {
  getAllPosts,
  getPostById,
  getPostBySlug,
  createNote,
}