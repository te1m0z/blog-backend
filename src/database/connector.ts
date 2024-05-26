import { PrismaClient } from '@prisma/client'

export class DatabaseConnector {

    private prisma: PrismaClient

    constructor() {
        this.prisma = new PrismaClient()
    }

    async connect() {
        this.prisma.$connect()
        console.info('Connect to sqlite3 successfully.');
    }

    async disconnect() {
        this.prisma.$disconnect()
        console.info('Disconnect from sqlite3 successfully.');
    }
}
