import { useState } from 'react';
import axios from '../api/AxiosConfig.jsx';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import CookieManager from "./CookieManager.jsx";

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleGuestLogin = async (e) => {
        // Logic for guest access
        console.log('Continue as guest');
        // Possible redirection or state update
        e.preventDefault();
        setLoading(true);
        try {
            //const response = await axios.post(`/do_login`, { username, password });
            navigate('/dashboardUnauth');
        } catch (axiosError) {
            console.error("Login failed:", axiosError);
            setError('Failed to login. Please check your credentials and try again.');
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Username and password are required');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`/do_login`, { username, password });
            const token = response.data.sessionId;
            CookieManager.setSessionCookie(token);
            console.log("response --- " + JSON.stringify(response));
            console.log("responsedate ---- " + response.data.message)
            console.log("token ----- " + response.data.sessionId)
            navigate('/dashboard');
        } catch (axiosError) {
            console.error("Login failed:", axiosError);
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
                <button type="submit"
                        disabled={loading || !username || !password}
                        className={styles.submitButton}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <div className={styles.divider}>
                    <hr className={styles.line}/>
                    <span className={styles.or}>or</span>
                    <hr className={styles.line}/>
                </div>
                <button type="button" onClick={handleGuestLogin}
                        className={styles.submitButton}>
                    Continue as Guest
                </button>
            </form>
        </div>
    );
}

export default LoginPage;