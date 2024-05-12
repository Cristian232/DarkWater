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
    const [request, setRequest] = useState(''); // State to handle custom request input
    const [response, setResponse] = useState(''); // State to display results from the request


    useEffect(() => {
        if (!CookieManager.getSessionCookie()) {
            navigate('/login'); // Redirect to login if no session
        }
        fetchDomains();
    }, []);

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

    const handleServerAction = async (action) => {
        if (!CookieManager.getSessionCookie()) {
            navigate('/login');
            return;
        }
        try {
            // let result = await axios.get(`/${action}`);
            // console.log(JSON.stringify(result))
            if (action == 'start_server') {
                setServerStatus(result.data);
            } else if (action == 'stop_server') {
                setServerStatus(result.data);
            } else if (action === 'restart_server') {
                setServerStatus(result.data);
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
        const sessionCookie = CookieManager.getSessionCookie();
        if (!sessionCookie) {
            navigate('/login');
            return;
        }

        const newName = prompt("Please enter the new domain name:", "");
        if (newName !== null && newName.trim() !== "") {
            document.cookie = 'DNSWebSession=MA==';
            try {
                const response = await axios.post(`/update_domain`, [{
                    name: newName
                }], {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': `session_id=${sessionCookie}` // Assuming cookies need to be manually set
                    },
                    withCredentials: true
                });
                console.log('Update response1:', response.data);
                console.log(JSON.stringify({ id: domainId, name: newName }));

                console.log('Update response2:', response.data);
                fetchDomains(); // Refresh the list after successful update
            } catch (error) {
                console.error("Failed to update domain:", error);
                alert('Failed to update domain. Please try again.'); // Provide feedback to the user
            }
        } else {
            alert('No name entered or update cancelled.');
        }
    };


    const updateDomains = async () => {
        const url = 'http://192.168.1.58:5000/update_domain';
        const data = [
            { name: "place.holder" },
            { name: "test.com" }
        ];
        const options = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true, // This is necessary to send cookies with the request
        };

        // Set the DNSWebSession cookie if it's not handled by the browser automatically
        // Note: In browsers, document.cookie may not be able to set HttpOnly cookies
        document.cookie = 'DNSWebSession=MA==';
        // let DNSWebSession;
        // document.cookie= DNSWebSession="MTcxNTUyMTAxOA==";


        try {
            const response = await axios.post(url, data, options);
            console.log('Success:', response.data);
        } catch (error) {
            console.error('Failed to update domains:', error);
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
