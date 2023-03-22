require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const superAdminSignUp = require('./routes/superAdminSignUp');
const superAdminLogin = require('./routes/superAdminLogin');
const adminSignUp = require('./routes/adminSignUp');
const adminLogin = require('./routes/adminLogin');
const resetPassword = require('./routes/resetPassword');
const lessons = require('./routes/lessons');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//routes
app.use('/api/super-admin-sign-up', superAdminSignUp);
app.use('/api/super-admin-login', superAdminLogin);
app.use('/api/admin-sign-up', adminSignUp);
app.use('/api/admin-login', adminLogin);
app.use('/api/reset-password', resetPassword);
app.use('/api/lessons', lessons);

//Port
const port = process.env.PORT;
app.listen(port, () => console.log(`Server listening on ${port}....`));
