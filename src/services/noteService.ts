import { prisma } from '@/config/prisma';

export async function getAllPosts(page = 1, category: string | null = null) {
  const perPage = 9;
  const offset = (page - 1) * perPage;

  const where = {
    ...(category && { category: { slug: category } })
  };

  const [notes, total] = await prisma.$transaction([
    prisma.note.findMany({
      where,
      skip: offset,
      take: perPage,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true,
        category: true
      }
    }),
    prisma.note.count({ where })
  ]);

  return {
    notes,
    totalPages: Math.ceil(total / perPage),
    pageSize: perPage,
    totalItems: total
  };
}

export async function getPostById(id: number) {
  return prisma.note.findUniqueOrThrow({
    where: {
      id
    }
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.note.findUniqueOrThrow({
    where: {
      slug
    }
  });
}

interface ICreateNoteParams {
  title: string;
  content: string;
  slug: string;
  // categoryId: number
}

export async function createNote(params: ICreateNoteParams) {
  const { title, content, slug } = params;
  // Try to get user from db, otherwise throw error
  const note = await prisma.note.create({
    data: { title, content, slug, categoryId: 1, userId: 1 }
  });
  // Preparing data to get back to client's browser
  return note;
}

export interface IUpdateNoteParams {
  id: number;
  title?: string;
  content?: string;
  slug?: string;
  categoryId?: number;
}

export async function updateNoteById(params: IUpdateNoteParams) {
  const { id, title, content, slug, categoryId } = params;

  const data: Omit<IUpdateNoteParams, 'id'> = {};

  if (title) {
    data.title = title;
  }

  if (content) {
    data.content = content;
  }

  if (slug) {
    data.slug = slug;
  }

  if (categoryId || categoryId === null) {
    data.categoryId = categoryId;
  }

  return await prisma.note.update({
    where: { id },
    data
  });
}

export async function deleteNoteById(id: number) {
  return await prisma.note.delete({
    where: { id }
  });
}
