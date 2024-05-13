import { useState, useEffect } from 'react';
import axios from '../api/AxiosConfig.jsx';
import styles from './DashboardUnauth.module.css';

const Dashboard = () => {
    const [domains, setDomains] = useState([]);
    const [serverStatus, setServerStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchDomains(currentPage);
    }, [currentPage]);

    const check_alive = async () => {
        setIsLoading(true);
        try {
            const result = await axios.get(`/check_alive`);
            console.log(JSON.stringify(result));
            setServerStatus(result.data);
            setError('');
        } catch (error) {
            console.error('Failed to check server status:', error);
            setServerStatus('Server action failed.');
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDomains = async (page) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/get_domains`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                params: { page }
            });
            console.log(JSON.stringify(response.data));
            setServerStatus('Fetched domains');
            setDomains(response.data.domains || response.data); // Adjust depending on API response structure
            setError('');
        } catch (error) {
            console.error('Failed to fetch domains:', error);
            setError('Failed to fetch domains.');
        } finally {
            setIsLoading(false);
        }
    };

    const goToNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
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
                        <button onClick={() => fetchDomains(currentPage)} className={styles.actionButton}>
                            Fetch Domains
                        </button>
                    </div>
                    <h3>Domains</h3>
                    <ul className={styles.domainsList}>
                        {domains.map((domain, index) => (
                            <li key={domain.id || index} className={styles.domainItem}>
                                <span className={styles.domainName}>{domain.name}</span>
                            </li>
                        ))}
                    </ul>
                    <div className={styles.pagination}>
                        <button onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
                        <span>Page {currentPage}</span>
                        <button onClick={goToNextPage} disabled={domains.length === 0}>Next</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
