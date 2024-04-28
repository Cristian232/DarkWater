import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CookieManager from './CookieManager'; // Ensure this import is correct
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [domains, setDomains] = useState([]);
    const [serverStatus, setServerStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        if (!CookieManager.getSessionCookie()) {
            navigate('/login'); // Redirect to login if no session
        }
        fetchDomains();
    }, []);


    const fetchDomains = async () => {
        try {
            const response = await axios.get(`/get_domains`);
            console.log(JSON.stringify(response))
            setDomains(response.data)
            console.log(JSON.stringify(response.data))
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("Testerror---------")
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.log("Testerrorrequest---------")
                console.error(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error', error.message);
            }
            console.error(error.config);
        } finally {
            setIsLoading(false);
        }
    };

    const handleServerAction = async (action) => {
        if (!CookieManager.getSessionCookie()) {
            navigate('/login');
            return;
        }
        try {
            let result = await axios.get(`/${action}`);
            console.log(JSON.stringify(result))
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

    const handleDeleteDomain = async (domainId) => {
        if (!CookieManager.getSessionCookie()) {
            navigate('/login');
            return;
        }
        const originalDomains = domains;
        const newDomains = domains.filter(domain => domain.id !== domainId);
        setDomains(newDomains); // Optimistically update the UI
        try {
            await axios.post(`/delete_domain`, { id: domainId }, {
                withCredentials: true
            });
        } catch (error) {
            console.error("Failed to delete domain:", error);
            setDomains(originalDomains); // Revert on error
        }
    };

    const handleUpdateDomain = async (domainId) => {
        if (!CookieManager.getSessionCookie()) {
            navigate('/login');
            return;
        }
        const newName = prompt("Please enter the new domain name:", "");
        if (newName !== null && newName !== "") {
            const originalDomains = [...domains];
            try {
                await axios.post(`/update_domain`, { id: domainId, name: newName });
                fetchDomains();
            } catch (error) {
                console.error("Failed to update domain:", error);
                setDomains(originalDomains); // Revert on error
            }
        }
    };

    const handleSignOut = () => {
        CookieManager.removeSessionCookie();
        navigate('/login'); // Redirect to login route
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
                        <button onClick={handleSignOut} className={styles.actionButton}>Sign Out</button>
                    </div>
                    <h3>Domains</h3>
                    <ul className={styles.domainsList}>
                        {domains.map((domain, index) => (
                            <li key={domain.id} className={styles.domainItem}>
                                <span className={styles.domainName}>{domain.name}</span>
                                <div className={styles.domainActions}>
                                    <button onClick={() => handleUpdateDomain(domain.id)} className={styles.smallButton}>Update</button>
                                    <button onClick={() => handleDeleteDomain(domain.id)} className={styles.smallButton}>Delete</button>
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
