import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Initial Supabase session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(formatSupabaseUser(session.user));
                setLoading(false);
            } else {
                checkLocalBackendAuth();
            }
        }).catch(() => {
            checkLocalBackendAuth();
        });

        // 2. Real-time Supabase auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(formatSupabaseUser(session.user));
            } else if (!user) {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const formatSupabaseUser = (sbUser) => {
        return {
            id: sbUser.id,
            email: sbUser.email,
            username: sbUser.user_metadata?.username || sbUser.email?.split('@')[0],
            fullName: sbUser.user_metadata?.full_name || sbUser.email,
            role: sbUser.user_metadata?.role || 'ADMIN'
        };
    };

    const checkLocalBackendAuth = async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (emailOrUsername, password) => {
        let email = emailOrUsername;
        if (!email.includes('@')) {
            email = `${emailOrUsername}@rectracker.com`;
        }

        // Try Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            // Fallback to local Spring Boot API login
            try {
                const res = await api.post('/auth/login', { username: emailOrUsername, password });
                const backendUser = res.data.user;
                setUser(backendUser);
                return { user: backendUser };
            } catch (backendErr) {
                throw new Error(error.message || 'Invalid username/email or password');
            }
        }

        const authUser = formatSupabaseUser(data.user);
        setUser(authUser);
        return { user: authUser };
    };

    const register = async (userData) => {
        const email = userData.email || `${userData.username}@rectracker.com`;

        // Register in Supabase
        const { data, error } = await supabase.auth.signUp({
            email,
            password: userData.password,
            options: {
                data: {
                    full_name: userData.fullName,
                    username: userData.username,
                    role: userData.role || 'RECRUITER'
                }
            }
        });

        // Also sync registration with local Spring Boot backend
        try {
            await api.post('/auth/register', userData);
        } catch (backendErr) {
            console.warn('Backend user registration sync:', backendErr.message);
        }

        if (error) {
            throw new Error(error.message);
        }

        return { user: data.user };
    };

    const logout = async () => {
        try {
            await supabase.auth.signOut();
            await api.post('/auth/logout');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, checkLocalBackendAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
