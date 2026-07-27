import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api, { API_BASE_URL } from '../api/axiosConfig';

const CandidateListPage = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    const [keyword, setKeyword] = useState('');
    const [status, setStatus] = useState('');
    const [minExp, setMinExp] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDir, setSortDir] = useState('desc');

    const fetchCandidates = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (keyword) params.keyword = keyword;
            if (status) params.status = status;
            if (minExp) params.minExp = minExp;
            if (sortBy) params.sortBy = sortBy;
            if (sortDir) params.sortDir = sortDir;

            const res = await api.get('/candidates', { params });
            setCandidates(res.data);
        } catch (err) {
            console.error('Error fetching candidates:', err);
        } finally {
            setLoading(false);
        }
    }, [keyword, status, minExp, sortBy, sortDir]);

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchCandidates();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this candidate?')) return;
        try {
            await api.delete(`/candidates/${id}`);
            fetchCandidates();
        } catch (err) {
            console.error('Failed to delete candidate:', err);
            alert('Failed to delete candidate');
        }
    };

    const formatCurrency = (val) => {
        if (!val) return 'N/A';
        return `₹ ${(val / 100000).toFixed(1)} LPA`;
    };

    return (
        <div className="container-fluid px-lg-4 py-4">
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
                <div>
                    <h3 className="fw-bold mb-1 text-dark">
                        <i className="fa-solid fa-users text-primary me-2"></i>Candidate Directory
                    </h3>
                    <p className="text-muted mb-0">Search, filter, and sort candidate records, real technical profiles, and resumes.</p>
                </div>
                <div>
                    <Link to="/candidates/new" className="btn btn-primary-custom">
                        <i className="fa-solid fa-user-plus me-1"></i> Register New Candidate
                    </Link>
                </div>
            </div>

            {/* Filter Controls */}
            <div className="card card-custom mb-4">
                <div className="card-body">
                    <form onSubmit={handleSearchSubmit} className="row g-3 align-items-end">
                        <div className="col-lg-4 col-md-6">
                            <label className="form-label fw-semibold">Search Keyword</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light"><i className="fa-solid fa-magnifying-glass text-muted"></i></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="Name, Email, Skills, Target Role, Company..."
                                />
                            </div>
                        </div>

                        <div className="col-lg-2 col-md-3">
                            <label className="form-label fw-semibold">Pipeline Status</label>
                            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="">All Statuses</option>
                                <option value="APPLIED">Applied</option>
                                <option value="SCREENING">Screening</option>
                                <option value="INTERVIEWING">Interviewing</option>
                                <option value="OFFERED">Offered</option>
                                <option value="HIRED">Hired</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>

                        <div className="col-lg-2 col-md-3">
                            <label className="form-label fw-semibold">Min Exp (Yrs)</label>
                            <input
                                type="number"
                                step="0.5"
                                className="form-control"
                                value={minExp}
                                onChange={(e) => setMinExp(e.target.value)}
                                placeholder="e.g. 3.0"
                            />
                        </div>

                        <div className="col-lg-2 col-md-6">
                            <label className="form-label fw-semibold">Sort By</label>
                            <div className="input-group">
                                <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="createdAt">Date Applied</option>
                                    <option value="name">Candidate Name</option>
                                    <option value="experience">Experience</option>
                                    <option value="status">Pipeline Status</option>
                                </select>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')}
                                    title={`Sort Direction: ${sortDir.toUpperCase()}`}
                                >
                                    <i className={`fa-solid fa-arrow-${sortDir === 'asc' ? 'up-a-z' : 'down-z-a'}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="col-lg-2 col-md-6 d-flex gap-2">
                            <button type="submit" className="btn btn-primary-custom w-100">
                                <i className="fa-solid fa-filter me-1"></i> Filter
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => { setKeyword(''); setStatus(''); setMinExp(''); setSortBy('createdAt'); setSortDir('desc'); }}
                                title="Reset Filters"
                            >
                                <i className="fa-solid fa-rotate"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Candidate Table */}
            <div className="card card-custom">
                <div className="card-body p-0 table-responsive">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>
                    ) : (
                        <table className="table table-custom align-middle">
                            <thead>
                                <tr>
                                    <th>Candidate</th>
                                    <th>Contact</th>
                                    <th>Target Role & Company</th>
                                    <th>Skills Tech Stack</th>
                                    <th>Exp / Expected CTC</th>
                                    <th>Status</th>
                                    <th>Resume</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {candidates.map((c) => (
                                    <tr key={c.id}>
                                        <td>
                                            <Link to={`/candidates/${c.id}`} className="fw-bold text-decoration-none text-dark fs-6">
                                                {c.fullName}
                                            </Link>
                                            <div className="small text-muted">ID: #{c.id}</div>
                                        </td>
                                        <td>
                                            <div><i className="fa-regular fa-envelope me-1 text-muted"></i>{c.email}</div>
                                            <div className="small text-muted"><i className="fa-solid fa-phone me-1"></i>{c.phone}</div>
                                        </td>
                                        <td>
                                            <div className="fw-bold text-dark">{c.targetRole}</div>
                                            <div className="small text-secondary">{c.currentCompany ? `Current: ${c.currentCompany}` : 'N/A'}</div>
                                        </td>
                                        <td style={{ maxWidth: '280px' }}>
                                            {c.skills.split(',').slice(0, 4).map((skill, i) => (
                                                <span key={i} className="skill-pill">{skill.trim()}</span>
                                            ))}
                                            {c.skills.split(',').length > 4 && (
                                                <span className="small text-muted">+{c.skills.split(',').length - 4} more</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="fw-bold">{c.yearsOfExperience} Yrs</div>
                                            <div className="small text-success fw-semibold">{formatCurrency(c.expectedCtc)}</div>
                                        </td>
                                        <td>
                                            <span className={`badge badge-status badge-${c.status.toLowerCase()}`}>{c.status}</span>
                                        </td>
                                        <td>
                                            {c.resumePath ? (
                                                <a
                                                    href={`${API_BASE_URL}/candidates/${c.id}/resume`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="btn btn-sm btn-outline-primary py-0 px-2 rounded-2"
                                                >
                                                    <i className="fa-solid fa-file-arrow-down me-1"></i> Download
                                                </a>
                                            ) : (
                                                <span className="text-muted small">No File</span>
                                            )}
                                        </td>
                                        <td className="text-end">
                                            <div className="btn-group btn-group-sm">
                                                <Link to={`/candidates/${c.id}`} className="btn btn-outline-secondary" title="View Profile">
                                                    <i className="fa-solid fa-eye"></i>
                                                </Link>
                                                <Link to={`/candidates/${c.id}/edit`} className="btn btn-outline-primary" title="Edit Profile">
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </Link>
                                                <button onClick={() => handleDelete(c.id)} className="btn btn-outline-danger" title="Delete">
                                                    <i className="fa-solid fa-trash-can"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {candidates.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="text-center text-muted py-5">
                                            <i className="fa-solid fa-user-slash fs-2 mb-2 text-secondary"></i>
                                            <p className="mb-0 fw-semibold">No candidate records found matching your query.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CandidateListPage;
