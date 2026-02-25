import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { GraduationCap, Search, RefreshCcw, Calendar } from 'lucide-react';

const AdmittedStudents = () => {
    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const API_URL = 'http://localhost:3000/api/dashboard/confirmed-admissions';

    useEffect(() => {
        fetchAdmittedStudents();
    }, []);

    const fetchAdmittedStudents = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL);
            setAdmissions(res.data);
        } catch (error) {
            console.error("Error fetching admitted students", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAdmissions = admissions.filter(adm =>
        adm.admissionNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${adm.Application?.firstName} ${adm.Application?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div className="fade-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Admitted Students</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Search and view all students who have successfully joined the institution.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="search-bar" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        width: '300px'
                    }}>
                        <Search size={18} color="var(--text-muted)" />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text)',
                                outline: 'none',
                                width: '100%'
                            }}
                        />
                    </div>
                    <button onClick={fetchAdmittedStudents} className="nav-item" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', width: 'auto' }}>
                        <RefreshCcw size={18} className={loading ? 'spin' : ''} />
                    </button>
                </div>
            </header>

            <div className="glass-card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Admission #</th>
                                <th>Student Name</th>
                                <th>Program</th>
                                <th>Quota</th>
                                <th>Admission Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading records...</td></tr>
                            ) : filteredAdmissions.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No admitted students found.</td></tr>
                            ) : filteredAdmissions.map((adm) => (
                                <tr key={adm.id}>
                                    <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{adm.admissionNumber}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                background: 'rgba(99, 102, 241, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'var(--primary)',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold'
                                            }}>
                                                {adm.Application?.firstName?.[0]}{adm.Application?.lastName?.[0]}
                                            </div>
                                            {adm.Application?.firstName} {adm.Application?.lastName}
                                        </div>
                                    </td>
                                    <td>{adm.Program?.name}</td>
                                    <td>
                                        <span className="badge badge-pending" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                                            {adm.Quota?.quotaType}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            <Calendar size={14} />
                                            {new Date(adm.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: '500' }}>
                                            <GraduationCap size={16} />
                                            Admitted
                                        </div>
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

export default AdmittedStudents;
