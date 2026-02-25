import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SeatAllocation from './pages/SeatAllocation';
import FeePendingList from './pages/FeePendingList';
import AdmissionConfirmation from './pages/AdmissionConfirmation';
import Documents from './pages/Documents';
import RegisterApplicant from './pages/RegisterApplicant';
import AdmittedStudents from './pages/AdmittedStudents';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/allocate-seat" element={<SeatAllocation />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/pending-fees" element={<FeePendingList />} />
            <Route path="/confirm-admission" element={<AdmissionConfirmation />} />
            <Route path="/register-applicant" element={<RegisterApplicant />} />
            <Route path="/admitted-students" element={<AdmittedStudents />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
