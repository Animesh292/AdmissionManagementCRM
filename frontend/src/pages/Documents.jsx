import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { FileSearch, CheckCircle, XCircle, RefreshCcw } from 'lucide-react';

const Documents = () => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    useEffect(() => {
        fetchApplicants();
    }, []);

    const fetchApplicants = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/dashboard/pending-documents');
            setApplicants(res.data);
        } catch (error) {
            console.error("Error fetching pending documents", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewDecision = async (decision) => {
        if (!selectedApplicant) return;
        const applicantId = selectedApplicant.id;
        setActionLoading(decision);
        try {
            await api.post('/api/applications/verify-documents', { applicantId, decision });
            setSelectedApplicant(null);
            fetchApplicants();
        } catch (error) {
            alert("Error reviewing documents: " + (error.response?.data?.error || error.message));
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
                                                <span key={doc.id} className="badge badge-pending">{doc.docName}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => setSelectedApplicant(app)}
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
                                            Review Documents
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedApplicant && (
                <div
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !actionLoading) setSelectedApplicant(null);
                    }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 1000,
                        display: 'grid',
                        placeItems: 'center',
                        padding: '1rem',
                        background: 'rgba(2, 6, 23, 0.76)',
                        backdropFilter: 'blur(4px)',
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="document-review-title"
                        style={{
                            width: 'min(100%, 520px)',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            boxShadow: 'var(--shadow-lg)',
                        }}
                    >
                        <h2 id="document-review-title" style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>Review Documents</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                            Applicant #{selectedApplicant.id}: {selectedApplicant.firstName} {selectedApplicant.lastName}
                        </p>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>Pending documents</h3>
                            <ul style={{ listStyle: 'none', display: 'grid', gap: '0.5rem' }}>
                                {selectedApplicant.Documents?.map((document) => (
                                    <li key={document.id} style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '6px' }}>
                                        {document.docName}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                disabled={Boolean(actionLoading)}
                                onClick={() => handleReviewDecision('REJECT')}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.12)', color: 'var(--danger)', border: '1px solid var(--danger)' }}
                            >
                                <XCircle size={17} />
                                {actionLoading === 'REJECT' ? 'Rejecting...' : 'Reject'}
                            </button>
                            <button
                                type="button"
                                disabled={Boolean(actionLoading)}
                                onClick={() => handleReviewDecision('APPROVE')}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', borderRadius: '6px', background: 'var(--primary)', color: 'white' }}
                            >
                                <CheckCircle size={17} />
                                {actionLoading === 'APPROVE' ? 'Approving...' : 'Approve'}
                            </button>
                        </div>
                    </section>
                </div>
            )}

            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </motion.div>
    );
};

export default Documents;
