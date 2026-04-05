require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { query } = require('../db/connection');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const { rateLimit } = require('./middleware/rateLimit');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', async (req, res, next) => {
  try {
    const result = await query('SELECT NOW() AS now');
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: result.rows[0].now,
    });
  } catch (err) {
    next(err);
  }
});

app.use('/api', rateLimit({ windowMs: 60000, max: 100 }));

app.use('/api/projects', require('./routes/projects'));
app.use('/api/briefs', require('./routes/briefs'));
app.use('/api/brands', require('./routes/brands'));
app.use('/api/deliverables', require('./routes/deliverables'));
app.use('/api/billing', require('./routes/billing'));
app.use('/api/experts', require('./routes/experts'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/pipeline', require('./routes/pipeline'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/feedback', require('./routes/feedback'));

app.use(errorHandler);

const port = Number(process.env.PORT) || 3000;
if (require.main === module) {
  app.listen(port, () => {
    logger.info('Server listening', { port });
  });
}

module.exports = app;
