import 'dotenv/config'
import { basename } from 'node:path'
import { PrismaClient } from '@prisma/client'

const FILE_NAME = basename(__filename)

const prisma = new PrismaClient()

async function main() {
  const js = await prisma.category.create({ data: { name: 'JavaScript', slug: 'js' } })
  const ts = await prisma.category.create({ data: { name: 'TypeScript', slug: 'ts' } })
  const php = await prisma.category.create({ data: { name: 'PHP', slug: 'php' } })
  await prisma.category.create({ data: { name: 'OOP', slug: 'oop' } })
  await prisma.category.create({ data: { name: 'Browser', slug: 'browser' } })
  
  // await prisma.category.create({ data: { name: 'React', slug: 'react', parentId: js.id } })
  await prisma.category.create({ data: { name: 'React', slug: 'react', parentId: js.id } })
  await prisma.category.create({ data: { name: 'Vue', slug: 'vue', parentId: js.id } })
  
  await prisma.category.create({ data: { name: 'Laravel', slug: 'laravel', parentId: php.id } })
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
