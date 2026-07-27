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

    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <header className="navbar-sticky-wrapper">
            <nav className="navbar navbar-expand-lg navbar-minimal">
                <div className="container-fluid px-lg-4">
                    {/* Brand */}
                    <Link className="navbar-brand-minimal me-lg-4" to="/dashboard">
                        <div className="brand-icon-sq">
                            <i className="fa-solid fa-layer-group"></i>
                        </div>
                        <span className="brand-text">RecTracker</span>
                        <span className="brand-badge">Enterprise</span>
                    </Link>

                    {/* Mobile Toggler */}
                    <button 
                        className="navbar-toggler border-0 shadow-none px-2" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#navbarMain"
                        aria-controls="navbarMain"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <i className="fa-solid fa-bars-staggered text-secondary fs-5"></i>
                    </button>

                    {/* Navigation Links */}
                    <div className="collapse navbar-collapse" id="navbarMain">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav-pills-minimal gap-lg-1">
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => `nav-link-minimal ${isActive ? 'active' : ''}`} to="/dashboard">
                                    <i className="fa-solid fa-chart-pie me-2"></i>
                                    <span>Dashboard</span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => `nav-link-minimal ${isActive ? 'active' : ''}`} to="/candidates">
                                    <i className="fa-solid fa-user-group me-2"></i>
                                    <span>Candidates</span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => `nav-link-minimal ${isActive ? 'active' : ''}`} to="/interviews">
                                    <i className="fa-solid fa-calendar-alt me-2"></i>
                                    <span>Interviews</span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => `nav-link-minimal ${isActive ? 'active' : ''}`} to="/feedbacks">
                                    <i className="fa-solid fa-clipboard-check me-2"></i>
                                    <span>Feedbacks</span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => `nav-link-minimal ${isActive ? 'active' : ''}`} to="/offers">
                                    <i className="fa-solid fa-file-contract me-2"></i>
                                    <span>Offers</span>
                                </NavLink>
                            </li>
                        </ul>

                        {/* Right User Actions */}
                        <div className="d-flex align-items-center gap-3 pt-2 pt-lg-0">
                            <div className="dropdown">
                                <button 
                                    className="btn user-profile-btn dropdown-toggle d-flex align-items-center gap-2" 
                                    type="button" 
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <div className="avatar-circle">
                                        {getInitials(user.fullName || user.email)}
                                    </div>
                                    <div className="d-none d-sm-flex flex-column text-start lh-1">
                                        <span className="user-name-text">{user.fullName || 'User'}</span>
                                        <span className="user-role-sub">{user.role || 'ADMIN'}</span>
                                    </div>
                                    <i className="fa-solid fa-chevron-down text-muted fs-xs ms-1"></i>
                                </button>

                                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-minimal shadow-sm border mt-2">
                                    <li className="px-3 py-2 border-bottom bg-light-subtle">
                                        <p className="fw-semibold mb-0 text-dark small">{user.fullName}</p>
                                        <p className="text-muted mb-0 small text-truncate" style={{ maxWidth: '200px' }}>{user.email}</p>
                                    </li>
                                    <li>
                                        <a className="dropdown-item py-2 small d-flex align-items-center gap-2" href="http://localhost:8080/h2-console" target="_blank" rel="noreferrer">
                                            <i className="fa-solid fa-database text-muted"></i>
                                            <span>H2 Database Console</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item py-2 small d-flex align-items-center gap-2" href="http://localhost:8080/api/candidates" target="_blank" rel="noreferrer">
                                            <i className="fa-solid fa-code text-muted"></i>
                                            <span>REST API Status</span>
                                        </a>
                                    </li>
                                    <li><hr className="dropdown-divider my-1" /></li>
                                    <li>
                                        <button className="dropdown-item py-2 small text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                            <span>Sign Out</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
