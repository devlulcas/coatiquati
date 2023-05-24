import { PrismaClient } from "@prisma/client"
import { env } from "$env/dynamic/private"

const prisma: PrismaClient = global.prisma || new PrismaClient()

if (env.NODE_ENV === "development") {
	global.prisma = prisma
}

export { prisma }
