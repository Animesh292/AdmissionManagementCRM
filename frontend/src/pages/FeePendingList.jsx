import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, RefreshCcw } from 'lucide-react';

const FeePendingList = () => {
    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const API_BASE = 'http://localhost:3000/api';

    useEffect(() => {
        fetchAdmissions();
    }, []);

    const fetchAdmissions = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:3000/api/dashboard/fee-pending`);
            setAdmissions(res.data);
        } catch (error) {
            console.error("Error fetching fee pending admissions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkPaid = async (admissionId) => {
        setActionLoading(admissionId);
        try {
            await axios.post(`${API_BASE}/fees/pay`, { admissionId });
            fetchAdmissions(); // Refresh list
        } catch (error) {
            alert("Error updating payment: " + (error.response?.data?.error || error.message));
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <motion.div className="fade-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Fee Payment Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage pending fees for students with allocated seats.</p>
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
                                <th>Fee Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading admissions...</td></tr>
                            ) : admissions.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No pending fees found.</td></tr>
                            ) : admissions.map((adm) => (
                                <tr key={adm.id}>
                                    <td>#{adm.id}</td>
                                    <td>{adm.Application?.firstName} {adm.Application?.lastName}</td>
                                    <td>{adm.Program?.name}</td>
                                    <td><span className="badge" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>{adm.Quota?.quotaType}</span></td>
                                    <td><span className="badge badge-pending">PENDING</span></td>
                                    <td>
                                        <button
                                            onClick={() => handleMarkPaid(adm.id)}
                                            disabled={actionLoading === adm.id}
                                            style={{
                                                backgroundColor: 'var(--success)',
                                                color: 'white',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            <CreditCard size={14} />
                                            {actionLoading === adm.id ? 'Processing...' : 'Mark Paid'}
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

export default FeePendingList;
