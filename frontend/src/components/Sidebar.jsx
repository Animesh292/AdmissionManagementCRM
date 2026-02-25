import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, CreditCard, UserPlus, LogOut, GraduationCap, CheckCircle } from 'lucide-react';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="logo-container">
                <GraduationCap size={32} color="#6366f1" />
                <span className="logo-text">Admission Portal</span>
            </div>

            <nav className="nav-links">
                <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/register-applicant" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <UserPlus size={20} />
                    <span>New Registration</span>
                </NavLink>
                <NavLink to="/documents" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <FileText size={20} />
                    <span>Documents</span>
                </NavLink>
                <NavLink to="/allocate-seat" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <Users size={20} />
                    <span>Seat-Allocation</span>
                </NavLink>
                <NavLink to="/pending-fees" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <CreditCard size={20} />
                    <span>Fees</span>
                </NavLink>
                <NavLink to="/confirm-admission" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <CheckCircle size={20} />
                    <span>Confirmation</span>
                </NavLink>
                <NavLink to="/admitted-students" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <GraduationCap size={20} />
                    <span>Admitted Students</span>
                </NavLink>
            </nav>

           
        </aside>
    );
};

export default Sidebar;
