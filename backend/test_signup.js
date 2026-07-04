const fetch = require('node-fetch');
fetch('http://localhost:3000/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        first: 'Test',
        last: 'User',
        email: 'test@f4.co',
        password: 'password123',
        role: 'employee'
    })
}).then(res => res.json()).then(console.log).catch(console.error);
