import { useState, useEffect } from 'react';
import axios from '../api/AxiosConfig.jsx';
import { useNavigate } from 'react-router-dom';
import styles from './DashboardUnauth.module.css';


const Dashboard = () => {
    const [domains, setDomains] = useState([]);
    const [serverStatus, setServerStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');




    useEffect(() => {
        fetchDomains();
    }, []);

    const handleServerAction = async (action) => {
        try {
            let result = await axios.get(`/${action}`);
            console.log(JSON.stringify(result))
            if (action === 'fetchDomains') {
                fetchDomains()
                setServerStatus("Fetched domains");
            } else if (action === 'check_alive') {
                try {
                    const response = await axios.get(`/check_alive`);
                    console.log(JSON.stringify(response.data))
                    setServerStatus(response.data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            }
        } catch (error) {
            console.error(`Failed to ${action}:`, error);
            setServerStatus('Server action failed.');
        }
    };

    const fetchDomains = async () => {
        try {
            const response = await axios.get(`/get_domains`);
            console.log(JSON.stringify(response.data))
            setDomains(response.data)
        } catch (error) {
            console.error(error);
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
                <p>{error}</p>
            ) : (
                <>
                    <div className={styles.serverStatus}>{serverStatus.length > 0 ? {serverStatus} : ("Server Status") }</div>
                    <div>
                        <button
                            onClick={() => handleServerAction('check_alive')}
                            className={styles.actionButton}>Check Alive
                        </button>
                        <button
                            onClick={() => handleServerAction('fetchDomains')}
                            className={styles.actionButton}>Fetch Domains
                        </button>
                    </div>
                    <h3>Domains</h3>
                    <ul className={styles.domainsList}>
                        {domains.map((domain, index) => (
                            <li key={domain.id} className={styles.domainItem}>
                                <span
                                    className={styles.domainName}>{domain.name}</span>
                                <div className={styles.domainActions}>
                                    <div className={styles.domainActions}>
                                        <button
                                            className={styles.smallButton}>Update
                                        </button>
                                        <button
                                            className={styles.smallButton}>Delete
                                        </button>
                                    </div>
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
