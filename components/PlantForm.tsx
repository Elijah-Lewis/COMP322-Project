type PlantFormValues = {
  name: string;
  type: string;
  datePlanted: string;
  wateringSchedule: string;
  harvestYield: string;
};

type PlantFormProps = {
  values: PlantFormValues;
  onChange: (field: keyof PlantFormValues, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  submitting: boolean;
};

export default function PlantForm({
  values,
  onChange,
  onSubmit,
  submitting,
}: PlantFormProps) {
  return (
    <section className="panel">
      <div className="panel-header panel-header-compact">
        <div>
          <p className="eyebrow">Create record</p>
          <h2>Add plant</h2>
        </div>
      </div>

      <form className="form-grid" onSubmit={onSubmit}>
        <label>
          <span>Name</span>
          <input
            type="text"
            value={values.name}
            onChange={(event) => onChange("name", event.target.value)}
            placeholder="Tomato"
            required
          />
        </label>
        <label>
          <span>Type</span>
          <input
            type="text"
            value={values.type}
            onChange={(event) => onChange("type", event.target.value)}
            placeholder="Vegetable"
            required
          />
        </label>
        <label>
          <span>Date planted</span>
          <input
            type="date"
            value={values.datePlanted}
            onChange={(event) => onChange("datePlanted", event.target.value)}
            required
          />
        </label>
        <label>
          <span>Watering schedule</span>
          <input
            type="text"
            value={values.wateringSchedule}
            onChange={(event) =>
              onChange("wateringSchedule", event.target.value)
            }
            placeholder="Every 2 days"
            required
          />
        </label>
        <label>
          <span>Harvest yield</span>
          <input
            type="text"
            value={values.harvestYield}
            onChange={(event) => onChange("harvestYield", event.target.value)}
            placeholder="10 bu/acre"
            required
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Add plant"}
        </button>
      </form>
    </section>
  );
}
