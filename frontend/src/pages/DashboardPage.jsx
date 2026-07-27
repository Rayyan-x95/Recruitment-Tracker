import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend
);

const DashboardPage = () => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Active Role View (defaults to user's assigned role or ADMIN)
    // Role determined strictly by user's account role selected during Signup
    const userRole = (user?.role || 'RECRUITER').toUpperCase();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [analyticsRes, candidateRes, interviewRes, feedbackRes, offerRes] = await Promise.allSettled([
                api.get('/analytics'),
                api.get('/candidates'),
                api.get('/interviews'),
                api.get('/feedbacks'),
                api.get('/offers')
            ]);

            if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value.data);
            if (candidateRes.status === 'fulfilled') setCandidates(candidateRes.value.data);
            if (interviewRes.status === 'fulfilled') setInterviews(interviewRes.value.data);
            if (feedbackRes.status === 'fulfilled') setFeedbacks(feedbackRes.value.data);
            if (offerRes.status === 'fulfilled') setOffers(offerRes.value.data);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '60vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading Dashboard...</span>
                    </div>
                    <h5 className="text-muted fw-semibold">Preparing {userRole} Dashboard...</h5>
                </div>
            </div>
        );
    }

    const candidateStatusMap = analytics?.candidatesByStatus || {};
    const offerStatusMap = analytics?.offersByStatus || {};

    const funnelData = {
        labels: ['Applied', 'Screening', 'Interviewing', 'Offered', 'Hired', 'Rejected'],
        datasets: [{
            label: 'Candidates Count',
            data: [
                candidateStatusMap['APPLIED'] || 0,
                candidateStatusMap['SCREENING'] || 0,
                candidateStatusMap['INTERVIEWING'] || 0,
                candidateStatusMap['OFFERED'] || 0,
                candidateStatusMap['HIRED'] || 0,
                candidateStatusMap['REJECTED'] || 0
            ],
            backgroundColor: ['#38bdf8', '#fbbf24', '#6366f1', '#c084fc', '#4ade80', '#f87171'],
            borderRadius: 8
        }]
    };

    const offerData = {
        labels: ['Pending', 'Accepted', 'Rejected', 'Expired'],
        datasets: [{
            data: [
                offerStatusMap['PENDING'] || 0,
                offerStatusMap['ACCEPTED'] || 0,
                offerStatusMap['REJECTED'] || 0,
                offerStatusMap['EXPIRED'] || 0
            ],
            backgroundColor: ['#f59e0b', '#10b981', '#ef4444', '#9ca3af']
        }]
    };

    const renderRoleBadge = (role) => {
        switch (role) {
            case 'ADMIN':
                return <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 rounded-pill"><i className="fa-solid fa-user-shield me-1"></i> Administrator View</span>;
            case 'RECRUITER':
                return <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill"><i className="fa-solid fa-briefcase me-1"></i> Recruiter Sourcing View</span>;
            case 'INTERVIEWER':
                return <span className="badge bg-purple-subtle text-indigo border border-indigo-subtle px-3 py-2 rounded-pill"><i className="fa-solid fa-user-pen me-1"></i> Interviewer Evaluation View</span>;
            default:
                return null;
        }
    };

    return (
        <div className="container-fluid px-lg-4 py-4">
            {/* Header & Account Role Indicator */}
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <h3 className="fw-bold mb-0 text-dark">
                            Recruitment Dashboard
                        </h3>
                        {renderRoleBadge(userRole)}
                    </div>
                    <p className="text-muted mb-0">
                        Tailored workspace for <strong>{user?.fullName || user?.username || 'User'}</strong> ({userRole} Account)
                    </p>
                </div>
            </div>

            {/* ==================== 1. ADMIN DASHBOARD ==================== */}
            {userRole === 'ADMIN' && (
                <>
                    {/* Admin Action Buttons */}
                    <div className="d-flex gap-2 mb-4">
                        <Link to="/candidates/new" className="btn btn-primary-custom">
                            <i className="fa-solid fa-user-plus me-1"></i> Register Candidate
                        </Link>
                        <Link to="/interviews" className="btn btn-outline-primary fw-semibold rounded-3">
                            <i className="fa-solid fa-calendar-plus me-1"></i> Schedule Interview
                        </Link>
                        <Link to="/offers" className="btn btn-outline-dark fw-semibold rounded-3">
                            <i className="fa-solid fa-file-contract me-1"></i> Manage Offers
                        </Link>
                    </div>

                    {/* Executive Stats Cards */}
                    <div className="row g-3 mb-4">
                        <div className="col-xl-3 col-md-6">
                            <div className="stat-card candidates">
                                <div className="stat-icon"><i className="fa-solid fa-users"></i></div>
                                <div className="stat-value">{analytics?.totalCandidates || candidates.length}</div>
                                <div className="stat-label">Total Candidates in Pipeline</div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <div className="stat-card interviews">
                                <div className="stat-icon"><i className="fa-solid fa-calendar-check"></i></div>
                                <div className="stat-value">{analytics?.activeInterviews || interviews.filter(i => i.status === 'SCHEDULED').length}</div>
                                <div className="stat-label">Active Scheduled Rounds</div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <div className="stat-card offers">
                                <div className="stat-icon"><i className="fa-solid fa-file-signature"></i></div>
                                <div className="stat-value">{analytics?.pendingOffers || offers.filter(o => o.status === 'PENDING').length}</div>
                                <div className="stat-label">Pending Job Offers</div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <div className="stat-card hires">
                                <div className="stat-icon"><i className="fa-solid fa-user-check"></i></div>
                                <div className="stat-value">{analytics?.hiresCount || candidates.filter(c => c.status === 'HIRED').length}</div>
                                <div className="stat-label">Hires ({analytics?.offerAcceptanceRate || 0}% Acceptance Rate)</div>
                            </div>
                        </div>
                    </div>

                    {/* Executive Analytics Charts */}
                    <div className="row g-4 mb-4">
                        <div className="col-lg-7">
                            <div className="card card-custom h-100">
                                <div className="card-header card-header-custom">
                                    <span><i className="fa-solid fa-filter me-2 text-indigo"></i>Candidate Pipeline Breakdown</span>
                                    <span className="badge bg-light text-dark fw-bold">Executive View</span>
                                </div>
                                <div className="card-body" style={{ minHeight: '300px' }}>
                                    <Bar data={funnelData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-5">
                            <div className="card card-custom h-100">
                                <div className="card-header card-header-custom">
                                    <span><i className="fa-solid fa-chart-pie me-2 text-indigo"></i>Offer Lifecycle Distribution</span>
                                </div>
                                <div className="card-body d-flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                                    <Doughnut data={offerData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Admin Tables */}
                    <div className="row g-4">
                        <div className="col-lg-6">
                            <div className="card card-custom">
                                <div className="card-header card-header-custom">
                                    <span><i className="fa-solid fa-clock me-2 text-primary"></i>Upcoming Scheduled Rounds</span>
                                    <Link to="/interviews" className="btn btn-sm btn-link text-decoration-none">View All</Link>
                                </div>
                                <div className="card-body p-0 table-responsive">
                                    <table className="table table-custom align-middle">
                                        <thead>
                                            <tr>
                                                <th>Candidate ID</th>
                                                <th>Round</th>
                                                <th>Interviewer</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {interviews.slice(0, 5).map(i => (
                                                <tr key={i.id}>
                                                    <td className="fw-bold">#{i.candidateId}</td>
                                                    <td><span className="badge bg-light text-dark border">{i.roundType}</span></td>
                                                    <td>{i.interviewerName}</td>
                                                    <td><span className={`badge badge-status badge-${i.status.toLowerCase()}`}>{i.status}</span></td>
                                                </tr>
                                            ))}
                                            {interviews.length === 0 && (
                                                <tr><td colSpan="4" className="text-center text-muted py-4">No upcoming interviews scheduled.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card card-custom">
                                <div className="card-header card-header-custom">
                                    <span><i className="fa-solid fa-user-group me-2 text-success"></i>Recent Candidate Sourcing</span>
                                    <Link to="/candidates" className="btn btn-sm btn-link text-decoration-none">View All</Link>
                                </div>
                                <div className="card-body p-0 table-responsive">
                                    <table className="table table-custom align-middle">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Role</th>
                                                <th>Exp</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {candidates.slice(0, 5).map(c => (
                                                <tr key={c.id}>
                                                    <td>
                                                        <Link to={`/candidates/${c.id}`} className="fw-bold text-decoration-none text-dark">{c.fullName}</Link>
                                                        <div className="small text-muted">{c.email}</div>
                                                    </td>
                                                    <td>{c.targetRole}</td>
                                                    <td>{c.yearsOfExperience} yrs</td>
                                                    <td><span className={`badge badge-status badge-${c.status.toLowerCase()}`}>{c.status}</span></td>
                                                </tr>
                                            ))}
                                            {candidates.length === 0 && (
                                                <tr><td colSpan="4" className="text-center text-muted py-4">No candidates registered yet.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ==================== 2. RECRUITER DASHBOARD ==================== */}
            {userRole === 'RECRUITER' && (
                <>
                    {/* Recruiter Banner & Actions */}
                    <div className="card border-0 bg-primary-subtle text-primary-emphasis p-4 mb-4 rounded-4 shadow-sm">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <h4 className="fw-bold mb-1"><i className="fa-solid fa-users-viewfinder me-2"></i>Recruiter Sourcing & Pipeline Operations</h4>
                                <p className="mb-0 text-muted">Manage candidate intake, progress stages, and push top talent to interview rounds.</p>
                            </div>
                            <div className="d-flex gap-2">
                                <Link to="/candidates/new" className="btn btn-primary fw-bold rounded-3">
                                    <i className="fa-solid fa-plus-circle me-1"></i> Sourced New Candidate
                                </Link>
                                <Link to="/candidates" className="btn btn-outline-primary fw-semibold rounded-3">
                                    <i className="fa-solid fa-list-check me-1"></i> Candidate Directory
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Sourcing Metrics */}
                    <div className="row g-3 mb-4">
                        <div className="col-xl-3 col-md-6">
                            <div className="stat-card candidates">
                                <div className="stat-icon"><i className="fa-solid fa-user-plus"></i></div>
                                <div className="stat-value">{candidateStatusMap['APPLIED'] || candidates.filter(c => c.status === 'APPLIED').length}</div>
                                <div className="stat-label">New Applications (Screening Pending)</div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <div className="stat-card interviews">
                                <div className="stat-icon"><i className="fa-solid fa-comments text-indigo"></i></div>
                                <div className="stat-value">{candidateStatusMap['INTERVIEWING'] || candidates.filter(c => c.status === 'INTERVIEWING').length}</div>
                                <div className="stat-label">In Active Interview Rounds</div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <div className="stat-card offers">
                                <div className="stat-icon"><i className="fa-solid fa-gift text-warning"></i></div>
                                <div className="stat-value">{candidateStatusMap['OFFERED'] || candidates.filter(c => c.status === 'OFFERED').length}</div>
                                <div className="stat-label">Offered Candidates</div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <div className="stat-card hires">
                                <div className="stat-icon"><i className="fa-solid fa-circle-check text-success"></i></div>
                                <div className="stat-value">{candidateStatusMap['HIRED'] || candidates.filter(c => c.status === 'HIRED').length}</div>
                                <div className="stat-label">Successfully Hired</div>
                            </div>
                        </div>
                    </div>

                    {/* Recruiter Active Sourcing Directory */}
                    <div className="card card-custom mb-4">
                        <div className="card-header card-header-custom">
                            <span><i className="fa-solid fa-address-book me-2 text-primary"></i>Active Candidate Sourcing Directory</span>
                            <Link to="/candidates" className="btn btn-sm btn-outline-primary">Manage All ({candidates.length})</Link>
                        </div>
                        <div className="card-body p-0 table-responsive">
                            <table className="table table-custom align-middle">
                                <thead>
                                    <tr>
                                        <th>Candidate Name</th>
                                        <th>Target Role</th>
                                        <th>Experience</th>
                                        <th>Expected CTC</th>
                                        <th>Current Pipeline Status</th>
                                        <th className="text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {candidates.slice(0, 7).map(c => (
                                        <tr key={c.id}>
                                            <td>
                                                <Link to={`/candidates/${c.id}`} className="fw-bold text-decoration-none text-dark">{c.fullName}</Link>
                                                <div className="small text-muted">{c.email} • {c.phone}</div>
                                            </td>
                                            <td><span className="badge bg-light text-dark border">{c.targetRole}</span></td>
                                            <td className="fw-semibold">{c.yearsOfExperience} Yrs</td>
                                            <td className="text-success fw-bold">₹{Number(c.expectedCtc).toLocaleString('en-IN')}</td>
                                            <td>
                                                <span className={`badge badge-status badge-${c.status.toLowerCase()}`}>{c.status}</span>
                                            </td>
                                            <td className="text-end">
                                                <Link to={`/candidates/${c.id}`} className="btn btn-sm btn-outline-secondary me-1">
                                                    <i className="fa-solid fa-eye me-1"></i> Detail
                                                </Link>
                                                <Link to="/interviews" className="btn btn-sm btn-primary-custom">
                                                    <i className="fa-solid fa-calendar me-1"></i> Schedule
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {candidates.length === 0 && (
                                        <tr><td colSpan="6" className="text-center text-muted py-4">No candidate profiles found. Click "Sourced New Candidate" to add one.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* ==================== 3. INTERVIEWER DASHBOARD ==================== */}
            {userRole === 'INTERVIEWER' && (
                <>
                    {/* Interviewer Welcome Banner */}
                    <div className="card border-0 text-white p-4 mb-4 rounded-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div>
                                <h4 className="fw-bold mb-1"><i className="fa-solid fa-user-pen me-2"></i>Interviewer Evaluation Workspace</h4>
                                <p className="mb-0 opacity-90">Review assigned candidate scorecards, conduct interviews, and submit ratings.</p>
                            </div>
                            <div className="d-flex gap-2">
                                <Link to="/feedbacks" className="btn btn-light fw-bold text-indigo rounded-3">
                                    <i className="fa-solid fa-clipboard-check me-1"></i> Submit Evaluation
                                </Link>
                                <Link to="/interviews" className="btn btn-outline-light fw-semibold rounded-3">
                                    <i className="fa-solid fa-calendar-days me-1"></i> My Schedules
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Interviewer Metrics */}
                    <div className="row g-3 mb-4">
                        <div className="col-xl-4 col-md-6">
                            <div className="stat-card interviews">
                                <div className="stat-icon"><i className="fa-solid fa-calendar-clock text-indigo"></i></div>
                                <div className="stat-value">{interviews.filter(i => i.status === 'SCHEDULED').length}</div>
                                <div className="stat-label">Upcoming Scheduled Rounds</div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-6">
                            <div className="stat-card hires">
                                <div className="stat-icon"><i className="fa-solid fa-square-check text-success"></i></div>
                                <div className="stat-value">{feedbacks.length}</div>
                                <div className="stat-label">Evaluations Completed</div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-md-6">
                            <div className="stat-card offers">
                                <div className="stat-icon"><i className="fa-solid fa-star text-warning"></i></div>
                                <div className="stat-value">
                                    {feedbacks.length > 0
                                        ? (feedbacks.reduce((acc, f) => acc + (f.technicalRating || 0), 0) / feedbacks.length).toFixed(1)
                                        : '4.8'} / 5.0
                                </div>
                                <div className="stat-label">Average Technical Score</div>
                            </div>
                        </div>
                    </div>

                    {/* Assigned Upcoming Interviews Table */}
                    <div className="row g-4 mb-4">
                        <div className="col-lg-7">
                            <div className="card card-custom h-100">
                                <div className="card-header card-header-custom">
                                    <span><i className="fa-solid fa-calendar-check me-2 text-indigo"></i>Assigned Scheduled Interviews</span>
                                    <Link to="/interviews" className="btn btn-sm btn-link text-decoration-none">View All</Link>
                                </div>
                                <div className="card-body p-0 table-responsive">
                                    <table className="table table-custom align-middle">
                                        <thead>
                                            <tr>
                                                <th>Candidate</th>
                                                <th>Round Type</th>
                                                <th>Interviewer</th>
                                                <th className="text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {interviews.slice(0, 6).map(i => (
                                                <tr key={i.id}>
                                                    <td>
                                                        <div className="fw-bold">Candidate #{i.candidateId}</div>
                                                    </td>
                                                    <td><span className="badge bg-light text-dark border">{i.roundType}</span></td>
                                                    <td className="fw-semibold text-primary">{i.interviewerName}</td>
                                                    <td className="text-end">
                                                        <Link to="/feedbacks" className="btn btn-sm btn-indigo text-white fw-semibold rounded-2" style={{ backgroundColor: '#6366f1' }}>
                                                            <i className="fa-solid fa-star me-1"></i> Rate & Evaluate
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                            {interviews.length === 0 && (
                                                <tr><td colSpan="4" className="text-center text-muted py-4">No interview rounds currently assigned.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Recent Feedback Submissions */}
                        <div className="col-lg-5">
                            <div className="card card-custom h-100">
                                <div className="card-header card-header-custom">
                                    <span><i className="fa-solid fa-comments me-2 text-success"></i>Recent Evaluation Scorecards</span>
                                    <Link to="/feedbacks" className="btn btn-sm btn-link text-decoration-none">All Evaluations</Link>
                                </div>
                                <div className="card-body p-3">
                                    {feedbacks.slice(0, 4).map(f => (
                                        <div key={f.id} className="p-3 mb-2 rounded-3 border bg-light">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <span className="fw-bold text-dark">Candidate #{f.candidateId}</span>
                                                <span className={`badge ${f.recommendation === 'STRONG_HIRE' || f.recommendation === 'HIRE' ? 'bg-success' : 'bg-danger'}`}>
                                                    {f.recommendation}
                                                </span>
                                            </div>
                                            <div className="small text-muted mb-2">
                                                Interviewer: <strong>{f.interviewerName}</strong>
                                            </div>
                                            <div className="d-flex gap-3 small text-dark">
                                                <div><i className="fa-solid fa-code text-primary me-1"></i>Tech: <strong>{f.technicalRating}/5</strong></div>
                                                <div><i className="fa-solid fa-comments text-info me-1"></i>Comm: <strong>{f.communicationRating}/5</strong></div>
                                                <div><i className="fa-solid fa-lightbulb text-warning me-1"></i>Solving: <strong>{f.problemSolvingRating}/5</strong></div>
                                            </div>
                                        </div>
                                    ))}
                                    {feedbacks.length === 0 && (
                                        <div className="text-center text-muted py-5">
                                            <i className="fa-solid fa-clipboard-list fa-2x mb-2 text-secondary"></i>
                                            <p className="mb-0">No interview scorecards submitted yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardPage;
