const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userInfoRoutes = require('./routes/userInfoRoutes'); 
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use('/api/userInfo', userInfoRoutes);
app.use('/api/auth', authRoutes);
app.use(express.json());

app.listen(5000, '0.0.0.0', () => console.log('Server running on port 5000'));

module.exports = { app };