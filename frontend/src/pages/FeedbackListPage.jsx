import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const FeedbackListPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        interviewId: '',
        candidateId: '',
        interviewerName: '',
        technicalRating: 3,
        communicationRating: 3,
        problemSolvingRating: 3,
        overallRecommendation: 'HIRE',
        comments: ''
    });

    useEffect(() => {
        fetchFeedbacks();
        fetchInterviews();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const res = await api.get('/feedbacks');
            setFeedbacks(res.data);
        } catch (err) {
            console.error('Error fetching feedbacks:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchInterviews = async () => {
        try {
            const res = await api.get('/interviews');
            setInterviews(res.data);
        } catch (err) {
            console.error('Error fetching interviews:', err);
        }
    };

    const handleOpenModal = () => {
        const firstInt = interviews[0];
        setFormData({
            interviewId: firstInt ? firstInt.id : '',
            candidateId: firstInt ? firstInt.candidateId : '',
            interviewerName: firstInt ? firstInt.interviewerName : '',
            technicalRating: 4,
            communicationRating: 4,
            problemSolvingRating: 4,
            overallRecommendation: 'HIRE',
            comments: ''
        });
        setShowModal(true);
    };

    const handleInterviewChange = (e) => {
        const intId = Number(e.target.value);
        const selected = interviews.find(i => i.id === intId);
        if (selected) {
            setFormData({
                ...formData,
                interviewId: selected.id,
                candidateId: selected.candidateId,
                interviewerName: selected.interviewerName
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/feedbacks', formData);
            setShowModal(false);
            fetchFeedbacks();
        } catch (err) {
            alert('Failed to submit feedback');
        }
    };

    return (
        <div className="container-fluid px-lg-4 py-4">
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
                <div>
                    <h3 className="fw-bold mb-1 text-dark">
                        <i className="fa-solid fa-comment-dots text-primary me-2"></i>Interview Evaluations & Feedback
                    </h3>
                    <p className="text-muted mb-0">Detailed rating scores, technical assessments, and final recommendations.</p>
                </div>
                <div>
                    <button className="btn btn-primary-custom" onClick={handleOpenModal}>
                        <i className="fa-solid fa-pen-to-square me-1"></i> Submit Feedback
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
                                    <th>Feedback ID</th>
                                    <th>Candidate ID</th>
                                    <th>Interviewer</th>
                                    <th>Tech Rating</th>
                                    <th>Comm Rating</th>
                                    <th>Problem Solving</th>
                                    <th>Average Rating</th>
                                    <th>Recommendation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feedbacks.map((fb) => (
                                    <tr key={fb.id}>
                                        <td className="fw-bold">#{fb.id}</td>
                                        <td className="fw-bold">#{fb.candidateId}</td>
                                        <td>{fb.interviewerName}</td>
                                        <td><span className="badge bg-light text-dark border">{fb.technicalRating} / 5</span></td>
                                        <td><span className="badge bg-light text-dark border">{fb.communicationRating} / 5</span></td>
                                        <td><span className="badge bg-light text-dark border">{fb.problemSolvingRating} / 5</span></td>
                                        <td>
                                            <strong className="text-indigo">
                                                {((fb.technicalRating + fb.communicationRating + fb.problemSolvingRating) / 3).toFixed(1)} ★
                                            </strong>
                                        </td>
                                        <td>
                                            <span className={`badge ${fb.overallRecommendation.includes('HIRE') ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                                                {fb.overallRecommendation}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {feedbacks.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="text-center text-muted py-5">
                                            <i className="fa-solid fa-comments-question fs-2 mb-2 text-secondary"></i>
                                            <p className="mb-0 fw-semibold">No interview feedbacks submitted yet.</p>
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
                                <h5 className="modal-title fw-bold">Submit Candidate Evaluation Feedback</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Select Interview Round *</label>
                                        <select
                                            className="form-select"
                                            value={formData.interviewId}
                                            onChange={handleInterviewChange}
                                            required
                                        >
                                            <option value="">-- Choose Interview --</option>
                                            {interviews.map(i => (
                                                <option key={i.id} value={i.id}>
                                                    Interview #{i.id} (Candidate #{i.candidateId} - {i.roundType})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Interviewer Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.interviewerName}
                                            onChange={(e) => setFormData({ ...formData, interviewerName: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">Technical (1-5)</label>
                                            <select
                                                className="form-select"
                                                value={formData.technicalRating}
                                                onChange={(e) => setFormData({ ...formData, technicalRating: Number(e.target.value) })}
                                            >
                                                <option value="5">5 - Outstanding</option>
                                                <option value="4">4 - Above Avg</option>
                                                <option value="3">3 - Satisfactory</option>
                                                <option value="2">2 - Below Avg</option>
                                                <option value="1">1 - Poor</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">Communication</label>
                                            <select
                                                className="form-select"
                                                value={formData.communicationRating}
                                                onChange={(e) => setFormData({ ...formData, communicationRating: Number(e.target.value) })}
                                            >
                                                <option value="5">5 - Outstanding</option>
                                                <option value="4">4 - Above Avg</option>
                                                <option value="3">3 - Satisfactory</option>
                                                <option value="2">2 - Below Avg</option>
                                                <option value="1">1 - Poor</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">Problem Solving</label>
                                            <select
                                                className="form-select"
                                                value={formData.problemSolvingRating}
                                                onChange={(e) => setFormData({ ...formData, problemSolvingRating: Number(e.target.value) })}
                                            >
                                                <option value="5">5 - Outstanding</option>
                                                <option value="4">4 - Above Avg</option>
                                                <option value="3">3 - Satisfactory</option>
                                                <option value="2">2 - Below Avg</option>
                                                <option value="1">1 - Poor</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Overall Recommendation *</label>
                                        <select
                                            className="form-select"
                                            value={formData.overallRecommendation}
                                            onChange={(e) => setFormData({ ...formData, overallRecommendation: e.target.value })}
                                        >
                                            <option value="STRONG_HIRE">Strong Hire</option>
                                            <option value="HIRE">Hire</option>
                                            <option value="HOLD">Hold</option>
                                            <option value="NO_HIRE">No Hire</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Detailed Notes & Feedback</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={formData.comments}
                                            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                                            placeholder="Candidate's strengths, domain knowledge..."
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary-custom">Submit Feedback</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackListPage;
