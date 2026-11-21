import StatusBadge from "./StatusBadge";

function LeadTable({ leads, onEdit, onDelete }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Company</th>
          <th>Contact</th>
          <th>Source</th>
          <th>Status</th>
          <th className="actions-col"><span className="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr key={lead._id}>
            <td data-label="Name" className="cell-name">{lead.name}</td>
            <td data-label="Company">{lead.company}</td>
            <td data-label="Contact">
              <div>{lead.email}</div>
              <div className="muted">{lead.phone}</div>
            </td>
            <td data-label="Source">{lead.source}</td>
            <td data-label="Status"><StatusBadge status={lead.status} /></td>
            <td className="cell-actions">
              <button className="btn btn-link" onClick={() => onEdit(lead)}>Edit</button>
              <button className="btn btn-link btn-danger-link" onClick={() => onDelete(lead)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LeadTable;
