import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import DashboardUnauth from "./components/DashboardUnauth.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboardUnauth" element={<DashboardUnauth />} />
            </Routes>
        </Router>
    );
}

export default App;
