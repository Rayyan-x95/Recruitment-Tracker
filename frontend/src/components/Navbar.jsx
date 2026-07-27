import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../api/axiosConfig';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        setDropdownOpen(false);
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
                        <img src="/favicon.svg" alt="RecTracker Logo" style={{ width: '36px', height: '36px', borderRadius: '10px' }} className="shadow-sm" />
                        <div className="d-flex flex-column lh-1">
                            <span className="brand-text">RecTracker</span>
                            <span className="text-muted fw-semibold" style={{ fontSize: '0.62rem', letterSpacing: '0.4px' }}>by Ninety5.in</span>
                        </div>
                    </Link>

                    {/* Mobile Toggler */}
                    <button 
                        className="navbar-toggler border-0 shadow-none px-2" 
                        type="button" 
                        onClick={() => setMobileNavOpen(!mobileNavOpen)}
                        aria-expanded={mobileNavOpen}
                        aria-label="Toggle navigation"
                    >
                        <i className="fa-solid fa-bars-staggered text-secondary fs-5"></i>
                    </button>

                    {/* Navigation Links */}
                    <div className={`collapse navbar-collapse ${mobileNavOpen ? 'show' : ''}`} id="navbarMain">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 nav-pills-minimal gap-lg-1">
                            <li className="nav-item">
                                <NavLink 
                                    className={({ isActive }) => `nav-link-minimal ${isActive ? 'active' : ''}`} 
                                    to="/dashboard"
                                    onClick={() => setMobileNavOpen(false)}
                                >
                                    <i className="fa-solid fa-chart-pie me-2"></i>
                                    <span>Dashboard</span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink 
                                    className={({ isActive }) => `nav-link-minimal ${isActive ? 'active' : ''}`} 
                                    to="/candidates"
                                    onClick={() => setMobileNavOpen(false)}
                                >
                                    <i className="fa-solid fa-user-group me-2"></i>
                                    <span>Candidates</span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink 
                                    className={({ isActive }) => `nav-link-minimal ${isActive ? 'active' : ''}`} 
                                    to="/interviews"
                                    onClick={() => setMobileNavOpen(false)}
                                >
                                    <i className="fa-solid fa-calendar-alt me-2"></i>
                                    <span>Interviews</span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink 
                                    className={({ isActive }) => `nav-link-minimal ${isActive ? 'active' : ''}`} 
                                    to="/feedbacks"
                                    onClick={() => setMobileNavOpen(false)}
                                >
                                    <i className="fa-solid fa-clipboard-check me-2"></i>
                                    <span>Feedbacks</span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink 
                                    className={({ isActive }) => `nav-link-minimal ${isActive ? 'active' : ''}`} 
                                    to="/offers"
                                    onClick={() => setMobileNavOpen(false)}
                                >
                                    <i className="fa-solid fa-file-contract me-2"></i>
                                    <span>Offers</span>
                                </NavLink>
                            </li>
                        </ul>

                        {/* Right User Actions & Profile Dropdown */}
                        <div className="d-flex align-items-center gap-3 pt-2 pt-lg-0">
                            <div className="dropdown position-relative" ref={dropdownRef}>
                                <button 
                                    className="btn user-profile-btn d-flex align-items-center gap-2" 
                                    type="button" 
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    aria-expanded={dropdownOpen}
                                >
                                    <div className="avatar-circle">
                                        {getInitials(user.fullName || user.email)}
                                    </div>
                                    <div className="d-none d-sm-flex flex-column text-start lh-1">
                                        <span className="user-name-text">{user.fullName || 'User'}</span>
                                        <span className="user-role-sub">{user.role || 'ADMIN'}</span>
                                    </div>
                                    <i className={`fa-solid fa-chevron-down text-muted fs-xs ms-1 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}></i>
                                </button>

                                <ul className={`dropdown-menu dropdown-menu-end dropdown-menu-minimal shadow-lg border mt-2 ${dropdownOpen ? 'show' : ''}`} style={{ position: 'absolute', right: 0, top: '100%', zIndex: 1050, minWidth: '260px' }}>
                                    {/* User Header */}
                                    <li className="px-3 py-2 border-bottom bg-light-subtle">
                                        <div className="d-flex align-items-center justify-content-between mb-1">
                                            <span className="fw-bold text-dark small">{user.fullName || user.username}</span>
                                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2 py-0.5" style={{ fontSize: '0.65rem' }}>
                                                {user.role || 'ADMIN'}
                                            </span>
                                        </div>
                                        <p className="text-muted mb-0 small text-truncate" style={{ maxWidth: '230px', fontSize: '0.78rem' }}>{user.email}</p>
                                    </li>

                                    {/* Quick Workplace Actions Section */}
                                    <li className="dropdown-header text-uppercase text-muted fw-bold px-3 pt-2 pb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                                        Quick Actions
                                    </li>
                                    <li>
                                        <Link className="dropdown-item py-2 small d-flex align-items-center gap-2" to="/candidates/new" onClick={() => setDropdownOpen(false)}>
                                            <i className="fa-solid fa-user-plus text-primary"></i>
                                            <span>Register Candidate</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item py-2 small d-flex align-items-center gap-2" to="/interviews" onClick={() => setDropdownOpen(false)}>
                                            <i className="fa-solid fa-calendar-plus text-info"></i>
                                            <span>Schedule Interview</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item py-2 small d-flex align-items-center gap-2" to="/feedbacks" onClick={() => setDropdownOpen(false)}>
                                            <i className="fa-solid fa-clipboard-check text-warning"></i>
                                            <span>Submit Scorecard</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item py-2 small d-flex align-items-center gap-2" to="/offers" onClick={() => setDropdownOpen(false)}>
                                            <i className="fa-solid fa-file-signature text-success"></i>
                                            <span>Generate Job Offer</span>
                                        </Link>
                                    </li>

                                    <li><hr className="dropdown-divider my-1" /></li>

                                    {/* System & Developer Tools Section */}
                                    <li className="dropdown-header text-uppercase text-muted fw-bold px-3 pt-1 pb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                                        Developer & System Tools
                                    </li>
                                    <li>
                                        <a className="dropdown-item py-2 small d-flex align-items-center gap-2" href={`${API_BASE_URL.replace('/api', '')}/h2-console`} target="_blank" rel="noreferrer" onClick={() => setDropdownOpen(false)}>
                                            <i className="fa-solid fa-database text-secondary"></i>
                                            <span>H2 Database Console</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item py-2 small d-flex align-items-center gap-2" href={`${API_BASE_URL}/candidates`} target="_blank" rel="noreferrer" onClick={() => setDropdownOpen(false)}>
                                            <i className="fa-solid fa-code text-secondary"></i>
                                            <span>REST API Endpoints</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item py-2 small d-flex align-items-center gap-2" href="https://ninety5.in" target="_blank" rel="noreferrer" onClick={() => setDropdownOpen(false)}>
                                            <i className="fa-solid fa-globe text-primary"></i>
                                            <span>Ninety5.in Platform</span>
                                        </a>
                                    </li>

                                    <li><hr className="dropdown-divider my-1" /></li>

                                    {/* Sign Out Section */}
                                    <li>
                                        <button className="dropdown-item py-2 small text-danger fw-semibold d-flex align-items-center gap-2" onClick={handleLogout}>
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
