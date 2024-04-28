import { useState, useEffect } from 'react';
import {
    apiInstance,
    dnsInstance
} from '../api/AxiosConfig.jsx';
import { useNavigate } from 'react-router-dom';
import CookieManager from './CookieManager'; // Ensure this import is correct
import styles from './Dashboard.module.css';
import axios from "axios";

const Dashboard = () => {
    const [domains, setDomains] = useState([]);
    const [serverStatus, setServerStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [request, setRequest] = useState(''); // State to handle custom request input
    const [response, setResponse] = useState(''); // State to display results from the request
    const [request2, setRequest2] = useState(''); // State to handle custom request input
    const [response2, setResponse2] = useState(''); // State to display results from the request
    const [request3, setRequest3] = useState(''); // State to handle custom request input
    const [response3, setResponse3] = useState(''); // State to display results from the request




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
            if (action == 'start_server') {
                setServerStatus('Server is alive.');
            } else if (action == 'stop_server') {
                setServerStatus('Server is stopped.');
            } else if (action === 'restart_server') {
                setServerStatus('Server restarted.');
            } else if (action === 'check_alive') {
                setServerStatus('Checking alive');
            } else if (action === 'fetchDomains') {
                fetchDomains();
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

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        if (!request) {
            setResponse('Please enter a request to send.');
            return;
        }
        try {
            const res = await axios.get(`/${request}`);
            console.log("-----Request1" + JSON.stringify(res.data))
            setResponse(JSON.stringify(res.data));
        } catch (error) {
            setResponse('Request failed: ' + error.message);
        }
    };

    const handleRequestSubmit2 = async (e) => {
        e.preventDefault();
        if (!request2) {
            setResponse2('Please enter a request to send.');
            return;
        }
        try {
            const res = await apiInstance.get(`/${request2}`);
            console.log("-----Request2" + JSON.stringify(res.data))
            setResponse2(JSON.stringify(res.data));
        } catch (error) {
            setResponse2('Request failed: ' + error.message);
        }
    };

    const handleRequestSubmit3 = async (e) => {
        e.preventDefault();
        if (!request3) {
            setResponse3('Please enter a request to send.');
            return;
        }
        try {
            const res = await dnsInstance.get(`/${request3}`);
            console.log("-----Request3" + JSON.stringify(res.data))
            setResponse3(JSON.stringify(res.data));
        } catch (error) {
            setResponse3('Request failed: ' + error.message);
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
                        <button onClick={handleSignOut}
                                className={styles.actionButton}>Sign Out
                        </button>
                    </div>
                    <div>
                        <form onSubmit={handleRequestSubmit}
                              className={styles.testForm}>
                            <input
                                type="text"
                                placeholder="Enter request endpoint"
                                value={request}
                                onChange={(e) => setRequest(e.target.value)}
                                className={styles.inputField}
                            />
                            <button type="submit"
                                    className={styles.submitButton}>
                                Send Request
                            </button>
                            {response && <div
                                className={styles.responseBox}>{response}</div>}
                        </form>
                    </div>
                    <div>
                        <form onSubmit={handleRequestSubmit2}
                              className={styles.testForm}>
                            <input
                                type="text"
                                placeholder="Enter request endpoint"
                                value={request2}
                                onChange={(e) => setRequest2(e.target.value)}
                                className={styles.inputField}
                            />
                            <button type="submit"
                                    className={styles.submitButton}>
                                Send Request
                            </button>
                            {response2 && <div
                                className={styles.responseBox}>{response2}</div>}
                        </form>
                    </div>
                    <div>
                        <form onSubmit={handleRequestSubmit3}
                              className={styles.testForm}>
                            <input
                                type="text"
                                placeholder="Enter request endpoint"
                                value={request3}
                                onChange={(e) => setRequest3(e.target.value)}
                                className={styles.inputField}
                            />
                            <button type="submit"
                                    className={styles.submitButton}>
                                Send Request
                            </button>
                            {response3 && <div
                                className={styles.responseBox}>{response3}</div>}
                        </form>
                    </div>
                    <h3>Domains</h3>
                    <ul className={styles.domainsList}>
                        {domains.map((domain, index) => (
                            <li key={domain.id} className={styles.domainItem}>
                                <span
                                    className={styles.domainName}>{domain.name}</span>
                                <div className={styles.domainActions}>
                                    <button
                                        onClick={() => handleUpdateDomain(domain.id)}
                                        className={styles.smallButton}>Update
                                    </button>
                                    <button
                                        onClick={() => handleDeleteDomain(domain.id)}
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
