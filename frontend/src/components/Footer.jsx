import React from 'react';
import { API_BASE_URL } from '../api/axiosConfig';

const Footer = () => {
    return (
        <footer className="footer-minimal mt-auto border-top bg-white py-4">
            <div className="container-fluid px-lg-4">
                <div className="row align-items-center gy-3">
                    {/* Left: Brand & Status */}
                    <div className="col-md-6 d-flex flex-wrap align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <div className="brand-icon-sm">
                                <i className="fa-solid fa-layer-group"></i>
                            </div>
                            <div className="d-flex flex-column lh-1">
                                <span className="fw-bold text-dark fs-6">RecTracker</span>
                                <a href="https://ninety5.in" target="_blank" rel="noreferrer" className="text-decoration-none text-muted fw-semibold" style={{ fontSize: '0.65rem' }}>A Product of Ninety5.in</a>
                            </div>
                        </div>
                        <span className="text-muted d-none d-sm-inline">|</span>
                        <div className="d-flex align-items-center gap-2 text-muted small">
                            <span className="status-dot-green"></span>
                            <span className="fw-semibold text-dark">All Systems Operational</span>
                        </div>
                    </div>

                    {/* Right: Technical Specs & Copyright */}
                    <div className="col-md-6 text-md-end text-muted small">
                        <div className="d-flex flex-wrap align-items-center justify-content-md-end gap-3 mb-1">
                            <a href="https://ninety5.in" target="_blank" rel="noreferrer" className="footer-link fw-bold text-primary">Ninety5.in</a>
                            <span>•</span>
                            <a href={`${API_BASE_URL.replace('/api', '')}/h2-console`} target="_blank" rel="noreferrer" className="footer-link">H2 Console</a>
                            <span>•</span>
                            <a href={`${API_BASE_URL}/candidates`} target="_blank" rel="noreferrer" className="footer-link">REST Endpoints</a>
                            <span>•</span>
                            <span className="text-secondary fw-semibold">Spring Boot 3 & React 19</span>
                        </div>
                        <p className="mb-0 text-secondary" style={{ fontSize: '0.78rem' }}>
                            &copy; {new Date().getFullYear()} RecTracker • A Product of <a href="https://ninety5.in" target="_blank" rel="noreferrer" className="text-decoration-none fw-bold text-dark">Ninety5.in</a>. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
