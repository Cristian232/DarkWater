import Cookie from 'js-cookie';

const CookieManager = {
    setSessionCookie: () => {
        // Generate a current timestamp
        const timestamp = new Date().getTime();
        // Convert the timestamp to a base64 string
        const base64Timestamp = btoa(String(timestamp));
        // Set the cookie with the base64-encoded timestamp, set to expire in 1 day
        Cookie.set('DNSWebSession', base64Timestamp, { expires: 1 });
    },

    getSessionCookie: () => {
        // Retrieve the cookie, which is a base64-encoded timestamp
        const base64Timestamp = Cookie.get('DNSWebSession');
        // Optionally, you could convert it back to a normal timestamp if needed
        // const timestamp = atob(base64Timestamp);
        // return parseInt(timestamp, 10);
        return base64Timestamp;  // Return as base64 string if no conversion needed
    },

    removeSessionCookie: () => {
        // Remove the session cookie
        Cookie.remove('DNSWebSession');
    }
};

export default CookieManager;
