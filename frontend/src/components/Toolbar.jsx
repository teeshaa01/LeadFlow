import { STATUSES } from "../constants";

function Toolbar({ search, onSearchChange, status, onStatusChange, onAdd }) {
  return (
    <div className="toolbar">
      <input
        type="search"
        className="input search"
        placeholder="Search by name"
        aria-label="Search leads by name"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        className="input"
        aria-label="Filter by status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button className="btn btn-primary" onClick={onAdd}>Add lead</button>
    </div>
  );
}

export default Toolbar;
