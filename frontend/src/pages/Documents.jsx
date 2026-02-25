import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FileSearch, CheckCircle, XCircle, RefreshCcw } from 'lucide-react';

const Documents = () => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const API_BASE = 'http://localhost:3000/api/dashboard';

    useEffect(() => {
        fetchApplicants();
    }, []);

    const fetchApplicants = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/pending-documents`);
            setApplicants(res.data);
        } catch (error) {
            console.error("Error fetching pending documents", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (applicantId) => {
        setActionLoading(applicantId);
        try {
            await axios.post('http://localhost:3000/api/applications/verify-documents', { applicantId });
            alert("Documents verified successfully!");
            fetchApplicants();
        } catch (error) {
            alert("Error verifying documents: " + (error.response?.data?.message || error.message));
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <motion.div className="fade-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Document Verification</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Review and verify documents uploaded by applicants.</p>
                </div>
                <button onClick={fetchApplicants} className="nav-item" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <RefreshCcw size={18} className={loading ? 'spin' : ''} />
                </button>
            </header>

            <div className="glass-card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Applicant ID</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Pending Documents</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading applicants...</td></tr>
                            ) : applicants.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No pending documents found.</td></tr>
                            ) : applicants.map((app) => (
                                <tr key={app.id}>
                                    <td>#{app.id}</td>
                                    <td>{app.firstName} {app.lastName}</td>
                                    <td>{app.email}</td>
                                    <td>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {app.Documents?.map(doc => (
                                                <span key={doc.id} className="badge badge-pending">{doc.name}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleVerify(app.id)}
                                            disabled={actionLoading === app.id}
                                            style={{
                                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                                color: 'var(--primary)',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                fontSize: '0.8rem',
                                                border: '1px solid var(--primary)'
                                            }}
                                        >
                                            <FileSearch size={14} />
                                            {actionLoading === app.id ? 'Verifying...' : 'Verify Documents'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </motion.div>
    );
};

export default Documents;
