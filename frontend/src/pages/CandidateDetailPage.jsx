import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const CandidateDetailPage = () => {
    const { id } = useParams();
    const [candidate, setCandidate] = useState(null);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCandidateDetail();
    }, [id]);

    const fetchCandidateDetail = async () => {
        try {
            const [candRes, intRes] = await Promise.all([
                api.get(`/candidates/${id}`),
                api.get(`/interviews?candidateId=${id}`)
            ]);
            setCandidate(candRes.data);
            setInterviews(intRes.data);
        } catch (err) {
            console.error('Error fetching candidate details:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex align-items-center justify-content-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    if (!candidate) {
        return (
            <div className="container py-5 text-center">
                <h3>Candidate Not Found</h3>
                <Link to="/candidates" className="btn btn-primary-custom mt-3">Back to Directory</Link>
            </div>
        );
    }

    return (
        <div className="container-fluid px-lg-4 py-4" style={{ maxWidth: '1100px' }}>
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
                <div>
                    <Link to="/candidates" className="text-decoration-none text-muted fw-semibold">
                        <i className="fa-solid fa-arrow-left me-1"></i> Back to Directory
                    </Link>
                    <h3 className="fw-bold mb-1 text-dark mt-2">{candidate.fullName}</h3>
                    <span className={`badge badge-status badge-${candidate.status.toLowerCase()}`}>{candidate.status}</span>
                </div>
                <div className="d-flex gap-2">
                    {candidate.resumePath && (
                        <a
                            href={`http://localhost:8080/api/candidates/${candidate.id}/resume`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline-primary fw-semibold rounded-3"
                        >
                            <i className="fa-solid fa-download me-1"></i> Download Resume
                        </a>
                    )}
                    <Link to="/interviews" className="btn btn-primary-custom">
                        <i className="fa-solid fa-calendar-plus me-1"></i> Schedule Interview
                    </Link>
                    <Link to="/offers" className="btn btn-success fw-semibold rounded-3 text-white">
                        <i className="fa-solid fa-file-contract me-1"></i> Extend Offer
                    </Link>
                </div>
            </div>

            <div className="row g-4">
                {/* Left Info Panel */}
                <div className="col-lg-5">
                    <div className="card card-custom mb-4">
                        <div className="card-header card-header-custom">
                            <span><i className="fa-solid fa-address-card me-2 text-primary"></i>Personal Information</span>
                            <Link to={`/candidates/${candidate.id}/edit`} className="btn btn-sm btn-outline-secondary">
                                <i className="fa-solid fa-pen-to-square"></i> Edit
                            </Link>
                        </div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item px-0 d-flex justify-content-between">
                                    <span className="text-muted"><i className="fa-regular fa-envelope me-2"></i>Email</span>
                                    <strong className="text-dark">{candidate.email}</strong>
                                </li>
                                <li className="list-group-item px-0 d-flex justify-content-between">
                                    <span className="text-muted"><i className="fa-solid fa-phone me-2"></i>Phone</span>
                                    <strong className="text-dark">{candidate.phone}</strong>
                                </li>
                                <li className="list-group-item px-0 d-flex justify-content-between">
                                    <span className="text-muted"><i className="fa-solid fa-briefcase me-2"></i>Target Role</span>
                                    <strong className="text-dark">{candidate.targetRole}</strong>
                                </li>
                                <li className="list-group-item px-0 d-flex justify-content-between">
                                    <span className="text-muted"><i className="fa-solid fa-building me-2"></i>Current Company</span>
                                    <strong className="text-dark">{candidate.currentCompany || 'N/A'}</strong>
                                </li>
                                <li className="list-group-item px-0 d-flex justify-content-between">
                                    <span className="text-muted"><i className="fa-solid fa-user-clock me-2"></i>Experience</span>
                                    <strong className="text-dark">{candidate.yearsOfExperience} Years</strong>
                                </li>
                                {candidate.expectedCtc && (
                                    <li className="list-group-item px-0 d-flex justify-content-between">
                                        <span className="text-muted"><i className="fa-solid fa-indian-rupee-sign me-2"></i>Expected CTC</span>
                                        <strong className="text-dark">₹ {candidate.expectedCtc.toLocaleString()}</strong>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="card card-custom">
                        <div className="card-header card-header-custom">
                            <span><i className="fa-solid fa-code me-2 text-indigo"></i>Technical Skills & Competencies</span>
                        </div>
                        <div className="card-body">
                            <p className="card-text text-secondary mb-0">{candidate.skills}</p>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Interview History */}
                <div className="col-lg-7">
                    <div className="card card-custom">
                        <div className="card-header card-header-custom">
                            <span><i className="fa-solid fa-timeline me-2 text-success"></i>Interview Evaluation Log</span>
                        </div>
                        <div className="card-body p-0">
                            <div className="list-group list-group-flush">
                                {interviews.map((i) => (
                                    <div key={i.id} className="list-group-item p-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="fw-bold mb-0 text-dark">
                                                <span className="badge bg-indigo text-white me-2">{i.roundType}</span>
                                                Interviewer: <span>{i.interviewerName}</span>
                                            </h6>
                                            <span className={`badge badge-status badge-${i.status.toLowerCase()}`}>{i.status}</span>
                                        </div>
                                        <div className="small text-muted mb-2">
                                            <i className="fa-regular fa-clock me-1"></i> {new Date(i.scheduledAt).toLocaleString()}
                                            {i.locationOrLink && (
                                                <span className="ms-3">
                                                    <i className="fa-solid fa-link me-1"></i>
                                                    <a href={i.locationOrLink} target="_blank" rel="noreferrer" className="text-decoration-none">Meeting Link</a>
                                                </span>
                                            )}
                                        </div>
                                        {i.notes && <p className="small text-secondary mb-2 bg-light p-2 rounded">{i.notes}</p>}
                                    </div>
                                ))}
                                {interviews.length === 0 && (
                                    <div className="text-center text-muted py-5">
                                        <i className="fa-solid fa-calendar-xmark fs-2 mb-2 text-secondary"></i>
                                        <p className="mb-0">No interview rounds scheduled for this candidate yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateDetailPage;
