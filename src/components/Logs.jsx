import { useState } from 'react';
import axios from '../api/AxiosConfig.jsx';




function Logs() {
    const [username, setUsername] = useState('');



    const handleGuestLogin = async () => {
        // Logic for guest access
        // Possible redirection or state update
        try {
            const response = axios.get('http://localhost:5000/get_log');
            console.log("TEST logs" +
                response.data
            )
            setUsername(response.data)
            // navigate('/dashboardUnauth');
        } catch (axiosError) {
            console.error("Login failed", axiosError);
        }
    };


    return (
        <div className={'ii'}>
            <button
                onClick={() => handleGuestLogin()}
                className={'styles.actionButton'}>Check Logs
            </button>
            <ul className={styles.domainsList}>
                {/*{domains.map((domain, index) => index === 0 ? (*/}
                {/*    // Make the first domain's name editable*/}
                {/*    <li key={domain.id || index}>*/}
                {/*       */}
                {/*    </li>*/}
                {/*) */}
                {/*))}*/}
                <p>test </p>
            </ul>
        </div>
    );
}

export default Logs;