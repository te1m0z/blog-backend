import { prisma } from '@/prisma/client'


export async function getCategories(slug: string | null = null) {
  // If slug is provided, find the parent category first
  if (slug) {
    const parentCategory = await prisma.category.findUnique({
      where: {
        slug: slug,
      },
    });

    // If no parent category found, return an empty array
    if (!parentCategory) {
      return [];
    }

    // Fetch child categories of the found parent category
    return prisma.category.findMany({
      where: {
        parentId: parentCategory.id,
      },
    });
  } else {
    // Fetch root categories (categories without a parent)
    return prisma.category.findMany({
      where: {
        parentId: null,
      },
    });
  }
}

