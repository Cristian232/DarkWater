import Cookie from 'js-cookie';

const CookieManager = {
    setSessionCookie: (token) => {
        // const timestamp = Math.floor(Date.now() / 1000); // Current time in seconds
        // const base64Token = btoa(String(timestamp)); // Convert timestamp to string and encode in Base64
        // Cookie.set('session_id', base64Token, { expires: 1 }); // Set cookie with the encoded token
        Cookie.set('session_id', token, { expires: 1 });
    },

    getSessionCookie: () => {
        return Cookie.get('session_id');
    },

    removeSessionCookie: () => {
        Cookie.remove('session_id');
    }
};

export default CookieManager;
