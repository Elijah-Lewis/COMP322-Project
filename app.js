//set up variables 
require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;

//establish driver connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Middleware
app.use(express.json());
app.use(express.static('.'));

// get records from db
app.get('/api/plants', async (req, res) => {
    try {
        const plants = await prisma.plant.findMany({
            orderBy: { id: 'asc' }
        });
        res.json(plants);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch plants from database" });
    }
});

// add plants to db
app.post('/api/plants', async (req, res) => {
    const { name, type, datePlanted, wateringSchedule, harvestYield } = req.body;

    if (!name || !type || !datePlanted || !wateringSchedule || !harvestYield) {
        return res.status(400).json({ error: "All plant fields are required for creation." });
    }

    try {
        const newPlant = await prisma.plant.create({
            data: { name, type, datePlanted, wateringSchedule, harvestYield }
        });
        res.status(201).json(newPlant);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "A plant with this name already exists." });
        }
        res.status(500).json({ error: "Database transaction failed." });
    }
});

// modify plant types
app.put('/api/plants', async (req, res) => {
    const { targetName, updatedType } = req.body;

    if (!targetName || !updatedType) {
        return res.status(400).json({ error: "Missing required modification parameters." });
    }

    try {
        const updatedPlant = await prisma.plant.update({
            where: { name: targetName },
            data: { type: updatedType }
        });
        res.json({ message: "Plant updated", plant: updatedPlant });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Plant not found on server" });
        }
        res.status(500).json({ error: "Internal Update Pipeline Failed" });
    }
});

// delete a plant
app.delete('/api/plants', async (req, res) => {
    const { targetName } = req.body;

    if (!targetName) {
        return res.status(400).json({ error: "Target name must be provided." });
    }

    try {
        await prisma.plant.delete({
            where: { name: targetName }
        });
        res.json({ message: "Plant deleted successfully" });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Plant not found on server" });
        }
        res.status(500).json({ error: "Internal Deletion Pipeline Failed" });
    }
});

// 404 Route Handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

//listen on port 3000
app.listen(PORT, () => console.log(`Agri-tech server running seamlessly on http://localhost:${PORT}`));