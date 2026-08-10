// This file builds the Express app and wires up all the routes.
// server.js (one level up) is what actually starts listening on a port.

const express = require('express');
const app = express();

app.use(express.json()); // lets us read JSON request bodies as req.body

const userRoutes = require('./routes/userRoutes');
const connectRoutes = require('./routes/connectRoutes');
const rateRoutes = require('./routes/rateRoutes');

app.use('/users', userRoutes);
app.use('/connect', connectRoutes);
app.use('/rates', rateRoutes);

// simple health check, handy for confirming the server is alive
app.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
