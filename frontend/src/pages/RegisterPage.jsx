import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        role: 'RECRUITER'
    });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await register(formData);
            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="text-center mb-3">
                    <h2 className="fw-bold text-dark">
                        <i className="fa-solid fa-user-plus text-primary me-2"></i>Create Account
                    </h2>
                    <p className="text-muted">Join the Recruitment Portal</p>
                </div>

                {error && (
                    <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                        <i className="fa-solid fa-circle-exclamation me-2"></i>{error}
                        <button type="button" className="btn-close" onClick={() => setError('')}></button>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Full Name *</label>
                        <input
                            type="text"
                            name="fullName"
                            className="form-control"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="e.g. John Doe"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email Address *</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john.doe@example.com"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Username *</label>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="johndoe"
                            required
                            minLength={3}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Password *</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="At least 6 characters"
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">User Role</label>
                        <select
                            name="role"
                            className="form-select"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="RECRUITER">Recruiter</option>
                            <option value="INTERVIEWER">Hiring Manager / Interviewer</option>
                            <option value="ADMIN">Administrator</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary-custom w-100 py-2 mb-3" disabled={submitting}>
                        {submitting ? 'Registering...' : 'Register Account'} <i className="fa-solid fa-arrow-right ms-1"></i>
                    </button>
                </form>

                <div className="text-center">
                    <span className="text-muted">Already registered?</span>
                    <Link to="/login" className="fw-bold text-decoration-none text-indigo ms-1">Sign in here</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
