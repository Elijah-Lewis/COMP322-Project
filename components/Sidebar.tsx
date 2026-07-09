type SidebarProps = {
  plantCount: number;
  selectedPlantName: string | null;
  onRefresh: () => void;
  onClearSelection: () => void;
  loading: boolean;
};

export default function Sidebar({
  plantCount,
  selectedPlantName,
  onRefresh,
  onClearSelection,
  loading,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div>
        <p className="eyebrow">Agri-tech dashboard</p>
        <h1>Plant manager</h1>
        <p className="sidebar-copy">
          React components now handle the UI while Next.js route handlers manage
          the database CRUD flow.
        </p>
      </div>

      <div className="sidebar-card">
        <span className="label">Plants loaded</span>
        <strong>{plantCount}</strong>
      </div>

      <div className="sidebar-card">
        <span className="label">Selected plant</span>
        <strong>{selectedPlantName ?? 'None selected'}</strong>
      </div>

      <div className="sidebar-actions">
        <button type="button" onClick={onRefresh} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh data'}
        </button>
        <button type="button" className="secondary" onClick={onClearSelection}>
          Clear selection
        </button>
      </div>
    </aside>
  );
}
