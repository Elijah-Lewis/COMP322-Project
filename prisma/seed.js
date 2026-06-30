require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    //remove old data from db
    await prisma.plant.deleteMany({});

  //add initial data to db
  await prisma.plant.createMany({
    data: [
      { name: "Tomato", type: "Vegetable", datePlanted: "2023-10-01", wateringSchedule: "Every 2 days", harvestYield: "10 bu/acre" },
      { name: "Basil", type: "Herb", datePlanted: "2023-10-02", wateringSchedule: "Every 3 days", harvestYield: "5 bu/acre" }
    ],
  });
  
  console.log("Database seeded successfully!");
}

main()
  .catch((e) => { 
    console.error(e); 
    process.exit(1); 
  })
  .finally(async () => { 
    await prisma.$disconnect(); 
  });