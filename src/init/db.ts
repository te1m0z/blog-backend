import { prisma } from '@/prisma/client'

async function testDatabaseConnection() {
  //
  try {
    //
    await prisma.$connect()
    //
  } catch (error) {
    //
    // eslint-disable-next-line no-console
    console.error('Database connection failed:', error)
    //
    throw error
    //
  } finally {
    //
    await prisma.$disconnect()
    //
  }
}

export {
  testDatabaseConnection,
}
