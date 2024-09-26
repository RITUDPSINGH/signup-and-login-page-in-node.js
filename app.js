const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '\employee-auth\public\index.html');
});


app.post('/signup', (req, res) => {
    const employeeId = req.body.employeeId;
    const password = req.body.password;

    
    const fileName = `employees_${employeeId}.txt`;

    
    fs.writeFile(fileName, `${employeeId}:${password}`, (err) => {
        if (err) throw err;
        res.send('Signup successful! You can now log in.');
    });
});


app.post('/login', (req, res) => {
    const employeeId = req.body.employeeId;
    const password = req.body.password;
    const fileName = `employees_${employeeId}.txt`;

    
    fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) {
            return res.send('Invalid Employee ID or not signed up.');
        }

        const [storedId, storedPassword] = data.split(':');
        if (storedId === employeeId && storedPassword === password) {
            res.redirect(`/welcome?employeeId=${employeeId}`);
        } else {
            res.send('Invalid Employee ID or Password.');
        }
    });
});


app.get('/welcome', (req, res) => {
    const employeeId = req.query.employeeId;
    res.sendFile(__dirname + 'employee-auth/public/welcome.html');
});


app.get('/another-file', (req, res) => {
    res.sendFile(__dirname + '/public/another-file.html');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});