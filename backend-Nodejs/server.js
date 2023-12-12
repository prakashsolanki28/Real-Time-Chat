const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const routes = require('./src/routes/index');
const databaseConnect = require('./database/config');
const authenticateJWT = require('./src/middleware/authMiddleware');

app.use(express.json({ limit: '10mb' }));
app.use(authenticateJWT);
databaseConnect();
app.use('/', routes);



const createWebSocketServerPublic = require('./websoketServerpublic');

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
