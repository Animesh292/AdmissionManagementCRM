import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { CheckSquare, UserCheck, RefreshCcw } from 'lucide-react';

const AdmissionConfirmation = () => {
    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null);

    useEffect(() => {
        fetchAdmissions();
    }, []);

    const fetchAdmissions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/dashboard/paid-admissions');
            setAdmissions(res.data);
        } catch (error) {
            console.error("Error fetching paid admissions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (admissionId) => {
        setActionLoading(admissionId);
        setStatusMessage(null);
        try {
            await api.post('/admission/confirm', { admissionId });
            alert('Admission confirmed successfully!');
            fetchAdmissions(); // Refresh list
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;
            alert("Error confirming admission: " + errorMsg);
            // Even on error (like already confirmed), refresh the list to remove stale records
            fetchAdmissions();
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <motion.div className="fade-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Admission Confirmation</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Finalize admissions for students who have paid their fees.</p>
                </div>
                <button onClick={fetchAdmissions} className="nav-item" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <RefreshCcw size={18} className={loading ? 'spin' : ''} />
                </button>
            </header>

            <div className="glass-card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Admission ID</th>
                                <th>Student Name</th>
                                <th>Program</th>
                                <th>Quota</th>
                                <th>Payment Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading admissions...</td></tr>
                            ) : admissions.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No paid admissions awaiting confirmation.</td></tr>
                            ) : admissions.map((adm) => (
                                <tr key={adm.id}>
                                    <td>#{adm.id}</td>
                                    <td>{adm.Application?.firstName} {adm.Application?.lastName}</td>
                                    <td>{adm.Program?.name}</td>
                                    <td>{adm.Quota?.quotaType}</td>
                                    <td><span className="badge badge-success">PAID</span></td>
                                    <td>
                                        <button
                                            onClick={() => handleConfirm(adm.id)}
                                            disabled={actionLoading === adm.id}
                                            style={{
                                                backgroundColor: 'var(--primary)',
                                                color: 'white',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            <UserCheck size={14} />
                                            {actionLoading === adm.id ? 'Confirming...' : 'Confirm Admission'}
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

export default AdmissionConfirmation;
