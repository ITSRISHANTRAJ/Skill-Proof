/**
 * StatusBadge — reusable pill for application status
 * @param {string} status - 'pending' | 'approved' | 'rejected' | 'assigned' | 'submitted'
 */
export default function StatusBadge({ status }) {
    const map = {
        pending: { label: 'Pending', cls: 'status--pending' },
        approved: { label: 'Approved', cls: 'status--approved' },
        rejected: { label: 'Rejected', cls: 'status--rejected' },
        assigned: { label: 'Assigned', cls: 'status--pending' },
        submitted: { label: 'Submitted', cls: 'status--info' },
        evaluated: { label: 'Evaluated', cls: 'status--info' },
    };
    const { label, cls } = map[status] || { label: status, cls: 'status--info' };
    return <span className={`status-badge ${cls}`}>{label}</span>;
}
