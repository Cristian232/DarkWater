import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import DashboardUnauth from "./components/DashboardUnauth.jsx";
import Logs from "./components/Logs.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboardUnauth" element={<DashboardUnauth />} />
                <Route path="/logs" element={<Logs />} />
            </Routes>
        </Router>
    );
}

export default App;
