import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const InterviewListPage = () => {
    const [interviews, setInterviews] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        candidateId: '',
        roundType: 'TECHNICAL_1',
        interviewerName: '',
        scheduledAt: '',
        locationOrLink: '',
        status: 'SCHEDULED',
        notes: ''
    });

    useEffect(() => {
        fetchInterviews();
        fetchCandidates();
    }, []);

    const fetchInterviews = async () => {
        try {
            const res = await api.get('/interviews');
            setInterviews(res.data);
        } catch (err) {
            console.error('Error fetching interviews:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCandidates = async () => {
        try {
            const res = await api.get('/candidates');
            setCandidates(res.data);
        } catch (err) {
            console.error('Error fetching candidates list:', err);
        }
    };

    const handleOpenModal = (interview = null) => {
        if (interview) {
            setFormData({
                id: interview.id,
                candidateId: interview.candidateId,
                roundType: interview.roundType,
                interviewerName: interview.interviewerName,
                scheduledAt: interview.scheduledAt ? interview.scheduledAt.substring(0, 16) : '',
                locationOrLink: interview.locationOrLink || '',
                status: interview.status || 'SCHEDULED',
                notes: interview.notes || ''
            });
        } else {
            setFormData({
                id: null,
                candidateId: candidates.length > 0 ? candidates[0].id : '',
                roundType: 'TECHNICAL_1',
                interviewerName: '',
                scheduledAt: '',
                locationOrLink: '',
                status: 'SCHEDULED',
                notes: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                await api.put(`/interviews/${formData.id}`, formData);
            } else {
                await api.post('/interviews', formData);
            }
            setShowModal(false);
            fetchInterviews();
        } catch (err) {
            console.error('Error saving interview schedule:', err);
            alert('Error saving interview schedule');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Cancel this interview?')) return;
        try {
            await api.delete(`/interviews/${id}`);
            fetchInterviews();
        } catch (err) {
            console.error('Failed to delete interview:', err);
            alert('Failed to delete interview');
        }
    };

    return (
        <div className="container-fluid px-lg-4 py-4">
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
                <div>
                    <h3 className="fw-bold mb-1 text-dark">
                        Interview Management
                    </h3>
                    <p className="text-muted mb-0">Schedule interview rounds, assign interviewers, and track evaluations.</p>
                </div>
                <div>
                    <button className="btn btn-primary-custom" onClick={() => handleOpenModal()}>
                        <i className="fa-solid fa-calendar-plus me-1"></i> Schedule Interview
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
                                    <th>ID</th>
                                    <th>Candidate ID</th>
                                    <th>Round</th>
                                    <th>Interviewer</th>
                                    <th>Scheduled Time</th>
                                    <th>Meeting Link / Location</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {interviews.map((i) => (
                                    <tr key={i.id}>
                                        <td className="fw-bold">#{i.id}</td>
                                        <td className="fw-bold">#{i.candidateId}</td>
                                        <td><span className="badge bg-indigo text-white">{i.roundType}</span></td>
                                        <td>{i.interviewerName}</td>
                                        <td>{new Date(i.scheduledAt).toLocaleString()}</td>
                                        <td>
                                            {i.locationOrLink && i.locationOrLink.startsWith('http') ? (
                                                <a href={i.locationOrLink} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-info py-0 px-2 rounded-2">
                                                    <i className="fa-solid fa-video me-1"></i> Join Meeting
                                                </a>
                                            ) : (
                                                i.locationOrLink || <span className="text-muted small">N/A</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`badge badge-status badge-${i.status.toLowerCase()}`}>{i.status}</span>
                                        </td>
                                        <td className="text-end">
                                            <div className="btn-group btn-group-sm">
                                                <button onClick={() => handleOpenModal(i)} className="btn btn-outline-primary" title="Edit">
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                                <button onClick={() => handleDelete(i.id)} className="btn btn-outline-danger" title="Delete">
                                                    <i className="fa-solid fa-xmark"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {interviews.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="text-center text-muted py-5">
                                            <i className="fa-solid fa-calendar-xmark fs-2 mb-2 text-secondary"></i>
                                            <p className="mb-0 fw-semibold">No interviews scheduled yet.</p>
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
                                <h5 className="modal-title fw-bold">{formData.id ? 'Edit Interview' : 'Schedule Interview'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Select Candidate *</label>
                                        <select
                                            className="form-select"
                                            value={formData.candidateId}
                                            onChange={(e) => setFormData({ ...formData, candidateId: e.target.value })}
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
                                            <label className="form-label fw-semibold">Round Type *</label>
                                            <select
                                                className="form-select"
                                                value={formData.roundType}
                                                onChange={(e) => setFormData({ ...formData, roundType: e.target.value })}
                                            >
                                                <option value="HR">HR Screening</option>
                                                <option value="TECHNICAL_1">Technical 1</option>
                                                <option value="TECHNICAL_2">Technical 2</option>
                                                <option value="SYSTEM_DESIGN">System Design</option>
                                                <option value="MANAGERIAL">Managerial</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Interviewer Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.interviewerName}
                                                onChange={(e) => setFormData({ ...formData, interviewerName: e.target.value })}
                                                placeholder="e.g. David Kim"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Date & Time *</label>
                                            <input
                                                type="datetime-local"
                                                className="form-control"
                                                value={formData.scheduledAt}
                                                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">Status</label>
                                            <select
                                                className="form-select"
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            >
                                                <option value="SCHEDULED">Scheduled</option>
                                                <option value="COMPLETED">Completed</option>
                                                <option value="PASSED">Passed</option>
                                                <option value="FAILED">Failed</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Meeting URL / Room</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.locationOrLink}
                                            onChange={(e) => setFormData({ ...formData, locationOrLink: e.target.value })}
                                            placeholder="https://meet.google.com/abc-defg-hij"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Notes / Agenda</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            placeholder="Topics to evaluate..."
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary-custom">Save Interview</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewListPage;
