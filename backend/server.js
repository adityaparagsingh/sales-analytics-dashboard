import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import entityRoutes from './routes/entities.js';

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', entityRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error.' });
});

app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
