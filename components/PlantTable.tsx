type Plant = {
  id: number;
  name: string;
  type: string;
  datePlanted: string;
  wateringSchedule: string;
  harvestYield: string;
};

type PlantTableProps = {
  plants: Plant[];
  selectedPlantName: string | null;
  onSelectPlant: (name: string) => void;
};

export default function PlantTable({
  plants,
  selectedPlantName,
  onSelectPlant,
}: PlantTableProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Data list</p>
          <h2>Plants</h2>
        </div>
        <p className="panel-note">Choose one plant to update or delete.</p>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Select</th>
              <th>Name</th>
              <th>Type</th>
              <th>Date Planted</th>
              <th>Watering Schedule</th>
              <th>Harvest Yield</th>
            </tr>
          </thead>
          <tbody>
            {plants.map((plant) => (
              <tr key={plant.id}>
                <td>
                  <input
                    type="radio"
                    name="plantSelect"
                    value={plant.name}
                    aria-label={`Select ${plant.name}`}
                    checked={selectedPlantName === plant.name}
                    onChange={() => onSelectPlant(plant.name)}
                  />
                </td>
                <td>{plant.name}</td>
                <td>{plant.type}</td>
                <td>{plant.datePlanted || "N/A"}</td>
                <td>{plant.wateringSchedule || "N/A"}</td>
                <td>{plant.harvestYield || "N/A"}</td>
              </tr>
            ))}
            {plants.length === 0 && (
              <tr>
                <td colSpan={6} className="empty-state">
                  No plants have been loaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
