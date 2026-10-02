import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

const SeatAllocation = () => {
    const [applications, setApplications] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [quotas, setQuotas] = useState([]);
    const [selectedApp, setSelectedApp] = useState('');
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedQuota, setSelectedQuota] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [appsRes, programsRes] = await Promise.all([
                api.get('/api/applications/pending'),
                api.get('/api/programs')
            ]);
            setApplications(appsRes.data);
            setPrograms(programsRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    const handleProgramChange = async (programId) => {
        setSelectedProgram(programId);
        setSelectedQuota('');
        if (!programId) {
            setQuotas([]);
            return;
        }
        try {
            const res = await api.get(`/api/quotas/${programId}`);
            setQuotas(res.data);
        } catch (error) {
            console.error("Error fetching quotas", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedApp || !selectedProgram || !selectedQuota) {
            setMessage({ type: 'error', text: 'Please fill all fields' });
            return;
        }

        setLoading(true);
        try {
            await api.post('/admission/allocate-seat', {
                applicationId: selectedApp,
                programId: selectedProgram,
                quotaId: selectedQuota
            });
            setMessage({ type: 'success', text: 'Seat allocated successfully!' });
            setSelectedApp('');
            setSelectedProgram('');
            setSelectedQuota('');
            fetchInitialData(); // Refresh apps list
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error allocating seat' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="fade-in"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Seat Allocation</h1>
                <p style={{ color: 'var(--text-muted)' }}>Assign a program and quota to verified applicants.</p>
            </header>

            <div className="glass-card" style={{ maxWidth: '600px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="stats-label">Select Applicant</label>
                        <select
                            value={selectedApp}
                            onChange={(e) => setSelectedApp(e.target.value)}
                            style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'white' }}
                        >
                            <option value="">-- Choose Applicant --</option>
                            {applications.map(app => (
                                <option key={app.id} value={app.id}>{app.firstName} {app.lastName} (#{app.id})</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="stats-label">Select Program</label>
                        <select
                            value={selectedProgram}
                            onChange={(e) => handleProgramChange(e.target.value)}
                            style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'white' }}
                        >
                            <option value="">-- Choose Program --</option>
                            {programs.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="stats-label">Select Quota</label>
                        <select
                            value={selectedQuota}
                            onChange={(e) => setSelectedQuota(e.target.value)}
                            disabled={!selectedProgram}
                            style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'white' }}
                        >
                            <option value="">-- Choose Quota --</option>
                            {quotas.map(q => (
                                <option key={q.id} value={q.id}>{q.quotaType} ({q.filledSeats}/{q.totalSeats} full)</option>
                            ))}
                        </select>
                    </div>

                    {message && (
                        <div style={{
                            padding: '1rem',
                            borderRadius: '8px',
                            backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            padding: '1rem',
                            borderRadius: '8px',
                            fontWeight: '600',
                            marginTop: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        <UserPlus size={20} />
                        {loading ? 'Allocating...' : 'Allocate Seat'}
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default SeatAllocation;
