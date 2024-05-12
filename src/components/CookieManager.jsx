import Cookie from 'js-cookie';

const CookieManager = {
    setSessionCookie: (value) => {
        Cookie.set('DNSWebSession', value, { expires: 1 });
    },

    getSessionCookie: () => {
        // Retrieve the cookie, which is a base64-encoded timestamp
        Cookie.get('DNSWebSession');
    },

    removeSessionCookie: () => {
        // Remove the session cookie
        Cookie.remove('DNSWebSession');
    }
};

export default CookieManager;
