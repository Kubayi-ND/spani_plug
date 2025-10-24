import express from 'express';
import cors from 'cors';
import servicesRoutes from './routes/servicesRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/services', servicesRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
