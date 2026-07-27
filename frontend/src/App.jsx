import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CandidateListPage from './pages/CandidateListPage';
import CandidateDetailPage from './pages/CandidateDetailPage';
import CandidateFormPage from './pages/CandidateFormPage';
import InterviewListPage from './pages/InterviewListPage';
import FeedbackListPage from './pages/FeedbackListPage';
import OfferListPage from './pages/OfferListPage';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    {/* Public Auth Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected Application Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/candidates" element={<CandidateListPage />} />
                        <Route path="/candidates/new" element={<CandidateFormPage />} />
                        <Route path="/candidates/:id" element={<CandidateDetailPage />} />
                        <Route path="/candidates/:id/edit" element={<CandidateFormPage />} />
                        <Route path="/interviews" element={<InterviewListPage />} />
                        <Route path="/feedbacks" element={<FeedbackListPage />} />
                        <Route path="/offers" element={<OfferListPage />} />
                    </Route>

                    {/* Default Redirect */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;
