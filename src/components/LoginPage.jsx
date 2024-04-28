import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import CookieManager from "./CookieManager.jsx";

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [request, setRequest] = useState(''); // State to handle custom request input
    const [response, setResponse] = useState(''); // State to display results from the request

    const navigate = useNavigate();
    const baseUrl = 'http://localhost:5000';

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
            navigate('/dashboard');
        } catch (error) {
            console.error("Login failed:", error);
            setError('Failed to login. Please check your credentials and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault(); // Prevent form submission from reloading the page
        if (!request) {
            setResponse('Please enter a request to send.'); // Prompt user to enter a request if empty
            return;
        }
        try {
            const res = await axios.get(`${request}`); // Make the GET request
            const formattedData = JSON.stringify(res.data, null, 2); // Format JSON data nicely with indentation
            console.log('Response Data:', formattedData); // Log formatted data for debugging
            setResponse(formattedData); // Update the response state with formatted data
        } catch (error) {
            console.error('Request Error:', error); // Log errors to console for debugging
            setResponse(`Request failed: ${error.message}`); // Display a user-friendly error message
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
            <form onSubmit={handleRequestSubmit} className={styles.testForm}>
                <input
                    type="text"
                    placeholder="Enter request endpoint"
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    className={styles.inputField}
                />
                <button type="submit" className={styles.submitButton}>
                    Send Request
                </button>
                {response && <div className={styles.responseBox}>{response}</div>}
            </form>
        </div>
    );
}

export default LoginPage;
