const express = require('express');
const cors = require('./middleware/cors');
const requestLogger = require('./middleware/logger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const contactsRouter = require('./routes/contacts.routes');

const app = express();

app.disable('x-powered-by');
app.use(cors);
app.use(requestLogger);
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/contacts', contactsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
