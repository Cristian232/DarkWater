import Cookie from 'js-cookie';

const CookieManager = {
    setSessionCookie: (token) => {
        Cookie.set('DNSWebSession', token, { expires: 1 });
    },

    getSessionCookie: () => {
        return Cookie.get('DNSWebSession');
    },

    removeSessionCookie: () => {
        Cookie.remove('DNSWebSession');
    }
};

export default CookieManager;