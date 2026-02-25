import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ label, value, icon: Icon, color, delay = 0 }) => {
    return (
        <motion.div
            className="glass-card stats-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="stats-label">{label}</div>
                <div style={{ backgroundColor: `${color}15`, padding: '8px', borderRadius: '10px' }}>
                    <Icon size={24} color={color} />
                </div>
            </div>
            <div className="stats-value">{value}</div>
        </motion.div>
    );
};

export default StatsCard;
