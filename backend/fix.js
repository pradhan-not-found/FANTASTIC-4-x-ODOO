const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');
db.run("UPDATE employees SET password = 'password123' WHERE email = 'sattwik122006@gmail.com'", (err) => {
    if(err) console.error(err);
    else console.log('Password updated');
});
