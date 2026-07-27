import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const OfferListPage = () => {
    const [offers, setOffers] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        candidateId: '',
        jobTitle: '',
        department: 'Engineering',
        baseSalary: 1200000,
        joiningDate: '',
        validUntil: '',
        status: 'PENDING'
    });

    useEffect(() => {
        fetchOffers();
        fetchCandidates();
    }, []);

    const fetchOffers = async () => {
        try {
            const res = await api.get('/offers');
            setOffers(res.data);
        } catch (err) {
            console.error('Error fetching offers:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCandidates = async () => {
        try {
            const res = await api.get('/candidates');
            setCandidates(res.data);
        } catch (err) {
            console.error('Error fetching candidates:', err);
        }
    };

    const handleOpenModal = () => {
        const firstCand = candidates[0];
        setFormData({
            candidateId: firstCand ? firstCand.id : '',
            jobTitle: firstCand ? firstCand.targetRole : 'Software Engineer',
            department: 'Engineering',
            baseSalary: firstCand && firstCand.expectedCtc ? firstCand.expectedCtc : 1200000,
            joiningDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'PENDING'
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/offers', formData);
            setShowModal(false);
            fetchOffers();
        } catch (err) {
            console.error('Failed to generate offer:', err);
            alert('Failed to generate offer');
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.patch(`/offers/${id}/status`, { status });
            fetchOffers();
        } catch (err) {
            console.error('Error updating offer status:', err);
            alert('Error updating offer status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this offer record?')) return;
        try {
            await api.delete(`/offers/${id}`);
            fetchOffers();
        } catch (err) {
            console.error('Failed to delete offer:', err);
            alert('Failed to delete offer');
        }
    };

    return (
        <div className="container-fluid px-lg-4 py-4">
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
                <div>
                    <h3 className="fw-bold mb-1 text-dark">
                        Job Offer Management
                    </h3>
                    <p className="text-muted mb-0">Issue job offers, track proposed CTC, joining dates, and offer acceptance status.</p>
                </div>
                <div>
                    <button className="btn btn-primary-custom" onClick={handleOpenModal}>
                        <i className="fa-solid fa-file-contract me-1"></i> Issue Job Offer
                    </button>
                </div>
            </div>

            <div className="card card-custom">
                <div className="card-body p-0 table-responsive">
                    {loading ? (
                        <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
                    ) : (
                        <table className="table table-custom align-middle">
                            <thead>
                                <tr>
                                    <th>Offer ID</th>
                                    <th>Candidate ID</th>
                                    <th>Offered Job Title</th>
                                    <th>Department</th>
                                    <th>Offered CTC (₹ / Annum)</th>
                                    <th>Joining Date</th>
                                    <th>Valid Until</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offers.map((o) => (
                                    <tr key={o.id}>
                                        <td className="fw-bold">#{o.id}</td>
                                        <td className="fw-bold">#{o.candidateId}</td>
                                        <td className="fw-semibold text-dark">{o.jobTitle}</td>
                                        <td>{o.department}</td>
                                        <td>
                                            <strong className="text-success">₹ {o.baseSalary.toLocaleString()}</strong>
                                        </td>
                                        <td>{new Date(o.joiningDate).toLocaleDateString()}</td>
                                        <td>{new Date(o.validUntil).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge badge-status badge-${o.status.toLowerCase()}`}>{o.status}</span>
                                        </td>
                                        <td className="text-end">
                                            <div className="btn-group btn-group-sm">
                                                {o.status === 'PENDING' && (
                                                    <>
                                                        <button onClick={() => handleStatusUpdate(o.id, 'ACCEPTED')} className="btn btn-outline-success" title="Mark Accepted">
                                                            <i className="fa-solid fa-check me-1"></i> Accept
                                                        </button>
                                                        <button onClick={() => handleStatusUpdate(o.id, 'REJECTED')} className="btn btn-outline-warning" title="Mark Rejected">
                                                            <i className="fa-solid fa-xmark me-1"></i> Reject
                                                        </button>
                                                    </>
                                                )}
                                                <button onClick={() => handleDelete(o.id)} className="btn btn-outline-danger" title="Delete">
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {offers.length === 0 && (
                                    <tr>
                                        <td colSpan="9" className="text-center text-muted py-5">
                                            <i className="fa-solid fa-file-excel fs-2 mb-2 text-secondary"></i>
                                            <p className="mb-0 fw-semibold">No job offers issued yet.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal Dialog */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Issue New Job Offer</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Select Candidate *</label>
                                        <select
                                            className="form-select"
                                            value={formData.candidateId}
                                            onChange={(e) => {
                                                const candId = Number(e.target.value);
                                                const selected = candidates.find(c => c.id === candId);
                                                setFormData({
                                                    ...formData,
                                                    candidateId: candId,
                                                    jobTitle: selected ? selected.targetRole : formData.jobTitle,
                                                    baseSalary: selected && selected.expectedCtc ? selected.expectedCtc : formData.baseSalary
                                                });
                                            }}
                                            required
                                        >
                                            <option value="">-- Select Candidate --</option>
                                            {candidates.map(c => (
                                                <option key={c.id} value={c.id}>{c.fullName} ({c.targetRole})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Offered Job Title *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.jobTitle}
                                                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Department *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.department}
                                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Offered Base Salary (₹ / Annum) *</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={formData.baseSalary}
                                                onChange={(e) => setFormData({ ...formData, baseSalary: Number(e.target.value) })}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Offer Status</label>
                                            <select
                                                className="form-select"
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            >
                                                <option value="PENDING">Pending Candidate Decision</option>
                                                <option value="ACCEPTED">Accepted</option>
                                                <option value="REJECTED">Rejected</option>
                                                <option value="EXPIRED">Expired</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Expected Joining Date *</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={formData.joiningDate}
                                                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Offer Expiry Date *</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={formData.validUntil}
                                                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary-custom">Issue Offer</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfferListPage;
