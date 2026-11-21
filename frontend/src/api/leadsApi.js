const BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Wraps fetch so every call returns JSON or throws an Error with a readable message
async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("Cannot reach the server. Check that the backend is running.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || "Request failed");
    error.fieldErrors = data.errors; // present for validation errors
    throw error;
  }
  return data;
}

export function fetchLeads({ search = "", status = "" } = {}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (status) params.set("status", status);
  return request(`/leads?${params.toString()}`);
}

export const fetchStats = () => request("/leads/stats");
export const createLead = (lead) => request("/leads", { method: "POST", body: JSON.stringify(lead) });
export const updateLead = (id, lead) => request(`/leads/${id}`, { method: "PUT", body: JSON.stringify(lead) });
export const deleteLead = (id) => request(`/leads/${id}`, { method: "DELETE" });
