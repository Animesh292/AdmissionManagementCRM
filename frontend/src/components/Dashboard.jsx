import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import StatsCard from './StatsCard';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [intakeData, setIntakeData] = useState([]);
    const [quotaData, setQuotaData] = useState([]);
    const [pendingDocs, setPendingDocs] = useState([]);
    const [feePending, setFeePending] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE = 'http://localhost:3000/api/dashboard';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [intakeRes, quotaRes, docsRes, feesRes] = await Promise.all([
                    axios.get(`${API_BASE}/intake-vs-admitted`),
                    axios.get(`${API_BASE}/quota-status`),
                    axios.get(`${API_BASE}/pending-documents`),
                    axios.get(`${API_BASE}/fee-pending`)
                ]);

                setIntakeData(intakeRes.data);
                setQuotaData(quotaRes.data);
                setPendingDocs(docsRes.data);
                setFeePending(feesRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#ef4444'];

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>Loading Premium Dashboard...</div>;

    const totalIntake = intakeData.reduce((acc, curr) => acc + curr.intake, 0);
    const totalAdmitted = intakeData.reduce((acc, curr) => acc + curr.admitted, 0);

    return (
        <div className="fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard Overview</h1>
                <p style={{ color: 'var(--text-muted)' }}>Welcome back! Here's what's happening with admissions today.</p>
            </header>

            <div className="dashboard-grid">
                <StatsCard label="Total Intake" value={totalIntake} icon={Users} color="#6366f1" delay={0.1} />
                <StatsCard label="Total Admitted" value={totalAdmitted} icon={CheckCircle} color="#10b981" delay={0.2} />
                <StatsCard label="Pending Docs" value={pendingDocs.length} icon={FileText} color="#f59e0b" delay={0.3} />
                <StatsCard label="Fee Pending" value={feePending.length} icon={Clock} color="#ef4444" delay={0.4} />
            </div>

            <div className="charts-grid">
                <motion.div
                    className="glass-card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <h3 style={{ marginBottom: '1.5rem' }}>Intake vs Admitted (Program wise)</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={intakeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="programName" stroke="var(--text-muted)" fontSize={12} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--text-main)' }}
                                />
                                <Legend />
                                <Bar dataKey="intake" fill="rgba(99, 102, 241, 0.2)" radius={[4, 4, 0, 0]} name="Capacity" />
                                <Bar dataKey="admitted" fill="#6366f1" radius={[4, 4, 0, 0]} name="Admitted" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    className="glass-card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <h3 style={{ marginBottom: '1.5rem' }}>Quota Distribution</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={quotaData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="filledSeats"
                                    nameKey="quotaType"
                                >
                                    {quotaData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Pending Document Verification</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Applicant ID</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Department</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingDocs.slice(0, 5).map((app) => (
                                <tr key={app.id}>
                                    <td>#{app.id}</td>
                                    <td>{app.applicantName || 'Applicant'}</td>
                                    <td><span className="badge badge-pending">PENDING</span></td>
                                    <td>{app.Program?.name || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
