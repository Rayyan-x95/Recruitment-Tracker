import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';

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
    const [analytics, setAnalytics] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [analyticsRes, candidateRes, interviewRes] = await Promise.allSettled([
                api.get('/analytics'),
                api.get('/candidates'),
                api.get('/interviews')
            ]);

            if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value.data);
            if (candidateRes.status === 'fulfilled') setCandidates(candidateRes.value.data.slice(0, 5));
            if (interviewRes.status === 'fulfilled') {
                setInterviews(interviewRes.value.data.filter(i => i.status === 'SCHEDULED').slice(0, 5));
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex align-items-center justify-content-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading Dashboard...</span>
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

    return (
        <div className="container-fluid px-lg-4 py-4">
            {/* Header Actions */}
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
                <div>
                    <h3 className="fw-bold mb-1 text-dark">
                        <i className="fa-solid fa-gauge-high text-primary me-2"></i>Recruitment Analytics Dashboard
                    </h3>
                    <p className="text-muted mb-0">Real-time pipeline metrics, visual analytics, and upcoming schedules.</p>
                </div>
                <div className="d-flex gap-2">
                    <Link to="/candidates/new" className="btn btn-primary-custom">
                        <i className="fa-solid fa-user-plus me-1"></i> Register Candidate
                    </Link>
                    <Link to="/interviews" className="btn btn-outline-primary fw-semibold rounded-3">
                        <i className="fa-solid fa-calendar-plus me-1"></i> Schedule Interview
                    </Link>
                    <Link to="/offers" className="btn btn-outline-dark fw-semibold rounded-3">
                        <i className="fa-solid fa-file-contract me-1"></i> Job Offers
                    </Link>
                </div>
            </div>

            {/* KPI Metric Cards */}
            <div className="row g-3 mb-4">
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card candidates">
                        <div className="stat-icon"><i className="fa-solid fa-users"></i></div>
                        <div className="stat-value">{analytics?.totalCandidates || 0}</div>
                        <div className="stat-label">Total Candidates</div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card interviews">
                        <div className="stat-icon"><i className="fa-solid fa-calendar-check"></i></div>
                        <div className="stat-value">{analytics?.activeInterviews || 0}</div>
                        <div className="stat-label">Active Interviews</div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card offers">
                        <div className="stat-icon"><i className="fa-solid fa-file-signature"></i></div>
                        <div className="stat-value">{analytics?.pendingOffers || 0}</div>
                        <div className="stat-label">Pending Offers</div>
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="stat-card hires">
                        <div className="stat-icon"><i className="fa-solid fa-user-check"></i></div>
                        <div className="stat-value">{analytics?.hiresCount || 0}</div>
                        <div className="stat-label">Hired Candidates ({analytics?.offerAcceptanceRate || 0}%)</div>
                    </div>
                </div>
            </div>

            {/* Visual Charts Row */}
            <div className="row g-4 mb-4">
                <div className="col-lg-7">
                    <div className="card card-custom h-100">
                        <div className="card-header card-header-custom">
                            <span><i className="fa-solid fa-filter me-2 text-indigo"></i>Candidate Pipeline Breakdown</span>
                            <span className="badge bg-light text-dark fw-bold">Live Status</span>
                        </div>
                        <div className="card-body" style={{ minHeight: '300px' }}>
                            <Bar data={funnelData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card card-custom h-100">
                        <div className="card-header card-header-custom">
                            <span><i className="fa-solid fa-chart-pie me-2 text-indigo"></i>Offer Acceptance Status</span>
                        </div>
                        <div className="card-body d-flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                            <Doughnut data={offerData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tables Row */}
            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card card-custom">
                        <div className="card-header card-header-custom">
                            <span><i className="fa-solid fa-clock me-2 text-primary"></i>Upcoming Scheduled Interviews</span>
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
                                    {interviews.map(i => (
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
                            <span><i className="fa-solid fa-user-group me-2 text-success"></i>Recent Candidate Applications</span>
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
                                    {candidates.map(c => (
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
        </div>
    );
};

export default DashboardPage;
