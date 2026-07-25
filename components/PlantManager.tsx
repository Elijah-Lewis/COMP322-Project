"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import PlantForm from "@/components/PlantForm";
import PlantTable from "@/components/PlantTable";
import PlantUpdateForm from "@/components/PlantUpdateForm";

type Plant = {
  id: number;
  name: string;
  type: string;
  datePlanted: string;
  wateringSchedule: string;
  harvestYield: string;
};

type PlantFormValues = {
  name: string;
  type: string;
  datePlanted: string;
  wateringSchedule: string;
  harvestYield: string;
};

const emptyForm: PlantFormValues = {
  name: "",
  type: "",
  datePlanted: "",
  wateringSchedule: "",
  harvestYield: "",
};

export default function PlantManager() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlantName, setSelectedPlantName] = useState<string | null>(
    null,
  );
  const [newPlant, setNewPlant] = useState<PlantFormValues>(emptyForm);
  const [updatedType, setUpdatedType] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedPlant = useMemo(
    () => plants.find((plant) => plant.name === selectedPlantName) ?? null,
    [plants, selectedPlantName],
  );
  const isInitialLoading = loading && plants.length === 0;

  useEffect(() => {
    void loadPlants();
  }, []);

  useEffect(() => {
    setUpdatedType(selectedPlant?.type ?? "");
  }, [selectedPlant]);

  async function loadPlants() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/plants", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to fetch plants");
      }

      const data = (await response.json()) as Plant[];
      setPlants(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load plants.",
      );
    } finally {
      setLoading(false);
    }
  }

  function updateNewPlant(field: keyof PlantFormValues, value: string) {
    setNewPlant((current) => ({ ...current, [field]: value }));
  }

  async function handleAddPlant(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlant),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to create plant.");
      }

      setPlants((current) => [...current, payload]);
      setNewPlant(emptyForm);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to create plant.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdatePlant(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedPlantName) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/plants", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetName: selectedPlantName, updatedType }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to update plant.");
      }

      setPlants((current) =>
        current.map((plant) =>
          plant.name === selectedPlantName
            ? { ...plant, type: updatedType }
            : plant,
        ),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to update plant.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletePlant() {
    if (!selectedPlantName) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/plants", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetName: selectedPlantName }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to delete plant.");
      }

      setPlants((current) =>
        current.filter((plant) => plant.name !== selectedPlantName),
      );
      setSelectedPlantName(null);
      setUpdatedType("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to delete plant.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        plantCount={plants.length}
        selectedPlantName={selectedPlant?.name ?? null}
        onRefresh={loadPlants}
        onClearSelection={() => setSelectedPlantName(null)}
        loading={loading}
      />

      <main className="content">
        <header className="hero hero-compact">
          <p className="eyebrow">Next.js migration</p>
          <h1>Manage plants with React state and route handlers</h1>
        </header>

        {error ? <div className="alert">{error}</div> : null}

        {isInitialLoading ? (
          <div className="content-grid" aria-busy="true">
            <section className="panel skeleton-panel">
              <div className="skeleton-line skeleton-kicker" />
              <div className="skeleton-line skeleton-heading" />
              <div className="skeleton-grid">
                <div className="skeleton-line" />
                <div className="skeleton-line" />
                <div className="skeleton-line" />
                <div className="skeleton-line" />
                <div className="skeleton-line" />
              </div>
            </section>

            <section className="panel skeleton-panel">
              <div className="skeleton-line skeleton-kicker" />
              <div className="skeleton-line skeleton-heading" />
              <div className="skeleton-table">
                <div className="skeleton-line" />
                <div className="skeleton-line" />
                <div className="skeleton-line" />
                <div className="skeleton-line" />
                <div className="skeleton-line" />
              </div>
            </section>
          </div>
        ) : (
          <div className="content-grid">
            <div className="stack">
              <PlantForm
                values={newPlant}
                onChange={updateNewPlant}
                onSubmit={handleAddPlant}
                submitting={saving}
              />
              <PlantUpdateForm
                selectedPlantName={selectedPlantName}
                updatedType={updatedType}
                onUpdatedTypeChange={setUpdatedType}
                onSubmit={handleUpdatePlant}
                onDelete={handleDeletePlant}
                busy={saving}
              />
            </div>

            <PlantTable
              plants={plants}
              selectedPlantName={selectedPlantName}
              onSelectPlant={setSelectedPlantName}
            />
          </div>
        )}
      </main>
    </div>
  );
}
