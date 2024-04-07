import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css'; // Ensure this path matches your CSS module for the Dashboard

const Dashboard = () => {
    const [domains, setDomains] = useState([]);
    const [serverStatus, setServerStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch domains from the server
    useEffect(() => {
        const fetchDomains = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://127.0.0.1:5000/get_domains');
                setDomains(response.data);
                setServerStatus('Server is alive.');
            } catch (error) {
                console.error("Failed to fetch domains:", error);
                setError('Failed to fetch domains.');
                setServerStatus('Server is not responding.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDomains();
    }, []);

    const handleServerAction = async (action) => {
        try {
            await axios.get(`http://127.0.0.1:5000/${action}`);
            if (action !== 'stop_server') {
                setServerStatus('Server is alive.');
            } else {
                setServerStatus('Server is stopped.');
            }
        } catch (error) {
            console.error(`Failed to ${action}:`, error);
            setServerStatus('Server action failed.');
        }
    };

    return (
        <div className={styles.dashboardContainer}>
            <h2>Dashboard</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    <div className={styles.serverStatus}>{serverStatus}</div>
                    <div>
                        <button onClick={() => handleServerAction('start_server')} className={styles.actionButton}>Start Server</button>
                        <button onClick={() => handleServerAction('stop_server')} className={styles.actionButton}>Stop Server</button>
                        <button onClick={() => handleServerAction('restart_server')} className={styles.actionButton}>Restart Server</button>
                    </div>
                    <h3>Domains</h3>
                    <ul className={styles.domainsList}>
                        {domains.map((domain, index) => (
                            <li key={index} className={styles.domainItem}>{domain.name}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default Dashboard;
