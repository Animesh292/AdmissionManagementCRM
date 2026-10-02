import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserPlus, Send, CheckCircle } from 'lucide-react';

const RegisterApplicant = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        category: 'GM',
        entryType: 'Regular',
        quotaType: 'KCET',
        marks: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:3000/api/applications/register', formData);
            setSuccess(true);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                category: 'GM',
                entryType: 'Regular',
                quotaType: 'KCET',
                marks: ''
            });
            setTimeout(() => setSuccess(false), 5000);
        } catch (error) {
            alert("Error registering applicant: " + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div className="fade-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>New Applicant Registration</h1>
                <p style={{ color: 'var(--text-muted)' }}>Enter applicant details to start the admission process.</p>
            </header>

            <div className="glass-card" style={{ maxWidth: '800px' }}>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}
                    >
                        <CheckCircle size={20} />
                        Registration successful! The applicant is now ready for document verification.
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="John" />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required pattern="[A-Za-z0-9](?:[A-Za-z0-9._%+]|-)*@[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*(?:\.[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)+" title="Enter a valid email address, such as name@example.com." placeholder="john.doe@example.com" />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required pattern="(?:\+91(?: |-)?)?[6-9][0-9]{4}(?: |-)?[0-9]{5}" title="Enter a valid 10-digit Indian phone number, optionally with +91." placeholder="+91 9876543210" />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            <option value="GM">General Merit (GM)</option>
                            <option value="SC">SC</option>
                            <option value="ST">ST</option>
                            <option value="OBC">OBC</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Entry Type</label>
                        <select name="entryType" value={formData.entryType} onChange={handleChange}>
                            <option value="Regular">Regular</option>
                            <option value="Lateral">Lateral Entry</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Quota Type</label>
                        <select name="quotaType" value={formData.quotaType} onChange={handleChange}>
                            <option value="KCET">KCET</option>
                            <option value="COMEDK">COMEDK</option>
                            <option value="MANAGEMENT">Management</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Marks (%)</label>
                        <input type="number" min="0" max="100" step="0.01" name="marks" value={formData.marks} onChange={handleChange} required placeholder="85.50" />
                    </div>
                    <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button type="submit" className="nav-item" disabled={loading} style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem 2rem', width: 'auto' }}>
                            {loading ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                    <Send size={18} />
                                </motion.div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <UserPlus size={18} />
                                    Register Applicant
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
                label { font-size: 0.9rem; color: var(--text-muted); font-weight: 500; }
                input, select {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--border);
                    padding: 0.75rem;
                    border-radius: 8px;
                    color: var(--text);
                    outline: none;
                    transition: border-color 0.2s;
                }
                select option { background-color: var(--bg-card); color: var(--text-main); }
                input:focus, select:focus { border-color: var(--primary); }
                input::placeholder { color: rgba(255, 255, 255, 0.2); }
            `}</style>
        </motion.div>
    );
};

export default RegisterApplicant;
