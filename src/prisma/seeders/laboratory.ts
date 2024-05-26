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

async function main() {
  // const user = await prisma.user.create({ data: userData })
  // console.log(user.id)
  //
  const randomLaboratoryData = (): Prisma.LaboratoryCreateInput => {
    return {
      title: faker.lorem.sentence(4),
      content: faker.lorem.paragraphs(10),
      previewText: faker.lorem.words(3),
      slug: faker.lorem.slug(3),
      user: { connect: { id: 1 } },
    }
  }
  // eslint-disable-next-line no-unused-vars
  for (const _ of Array(100)) {
    //
    const data = randomLaboratoryData()
    //
    await prisma.laboratory.create({ data })
  }
}

export const runLaboratory = async () => {
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
