const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userInfoRoutes = require('./routes/userInfoRoutes'); 

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use('/api/userInfo', userInfoRoutes);
app.use(express.json());

app.listen(5000, () => console.log(`Server running on port 5000`));

module.exports = { app };