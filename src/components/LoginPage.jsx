import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import CookieManager from "./CookieManager.jsx"; // Import the styles

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State to handle error messages
    const [loading, setLoading] = useState(false); // State to handle button loading state
    const navigate = useNavigate(); // Hook for navigating

    const baseUrl = 'http://localhost:5000'; // Use HTTPS in production

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Username and password are required');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/do_login`, { username, password });
            const token = response.data.sessionID;
            CookieManager.setSessionCookie(token);
            console.log("response -- " + JSON.stringify(response));
            console.log("responsedate -- " + response.data.message)
            console.log("token -- " + response.data.sessionID)
            navigate('/dashboard');
        } catch (error) {
            console.error("Login failed:", error);
            setError('Failed to login. Please check your credentials and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <h2>Darkwater</h2>
                {error && <p className={styles.error}>{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    aria-label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.inputField}
                />
                <input
                    type="password"
                    placeholder="Password"
                    aria-label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.inputField}
                />
                <button type="submit" disabled={loading} className={styles.submitButton}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default LoginPage;
