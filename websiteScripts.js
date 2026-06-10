let plants = [];

// 2. Start application on DOM load
document.addEventListener('DOMContentLoaded', () => {
    loadPlantsFromStorage();
    renderTable();

    document.getElementById('add-plant-btn').addEventListener('click', addPlantInfo);
});

// 3. Load data from localStorage
function loadPlantsFromStorage() {
    const storedPlants = localStorage.getItem('plantsData');
    if (storedPlants) {
        plants = JSON.parse(storedPlants);
    } else {
        // Default seed data if local storage is empty
        plants = [
            { id: 1, name: 'Tomato', type: 'Vegetable', date: '2023-10-01', schedule: 'Every 2 days', yield: '10 bu/acre' },
            { id: 2, name: 'Basil', type: 'Herb', date: '2023-10-02', schedule: 'Every 3 days', yield: '5 bu/acre' }
        ];
        savePlantsToStorage();
    }
}

// 4. Save data to localStorage
function savePlantsToStorage() {
    localStorage.setItem('plantsData', JSON.stringify(plants));
}

// 5. DOM Manipulation: Render state data to the table UI
function renderTable() {
    const tableBody = document.getElementById('plant-table-body');
    tableBody.innerHTML = ''; // Clear existing rows

    plants.forEach(plant => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${plant.name}</td>
            <td>${plant.type}</td>
            <td>${plant.date}</td>
            <td>${plant.schedule}</td>
            <td>${plant.yield}</td>
            <td>
                <button class="delete-btn" onclick="deletePlantInfo(${plant.id})">Delete</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// 6. Capture Input & Update State (Add)
function addPlantInfo() {
    const name = prompt("Enter Plant Name:");
    if (!name) return; // Exit if cancelled

    const type = prompt("Enter Plant Type:");
    const date = prompt("Enter Date Planted (YYYY-MM-DD):");
    const schedule = prompt("Enter Watering Schedule:");
    const harvestYield = prompt("Enter Harvest Yield:");

    const newPlant = {
        id: Date.now(), // Unique ID for targeting deletions
        name,
        type,
        date,
        schedule,
        yield: harvestYield
    };

    plants.push(newPlant);
    savePlantsToStorage();
    renderTable();
}

// 7. Update State & UI (Delete)
function deletePlantInfo(id) {
    // Filter out the plant with the targeted ID
    plants = plants.filter(plant => plant.id !== id);
    savePlantsToStorage();
    renderTable();
}