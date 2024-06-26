import { useState, useEffect } from 'react';
import axios from '../api/AxiosConfig.jsx';
import { useNavigate } from 'react-router-dom';
import CookieManager from './CookieManager'; // Ensure this import is correct
import styles from './Dashboard.module.css';


const Dashboard = () => {
    const [domains, setDomains] = useState([]);
    const [serverStatus, setServerStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [placeholder, setPlaceholder] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [logs, setLogs] = useState('');

    useEffect(() => {
        if (!CookieManager.getSessionCookie()) {
            navigate('/login'); // Redirect to login if no session
        }
        fetchDomains(currentPage);
    }, [currentPage]);

    // const fetchDomains = async () => {
    //     setIsLoading(true);
    //     try {
    //         const response = await axios.get(`/get_domains`);
    //         console.log(JSON.stringify(response.data));
    //         setServerStatus('Fetched domains');
    //         setDomains(response.data);
    //         setError('');
    //     } catch (error) {
    //         console.error(error);
    //         setError('Failed to fetch domains.');
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const fetchDomains = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/get_domains/${currentPage}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            console.log("check me --- " + JSON.stringify(response.data));
            setServerStatus('Fetched domains');
            setDomains(response.data.domains || response.data); // Adjust depending on API response structure
            setError('');
        } catch (error) {
            console.error(error);
            setError('Failed to fetch domains.');
        } finally {
            setIsLoading(false);
        }
    };

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

    const restart_server = async (action) => {
        try {
            const result = await axios.get(`/restart_server`);
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

    const stop_server = async (action) => {
        try {
            const result = await axios.get(`/stop_server`);
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

    const start_server = async (action) => {
        try {
            const result = await axios.get(`/start_server`);
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
    const handleServerAction = async (action) => {
        if (!CookieManager.getSessionCookie()) {
            navigate('/login');
            return;
        }
        try {
            // let result = await axios.get(`/${action}`);
            // console.log(JSON.stringify(result))
            if (action == 'start_server') {
                start_server();
            } else if (action == 'stop_server') {
                stop_server()
            } else if (action === 'restart_server') {
                restart_server()
            } else if (action === 'check_alive') {
                check_alive();
            } else if (action === 'fetchDomains') {
                fetchDomains();
            }
        } catch (error) {
            console.error(`Failed to ${action}:`, error);
            setServerStatus('Server action failed.');
        }
    };

    const handleDeleteDomain = async () => {
        const url = '/delete_domain';

        const data =
            domains[1]
        ;
        const options = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true, // This is necessary to send cookies with the request
        };

        // Set the DNSWebSession cookie if it's not handled by the browser automatically
        // Note: In browsers, document.cookie may not be able to set HttpOnly cookies
        document.cookie = 'DNSWebSession=MA==';

        try {
            const response = await axios.post(url, data, options);
            console.log('Success:', response.data);
            fetchDomains()
            setServerStatus(response.data);
        } catch (error) {
            console.error('Failed to delete domains:', error);
        }
    };



    const updateDomains = async () => {
        const url = '/update_log';

        const data =
            placeholder;
        const options = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true, // This is necessary to send cookies with the request
        };

        // Set the DNSWebSession cookie if it's not handled by the browser automatically
        // Note: In browsers, document.cookie may not be able to set HttpOnly cookies
        document.cookie = 'DNSWebSession=MA==';

        try {
            const response = await axios.post(url, data, options);
            console.log('Success:', response.data);
            fetchDomains()
            setServerStatus(response.data);
        } catch (error) {
            console.error('Failed to update domains:', error);
        }
    };

    const handleSignOut = () => {
        CookieManager.removeSessionCookie();
        navigate('/login'); // Redirect to login route
    };

    const goToNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handleNavigateLogs = async () => {
        try {
            const response = await axios.get('/get_log');
            console.log("TEST logs", response.data);
            setLogs(response.data); // Assuming response.data is the log data you want to display
        } catch (axiosError) {
            console.error("Login failed", axiosError);
        }
    };

    // const handleupdate = async () => {
    //     try {
    //         let data =
    //         const response = await axios.get('/update_log');
    //         const response = await axios.post(url, data, options);
    //         console.log("update logs", response.data);
    //         setLogs(response.data); // Assuming response.data is the log data you want to display
    //     } catch (axiosError) {
    //         console.error("Login failed", axiosError);
    //     }
    // };

    return (
        <div className={styles.dashboardContainer}>
            <h2>Dashboard</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <>
                    <div
                        className={styles.serverStatus}>{serverStatus || "Server Status"}</div>
                    <div>
                        <button
                            onClick={() => handleServerAction('start_server')}
                            className={styles.actionButton}>Start Server
                        </button>
                        <button
                            onClick={() => handleServerAction('stop_server')}
                            className={styles.actionButton}>Stop Server
                        </button>
                        <button
                            onClick={() => handleServerAction('restart_server')}
                            className={styles.actionButton}>Restart Server
                        </button>
                        <button
                            onClick={() => handleServerAction('check_alive')}
                            className={styles.actionButton}>Check Alive
                        </button>
                        <button
                            onClick={() => handleServerAction('fetchDomains')}
                            className={styles.actionButton}>Fetch Domains
                        </button>
                        <button onClick={handleNavigateLogs}
                                className={styles.actionButton}>Get Logs
                        </button>
                        <button onClick={handleSignOut}
                                className={styles.actionButton}>Sign Out
                        </button>
                    </div>

                    <h3>Domains</h3>
                    <ul className={styles.domainsList}>
                        {domains.map((domain, index) => index === 0 ? (
                            // Make the first domain's name editable
                            <li key={domain.id || index}
                                className={styles.domainItem}>
                                <input
                                    type="text"
                                    value={placeholder || domain.name}
                                    onChange={(e) => setPlaceholder(e.target.value)}
                                    className={styles.editableInput}
                                />
                                <button
                                    onClick={() => updateDomains()}
                                    className={styles.smallButton}>Update Log
                                </button>
                            </li>
                        ) : (
                            // Display the second domain normally
                            <li key={domain.id || index}
                                className={styles.domainItem}>
                                <span
                                    className={styles.domainName}>{domain.name}</span>
                                <div className={styles.domainActions}>

                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className={styles.pagination}>
                        <button onClick={goToPreviousPage}
                                disabled={currentPage === 1}>Previous
                        </button>
                        <span>Page {currentPage}</span>
                        <button onClick={goToNextPage}
                                disabled={domains.length === 0}>Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
