import { useEffect, useState } from "react";

function ConfirmDialog({ lead, onConfirm, onCancel }) {
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && !deleting && onCancel();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel, deleting]);

  async function handleConfirm() {
    setDeleting(true);
    await onConfirm(); // parent closes the dialog when finished
    setDeleting(false);
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && !deleting && onCancel()}>
      <div className="dialog dialog-small" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <h2 id="confirm-title">Delete lead</h2>
        <p>
          Delete <strong>{lead.name}</strong> from {lead.company}? This can’t be undone.
        </p>
        <div className="dialog-actions">
          <button className="btn" onClick={onCancel} disabled={deleting}>Cancel</button>
          <button className="btn btn-danger" onClick={handleConfirm} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete lead"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
