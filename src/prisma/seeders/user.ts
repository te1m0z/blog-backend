import 'dotenv/config'
import { basename } from 'node:path'
import { PrismaClient, type Prisma } from '@prisma/client'
import { hashSync } from 'bcrypt'

const { PRISMA_TEST_USER_LOGIN, PRISMA_TEST_USER_PASSWORD } = process.env

const FILE_NAME = basename(__filename)

if (!PRISMA_TEST_USER_LOGIN || !PRISMA_TEST_USER_PASSWORD) {
  throw 'Unavailable test user"s login or password!'
}

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput = {
  login: PRISMA_TEST_USER_LOGIN,
  password: hashSync(PRISMA_TEST_USER_PASSWORD, 5),
}

async function main() {
  //
  await prisma.user.create({ data: userData })
  //
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

