import { useCallback, useEffect, useState } from "react";
import * as api from "./api/leadsApi";
import StatsBar from "./components/StatsBar";
import Toolbar from "./components/Toolbar";
import LeadTable from "./components/LeadTable";
import LeadModal from "./components/LeadModal";
import ConfirmDialog from "./components/ConfirmDialog";
import Toast from "./components/Toast";

function App() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [modalLead, setModalLead] = useState(undefined); // undefined = closed, null = add, object = edit
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  // Wait until the user stops typing before calling the API
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      setLeads(await api.fetchLeads({ search: debouncedSearch, status: statusFilter }));
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter]);

  const loadStats = useCallback(async () => {
    try {
      setStats(await api.fetchStats());
    } catch {
      // The table already shows connection errors, so the cards just stay empty
    }
  }, []);

  useEffect(() => { loadLeads(); }, [loadLeads]);
  useEffect(() => { loadStats(); }, [loadStats]);

  function refreshAll() {
    loadLeads();
    loadStats();
  }

  async function handleSave(formData) {
    const isEditing = Boolean(modalLead);
    if (isEditing) await api.updateLead(modalLead._id, formData);
    else await api.createLead(formData);
    setModalLead(undefined);
    setToast({ type: "success", message: isEditing ? "Lead updated" : "Lead added" });
    refreshAll();
  }

  async function handleDelete() {
    try {
      await api.deleteLead(leadToDelete._id);
      setToast({ type: "success", message: "Lead deleted" });
      refreshAll();
    } catch (error) {
      setToast({ type: "error", message: error.message });
    }
    setLeadToDelete(null);
  }

  const isFiltering = Boolean(debouncedSearch || statusFilter);

  function renderTableArea() {
    if (loadError) {
      return (
        <div className="state">
          <p className="state-title">Couldn’t load leads</p>
          <p className="muted">{loadError}</p>
          <button className="btn" onClick={refreshAll}>Try again</button>
        </div>
      );
    }
    if (loading && leads.length === 0) return <div className="state muted">Loading leads…</div>;
    if (leads.length === 0) {
      return isFiltering ? (
        <div className="state">
          <p className="state-title">No matching leads</p>
          <p className="muted">Try a different name or status.</p>
        </div>
      ) : (
        <div className="state">
          <p className="state-title">No leads yet</p>
          <p className="muted">Add your first lead to start tracking it here.</p>
          <button className="btn btn-primary" onClick={() => setModalLead(null)}>Add lead</button>
        </div>
      );
    }
    return (
      <div className={loading ? "table-wrap is-loading" : "table-wrap"}>
        <LeadTable leads={leads} onEdit={setModalLead} onDelete={setLeadToDelete} />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <span className="brand">LeadFlow</span>
          <span className="topbar-note">Lead management</span>
        </div>
      </header>

      <main className="container">
        <StatsBar stats={stats} />
        <section className="panel">
          <Toolbar
            search={search}
            onSearchChange={setSearch}
            status={statusFilter}
            onStatusChange={setStatusFilter}
            onAdd={() => setModalLead(null)}
          />
          {renderTableArea()}
        </section>
      </main>

      {modalLead !== undefined && (
        <LeadModal lead={modalLead} onSave={handleSave} onClose={() => setModalLead(undefined)} />
      )}
      {leadToDelete && (
        <ConfirmDialog lead={leadToDelete} onConfirm={handleDelete} onCancel={() => setLeadToDelete(null)} />
      )}
      {toast && <Toast toast={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}

export default App;
