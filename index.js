require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const superAdminAuth = require('./routes/superAdminAuth');
const superAdminLogin = require('./routes/superAdminLogin');
const auth = require('./routes/auth');
const login = require('./routes/login');
const resetPassword = require('./routes/resetPassword');
const lessons = require('./routes/lessons');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//routes
app.use('/api/admin-sign-up', superAdminAuth);
app.use('/api/admin-login', superAdminLogin);
app.use('/api/register', auth);
app.use('/api/login', login);
app.use('/api/reset-password', resetPassword);
app.use('/api/lessons', lessons);

//Port
const port = process.env.PORT;
app.listen(port, () => console.log(`Server listening on ${port}....`));
