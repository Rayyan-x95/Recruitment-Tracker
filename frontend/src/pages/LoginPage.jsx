import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await login(usernameOrEmail, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || err.response?.data?.message || 'Invalid login credentials');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-dark">
                        <i className="fa-solid fa-briefcase text-primary me-2"></i>RecTracker
                    </h2>
                    <p className="text-muted mb-2">Sign in to your Recruitment Portal</p>
                    <span className="badge bg-indigo-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 fw-bold small">
                        <i className="fa-solid fa-bolt me-1"></i> Powered by Supabase Auth
                    </span>
                </div>

                {error && (
                    <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                        <i className="fa-solid fa-circle-exclamation me-2"></i>{error}
                        <button type="button" className="btn-close" onClick={() => setError('')}></button>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email or Username</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light"><i className="fa-solid fa-user text-muted"></i></span>
                            <input
                                type="text"
                                className="form-control"
                                value={usernameOrEmail}
                                onChange={(e) => setUsernameOrEmail(e.target.value)}
                                placeholder="name@example.com or username"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">Password</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light"><i className="fa-solid fa-lock text-muted"></i></span>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary-custom w-100 py-2 mb-3" disabled={submitting}>
                        {submitting ? 'Signing In...' : 'Sign In with Supabase'} <i className="fa-solid fa-right-to-bracket ms-1"></i>
                    </button>
                </form>

                <div className="text-center mt-3">
                    <span className="text-muted">Don't have an account?</span>
                    <Link to="/register" className="fw-bold text-decoration-none text-indigo ms-1">Register here</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
