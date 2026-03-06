// import { PrismaClient } from "../app/generated/prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg"; // or the adapter for your database
// const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
// const prisma = new PrismaClient({ adapter });
import { prisma } from '../app/lib/prisma'
//const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.upsert({
        where: {
            email: "user@example.com"
        },
        update: {},
        create: {
            email: "user@example.com",
            password: "password",
            name: "John Doe"
        }
        
    });
    console.log("Seeded user:", user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });