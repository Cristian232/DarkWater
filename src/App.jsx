import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="api/" element={<LoginPage />} />
                <Route path="api/login" element={<LoginPage />} />
                <Route path="api/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
