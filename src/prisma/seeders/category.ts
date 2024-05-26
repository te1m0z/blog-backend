import 'dotenv/config'
import { basename } from 'node:path'
import { PrismaClient, type Prisma } from '@prisma/client'
import { faker } from '@faker-js/faker'

const FILE_NAME = basename(__filename)

const prisma = new PrismaClient()

const categoryData: Prisma.CategoryCreateInput = {
  name: faker.lorem.words({ min: 1, max: 3 }),
  slug: faker.lorem.slug(2),
}

async function main() {
  //
  await prisma.category.create({ data: categoryData })
  //
}

export const runCategory = async () => {
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
