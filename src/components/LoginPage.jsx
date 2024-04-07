import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css'; // Import the styles

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook for navigating

    const baseUrl = 'http://127.0.0.1:5000'; // Adjust with your actual backend URL

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Here you'd call your actual login endpoint
            // For demonstration, we're assuming the endpoint simply returns success
            await axios.post(`${baseUrl}/do_login`, { username, password });
            // Navigate to dashboard on successful login
            navigate('/dashboard');
        } catch (error) {
            console.error("Login failed:", error);
            // Handle login failure (e.g., display an error message)
        }
    };

    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <h2>Darkwater</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.inputField}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.inputField}
                />
                <button type="submit" className={styles.submitButton}>Login
                </button>
            </form>
        </div>
    );
}

export default LoginPage;
