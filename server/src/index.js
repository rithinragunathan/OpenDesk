import cors from 'cors';
import express from 'express';
import { config } from './config.js';
import { initializeDb } from './db.js';
import { authRouter } from './routes/authRoutes.js';
import { issueRouter } from './routes/issueRoutes.js';

const app = express();

app.use(cors({ origin: config.clientUrl }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'environmental-platform-api' });
});

app.use('/api/auth', authRouter);
app.use('/api/issues', issueRouter);

initializeDb()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`API server listening on http://localhost:${config.port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database.', error);
    process.exit(1);
  });
