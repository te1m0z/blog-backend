import { prisma } from '@/prisma/client'

async function getAllPosts() {
  return prisma.post.findMany()
}

async function getPostById(id: number) {
  return prisma.post.findUniqueOrThrow({
    where: {
      id,
    },
  })
}

export {
  getAllPosts,
  getPostById,
}