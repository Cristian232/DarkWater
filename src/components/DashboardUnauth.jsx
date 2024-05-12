import { useState, useEffect } from 'react';
import axios from '../api/AxiosConfig.jsx';
import styles from './DashboardUnauth.module.css';

const Dashboard = () => {
    const [domains, setDomains] = useState([]);
    const [serverStatus, setServerStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDomains();
    }, []);

    const check_alive = async (action) => {
        try {
            const result = await axios.get(`/check_alive`);
            console.log(JSON.stringify(result));
                setServerStatus(result.data);
        } catch (error) {
            console.error(`Failed to ${action}:`, error);
            setServerStatus('Server action failed.');
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDomains = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/get_domains`);
            console.log(JSON.stringify(response.data));
            setServerStatus('Fetched domains');
            setDomains(response.data);
            setError('');
        } catch (error) {
            console.error(error);
            setError('Failed to fetch domains.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.dashboardContainer}>
            <h2>Dashboard</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    <div className={styles.serverStatus}>{serverStatus || "Server Status"}</div>
                    <div>
                        <button onClick={check_alive} className={styles.actionButton}>
                            Check Server Status
                        </button>
                        <button onClick={fetchDomains} className={styles.actionButton}>
                            Fetch Domains
                        </button>
                    </div>
                    <h3>Domains</h3>
                    <ul className={styles.domainsList}>
                        {domains.map((domain, index) => (
                            <li key={domain.id} className={styles.domainItem}>
                                <span
                                    className={styles.domainName}>{domain.name}</span>
                                <div className={styles.domainActions}>
                                    <button
                                        className={styles.smallButton}>Update
                                    </button>
                                    <button
                                        className={styles.smallButton}>Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default Dashboard;
