import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const CandidateFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [candidate, setCandidate] = useState({
        fullName: '',
        email: '',
        phone: '',
        skills: '',
        yearsOfExperience: 0,
        currentCompany: '',
        targetRole: '',
        expectedCtc: '',
        status: 'APPLIED'
    });
    const [resumeFile, setResumeFile] = useState(null);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isEdit) {
            fetchCandidate();
        }
    }, [id]);

    const fetchCandidate = async () => {
        try {
            const res = await api.get(`/candidates/${id}`);
            setCandidate(res.data);
        } catch (err) {
            setError('Failed to fetch candidate details');
        }
    };

    const handleChange = (e) => {
        setCandidate({ ...candidate, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const formData = new FormData();
            const candidateBlob = new Blob([JSON.stringify(candidate)], { type: 'application/json' });
            formData.append('candidate', candidateBlob);

            if (resumeFile) {
                formData.append('resumeFile', resumeFile);
            }

            if (isEdit) {
                await api.put(`/candidates/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/candidates', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            navigate('/candidates');
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving candidate profile');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container py-4" style={{ maxWidth: '800px' }}>
            <div className="card card-custom">
                <div className="card-header card-header-custom">
                    <span>{isEdit ? 'Edit Candidate Profile' : 'Register New Candidate'}</span>
                    <Link to="/candidates" className="btn btn-sm btn-outline-secondary">
                        <i className="fa-solid fa-arrow-left me-1"></i> Back to Directory
                    </Link>
                </div>

                <div className="card-body p-4">
                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                            <i className="fa-solid fa-triangle-exclamation me-2"></i>{error}
                            <button type="button" className="btn-close" onClick={() => setError('')}></button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Full Name *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    className="form-control"
                                    value={candidate.fullName}
                                    onChange={handleChange}
                                    placeholder="e.g. Aarav Sharma"
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={candidate.email}
                                    onChange={handleChange}
                                    placeholder="aarav.sharma@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Phone Number *</label>
                                <input
                                    type="text"
                                    name="phone"
                                    className="form-control"
                                    value={candidate.phone}
                                    onChange={handleChange}
                                    placeholder="+91 9876543210"
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Years of Experience *</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    name="yearsOfExperience"
                                    className="form-control"
                                    value={candidate.yearsOfExperience}
                                    onChange={handleChange}
                                    placeholder="e.g. 4.5"
                                    required
                                />
                            </div>
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Target Job Role *</label>
                                <input
                                    type="text"
                                    name="targetRole"
                                    className="form-control"
                                    value={candidate.targetRole}
                                    onChange={handleChange}
                                    placeholder="e.g. Senior Java Developer"
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Current / Previous Company</label>
                                <input
                                    type="text"
                                    name="currentCompany"
                                    className="form-control"
                                    value={candidate.currentCompany || ''}
                                    onChange={handleChange}
                                    placeholder="e.g. TCS Tech Solutions"
                                />
                            </div>
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Expected CTC (₹ / Annum)</label>
                                <input
                                    type="number"
                                    step="10000"
                                    name="expectedCtc"
                                    className="form-control"
                                    value={candidate.expectedCtc || ''}
                                    onChange={handleChange}
                                    placeholder="e.g. 1400000"
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Pipeline Status</label>
                                <select
                                    name="status"
                                    className="form-select"
                                    value={candidate.status}
                                    onChange={handleChange}
                                >
                                    <option value="APPLIED">Applied</option>
                                    <option value="SCREENING">Screening</option>
                                    <option value="INTERVIEWING">Interviewing</option>
                                    <option value="OFFERED">Offered</option>
                                    <option value="HIRED">Hired</option>
                                    <option value="REJECTED">Rejected</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Key Skills (Comma Separated) *</label>
                            <textarea
                                name="skills"
                                className="form-control"
                                rows="3"
                                value={candidate.skills}
                                onChange={handleChange}
                                placeholder="Java 21, Spring Boot, MySQL, REST APIs, Microservices"
                                required
                            ></textarea>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold">Resume Attachment (PDF / DOCX / TXT)</label>
                            <input
                                type="file"
                                className="form-control"
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={handleFileChange}
                            />
                            {candidate.resumeFilename && (
                                <small className="text-muted d-block mt-1">
                                    Current file: <strong>{candidate.resumeFilename}</strong>
                                </small>
                            )}
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            <Link to="/candidates" className="btn btn-outline-secondary px-4">Cancel</Link>
                            <button type="submit" className="btn btn-primary-custom px-4" disabled={submitting}>
                                <i className="fa-solid fa-floppy-disk me-1"></i>
                                {submitting ? 'Saving...' : 'Save Candidate Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CandidateFormPage;
