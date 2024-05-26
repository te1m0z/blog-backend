import { prisma } from '@/prisma/client'


export async function getAllLabs(page = 1) {
  const perPage = 9
  const offset = (page - 1) * perPage

  const [labs, total] = await prisma.$transaction([
    prisma.laboratory.findMany({
      skip: offset,
      take: perPage,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      },
    }),
    prisma.laboratory.count(),
  ])

  return {
    labs,
    totalPages: Math.ceil(total / perPage),
    pageSize: perPage,
    totalItems: total,
  }
}

export async function getLabBySlug(slug: string) {
  return prisma.laboratory.findUniqueOrThrow({
    where: {
      slug,
    },
  })
}

interface ICreateLabParams {
  title: string
  content: string
  slug: string
}

export async function createLab(params: ICreateLabParams) {
  const { title, content, slug } = params
  // Try to get user from db, otherwise throw error
  const note = await prisma.laboratory.create({ data: { title, content, slug, userId: 1 } })
  // Preparing data to get back to client's browser
  return note
}
