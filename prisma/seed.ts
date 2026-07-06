import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    await prisma.user.createMany({
        data: [
            {
                username: "hedi",
                email: "hedi@test.com",
                password: "test123",
            },
            {
                username: "ziad",
                email: "ziad@test.com",
                password: "test123",
            },
            {
                username: "yaman",
                email: "yaman@test.com",
                password: "test123",
            },
        ]
    })
    console.log("Done")
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())