import { prisma } from '@/config/prisma';

export async function getAllCategories() {
  return await prisma.category.findMany();
}

export async function getTopCategories() {
  return await prisma.category.findMany({
    where: {
      parentId: null
    }
  });
}

export async function getChildCategoriesByParentSlug(slug: string) {
  const parentCategory = await prisma.category.findUnique({
    where: {
      slug: slug
    }
  });

  if (!parentCategory) {
    return [];
  }

  return prisma.category.findMany({
    where: {
      parentId: parentCategory.id
    }
  });
}

export interface ICreateCategoryParams {
  name: string;
  slug: string;
  parentId?: number | null;
}

export async function createCategory(params: ICreateCategoryParams) {
  const { name, slug, parentId } = params;

  return await prisma.category.create({
    data: {
      name,
      slug,
      parentId
    }
  });
}

export interface IUpdateCategoryParams {
  id: number;
  name?: string;
  slug?: string;
  parentId?: number | null;
}

export async function updateCategoryById(params: IUpdateCategoryParams) {
  const { id, name, slug, parentId } = params;

  const data: Omit<IUpdateCategoryParams, 'id'> = {};

  if (name) {
    data.name = name;
  }

  if (slug) {
    data.slug = slug;
  }

  if (parentId || parentId === null) {
    data.parentId = parentId;
  }

  return await prisma.category.update({
    where: { id },
    data
  });
}

export async function deleteCategoryById(id: number) {
  return await prisma.category.delete({
    where: { id }
  });
}
