const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const shortUrlRoutes = require('./routes/shortUrlRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);
app.use('/', shortUrlRoutes);

module.exports = app;
