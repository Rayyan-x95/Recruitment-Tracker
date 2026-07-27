import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top">
            <div className="container-fluid px-lg-4">
                <Link className="navbar-brand" to="/dashboard">
                    <i className="fa-solid fa-briefcase text-indigo"></i> RecTracker
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarMain">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/dashboard">
                                <i className="fa-solid fa-chart-line me-1"></i> Dashboard
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/candidates">
                                <i className="fa-solid fa-users me-1"></i> Candidates
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/interviews">
                                <i className="fa-solid fa-calendar-check me-1"></i> Interviews
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/feedbacks">
                                <i className="fa-solid fa-comment-dots me-1"></i> Feedbacks
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/offers">
                                <i className="fa-solid fa-file-signature me-1"></i> Offers
                            </NavLink>
                        </li>
                    </ul>

                    <div className="d-flex align-items-center gap-3">
                        <div className="dropdown">
                            <button className="btn user-dropdown-btn dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                <i className="fa-solid fa-circle-user me-1"></i> 
                                <span>{user.fullName}</span>
                                <span className="badge bg-indigo ms-1 text-uppercase">{user.role}</span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                                <li>
                                    <div className="dropdown-header">
                                        <strong>{user.email}</strong>
                                    </div>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                                        <i className="fa-solid fa-right-from-bracket me-2"></i> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
