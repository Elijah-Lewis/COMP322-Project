//alert the user when a button is clicked
function onClick(buttonName){
    alert(`You clicked the \"${buttonName}\" button!`);
}

//delete the plant info from the table and server
function deletePlantInfo(){
    alert("You clicked the \"Delete Plant Information\" button!");

    //If the plant isn't selected, alert user
    const selectedRadio = document.querySelector('input[name="plantSelect"]:checked');
    if (!selectedRadio) {
        alert("Please select a plant from the table first using the radio buttons.");
        return;
    }

    //find name of selected plant
    const targetName = selectedRadio.value;
    fetch('/api/plants', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetName: targetName })
    })
    .then(response => {
        //if plant not found in server, throw an error
        if (!response.ok) throw new Error('Plant not found on server');
        return response.json();
    })
    .then(() => {
        // Reload the table automatically
        fetchPlants();
    })
    .catch(error => alert(error.message));
}


//edit the plant information within the table and update the server
function editPlantInfo(){
    alert("You clicked the \"Edit Plant Information\" button!");

    //if the plant is selected, let user edit plant info
    const selectedRadio = document.querySelector('input[name="plantSelect"]:checked');
    if (!selectedRadio) {
        alert("Please select a plant from the table first using the radio buttons.");
        return;
    }

    const targetName = selectedRadio.value;
    const updatedType = prompt(`Enter the new plant type for "${targetName}":`);
    if (!updatedType) return;

    fetch('/api/plants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetName: targetName, updatedType: updatedType })
    })
    .then(response => {
        if (!response.ok) throw new Error('Plant not found on server');
        return response.json();
    })
    .then(() => {
        fetchPlants(); // Reload the table automatically
    })
    .catch(error => alert(error.message));
}

//add new plants into table and save to server
function addPlantInfo(){
    alert("You clicked the \"Add Plant Information\" button!");

    //get new plant information from user
    const name = prompt("Enter plant name:");
    const type = prompt("Enter plant type:");
    const wateringSchedule = prompt("Enter watering schedule:");
    const harvestYield = prompt("Enter harvest yield:");

    if (!name || !type || !wateringSchedule || !harvestYield) return;
    const newPlantData = {
        name: name,
        type: type,
        datePlanted: new Date().toISOString().split('T')[0],
        wateringSchedule: wateringSchedule,
        harvestYield: harvestYield
    };

    fetch('/api/plants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlantData)
    })
    .then(response => response.json())
    .then(() => {
        fetchPlants(); 
    })
    .catch(error => console.error('Error saving plant:', error));
}

//fetch plants w/ api
function fetchPlants() {
    fetch('/api/plants')
        .then(response => response.json())
        .then(data => {
            renderTable(data);
        })
        .catch(error => console.error('Error fetching plants:', error));
}

function renderTable(plants) {
    const table = document.getElementById("plantTable");
    if (!table) return;

    table.innerHTML = `
        <tr>
            <th>Select</th>
            <th>Name</th>
            <th>Type</th>
            <th>Date Planted</th>
            <th>Watering Schedule</th>
            <th>Harvest Yield</th>
        </tr>`;

    //add plant info for each plant in table
    plants.forEach(plant => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="radio" name="plantSelect" value="${plant.name}"></td>
            <td>${plant.name}</td>
            <td>${plant.type}</td>
            <td>${plant.datePlanted || 'N/A'}</td>
            <td>${plant.wateringSchedule || 'N/A'}</td>
            <td>${plant.harvestYield || 'N/A'}</td>
        `;
        table.appendChild(row);
    });
}

window.onload = fetchPlants;