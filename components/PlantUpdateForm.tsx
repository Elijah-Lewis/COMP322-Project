type PlantUpdateFormProps = {
  selectedPlantName: string | null;
  updatedType: string;
  onUpdatedTypeChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
  busy: boolean;
};

export default function PlantUpdateForm({
  selectedPlantName,
  updatedType,
  onUpdatedTypeChange,
  onSubmit,
  onDelete,
  busy,
}: PlantUpdateFormProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Selected record</p>
          <h2>Edit or delete</h2>
        </div>
        <p className="panel-note">Pick a plant in the table first.</p>
      </div>

      <form className="form-grid compact" onSubmit={onSubmit}>
        <label>
          <span>Selected plant</span>
          <input type="text" value={selectedPlantName ?? ''} readOnly placeholder="None selected" />
        </label>
        <label>
          <span>New type</span>
          <input
            type="text"
            value={updatedType}
            onChange={(event) => onUpdatedTypeChange(event.target.value)}
            placeholder="Vegetable"
            disabled={!selectedPlantName}
            required
          />
        </label>

        <div className="form-actions">
          <button type="submit" disabled={!selectedPlantName || busy}>
            {busy ? 'Updating...' : 'Update type'}
          </button>
          <button type="button" className="secondary danger" onClick={onDelete} disabled={!selectedPlantName || busy}>
            Delete plant
          </button>
        </div>
      </form>
    </section>
  );
}
