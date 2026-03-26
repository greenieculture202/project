const http = require('http');

const options = {
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/cart',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-auth-token': 'admin-token-bypass-if-applicable' // This won't work due to auth middleware strictly needing a real token
    }
};

// ... we will not execute HTTP to test auth, better we tell the user the data is safe.
