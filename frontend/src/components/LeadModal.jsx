import { useEffect, useState } from "react";
import { SOURCES, STATUSES } from "../constants";

const EMPTY_FORM = { name: "", email: "", phone: "", company: "", source: "", status: "New" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Mirrors the backend rules so users get instant feedback
function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  else if (form.name.trim().length < 2) errors.name = "Name must be at least 2 characters";

  if (!form.email.trim()) errors.email = "Email is required";
  else if (!EMAIL_PATTERN.test(form.email.trim())) errors.email = "Enter a valid email address";

  const digits = form.phone.replace(/\D/g, "");
  if (!form.phone.trim()) errors.phone = "Phone is required";
  else if (!/^\+?[\d\s\-()]+$/.test(form.phone.trim()) || digits.length < 7 || digits.length > 15) {
    errors.phone = "Enter a valid phone number (7-15 digits)";
  }

  if (!form.company.trim()) errors.company = "Company is required";
  if (!form.source) errors.source = "Choose a source";
  return errors;
}

function Field({ label, name, error, children }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function LeadModal({ lead, onSave, onClose }) {
  const isEditing = Boolean(lead);
  const [form, setForm] = useState(lead ? { ...EMPTY_FORM, ...lead } : EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && !saving && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, saving]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const foundErrors = validate(form);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) return;

    setSaving(true);
    setFormError("");
    try {
      await onSave(form);
    } catch (error) {
      if (error.fieldErrors) setErrors(error.fieldErrors);
      setFormError(error.message);
      setSaving(false);
    }
  }

  const inputClass = (name) => `input ${errors[name] ? "input-invalid" : ""}`;

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && !saving && onClose()}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="lead-modal-title">
        <h2 id="lead-modal-title">{isEditing ? "Edit lead" : "Add lead"}</h2>
        <form onSubmit={handleSubmit} noValidate>
          {formError && <div className="alert alert-error">{formError}</div>}
          <div className="form-grid">
            <Field label="Name" name="name" error={errors.name}>
              <input id="name" name="name" className={inputClass("name")} value={form.name} onChange={handleChange} autoFocus />
            </Field>
            <Field label="Company" name="company" error={errors.company}>
              <input id="company" name="company" className={inputClass("company")} value={form.company} onChange={handleChange} />
            </Field>
            <Field label="Email" name="email" error={errors.email}>
              <input id="email" name="email" type="email" className={inputClass("email")} value={form.email} onChange={handleChange} />
            </Field>
            <Field label="Phone" name="phone" error={errors.phone}>
              <input id="phone" name="phone" type="tel" className={inputClass("phone")} value={form.phone} onChange={handleChange} />
            </Field>
            <Field label="Source" name="source" error={errors.source}>
              <select id="source" name="source" className={inputClass("source")} value={form.source} onChange={handleChange}>
                <option value="">Select source</option>
                {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Status" name="status" error={errors.status}>
              <select id="status" name="status" className={inputClass("status")} value={form.status} onChange={handleChange}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <div className="dialog-actions">
            <button type="button" className="btn" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : isEditing ? "Save changes" : "Add lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LeadModal;
