const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('.')); 

//starter plant data
let plantData = [
    { name: "Tomato", type: "Vegetable", datePlanted: "2023-10-01", wateringSchedule: "Every 2 days", harvestYield: "10 bu/acre" },
    { name: "Basil", type: "Herb", datePlanted: "2023-10-02", wateringSchedule: "Every 3 days", harvestYield: "5 bu/acre" }
];

//get the plant type and update the table and server
app.get('/api/plants', (req, res) => {
    res.json(plantData);
});
app.post('/api/plants', (req, res) => {
    plantData.push(req.body);
    res.status(201).json(req.body);
});

// Match the targetName with the frontend radio value selection
app.put('/api/plants', (req, res) => {
    const { targetName, updatedType } = req.body;
    const plant = plantData.find(p => p.name.toLowerCase() === targetName.toLowerCase());
    
    if (plant) {
        plant.type = updatedType;
        return res.json({ message: "Plant updated", plant });
    }
    res.status(404).json({ error: "Plant not found" });
});

//remove the plant from the table and server
app.delete('/api/plants', (req, res) => {
    const { targetName } = req.body;
    const initialLength = plantData.length;

    plantData = plantData.filter(p => p.name.toLowerCase() !== targetName.toLowerCase());
    
    //check if any plant was removed
    if (plantData.length === initialLength) {
        return res.status(404).json({ error: "Plant not found" });
    }
    res.json({ message: "Plant deleted" });
});

//catch any unmatched routes and return a 404 error
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

//make sure the app is running and listening on the specified port, and log a message to the console when it starts successfully.
app.listen(PORT, () => console.log('Agri-tech server running seamlessly on http://localhost:3000'));