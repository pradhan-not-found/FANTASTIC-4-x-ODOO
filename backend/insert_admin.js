const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');
db.run("INSERT INTO employees (id, name, email, password, role, status, joinDate) VALUES ('ADMIN001', 'Admin User', 'admin@f4.co', 'admin123', 'admin', 'active', '2026-01-01')", (err) => {
    if(err) console.error(err);
    else console.log('Admin inserted');
});
