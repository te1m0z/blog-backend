import 'dotenv/config'
import { basename } from 'node:path'
import { PrismaClient, type Prisma } from '@prisma/client'
import { hashSync } from 'bcrypt'
import { faker } from '@faker-js/faker'

const FILE_NAME = basename(__filename)

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput = {
  login: faker.internet.displayName(),
  password: hashSync(faker.internet.password(), 5),
}

const categoryData: Prisma.CategoryCreateInput = {
  name: faker.lorem.words({ min: 1, max: 3 }),
  slug: faker.lorem.slug(2),
}

async function main() {
  //
  const user = await prisma.user.create({ data: userData })
  //
  const category = await prisma.category.create({ data: categoryData })
  //
  const randomNoteData = (): Prisma.NoteCreateInput => {
    return {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(5),
      slug: faker.lorem.slug(4),
      user: { connect: { id: user.id } },
      category: { connect: { id: category.id } },
    }
  }
  // * how to create array of random data with faker
  // const postsData = faker.helpers.multiple(randomPostData, { count: 5 });
  //
  // * createMany is not supported for SQLite
  // await prisma.post.createMany({
  //   data: postsData,
  // });
  //
  // eslint-disable-next-line no-unused-vars
  for (const _ of Array(100)) {
    //
    const data = randomNoteData()
    //
    await prisma.note.create({ data })
  }
}

export const runNote = async () => {
  await main()
    .then(() => {
      console.log(`Seeder ${FILE_NAME} successfully done!`)
    })
    .catch((e) => {
      console.log(`Error in ${FILE_NAME} seeder: `, e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
