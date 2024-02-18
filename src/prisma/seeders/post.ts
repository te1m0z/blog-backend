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
}

async function main() {
  //
  const user = await prisma.user.create({ data: userData })
  //
  const category = await prisma.category.create({ data: categoryData })
  //
  const randomPostData = (): Prisma.PostCreateInput => {
    return {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(5),
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
  for (const _ of Array(10)) {
    //
    const data = randomPostData()
    //
    await prisma.post.create({ data })
  }
}

main()
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
