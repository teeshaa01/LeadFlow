const ITEMS = [
  { key: "total", label: "Total leads" },
  { key: "New", label: "New" },
  { key: "Contacted", label: "Contacted" },
  { key: "Qualified", label: "Qualified" },
  { key: "Lost", label: "Lost" },
];

function StatsBar({ stats }) {
  return (
    <section className="stats" aria-label="Lead summary">
      {ITEMS.map((item) => (
        <div className="stat" key={item.key}>
          <span className="stat-label">{item.label}</span>
          <span className="stat-value">{stats ? stats[item.key] : "–"}</span>
        </div>
      ))}
    </section>
  );
}

export default StatsBar;
