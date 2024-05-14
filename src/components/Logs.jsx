import { useState } from 'react';
import axios from '../api/AxiosConfig.jsx';
import { useNavigate } from 'react-router-dom';
import CookieManager from "./CookieManager.jsx";

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleGuestLogin = async (e) => {
        // Logic for guest access
        // Possible redirection or state update
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.get(`/get_logs`);
            console.log(
                response.data
            )
            // navigate('/dashboardUnauth');
        } catch (axiosError) {
            console.error("Login failed:", axiosError);
            setError('Failed to login. Please check your credentials and try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={styles.loginContainer}>

        </div>
    );
}

export default LoginPage;